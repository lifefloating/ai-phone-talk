const _ = require('lodash');
const router = require('.');
const User = require('../models/user');
const twilio = require('twilio');
// const logger = require('../logger/logger');
const config = require('config');
const { Configuration, OpenAIApi } = require('openai');
// const { OpenAI } = require('openai');

const { openai_api_key } = config.get("openai");
const { twilio_account_sid, twilio_auth_token, twilio_phone_number} = config.get("twilio");

const configuration = new Configuration({
    apiKey: openai_api_key,
  });
const openai = new OpenAIApi(configuration);


// Twilio webhook to handle incoming calls
router.post('/voice', async (ctx) => {
    const twiml = new twilio.twiml.VoiceResponse();

    const conversation = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: 'Please ask the user for their name, occupation, residence, gender, marital status, hobbies, favorite food',
      max_tokens: 150,
      n: 1,
      stop: null,
      temperature: 0.5
    });

    twiml.gather({
        input: 'speech',
        action: '/respond',
        method: 'POST'
    }).say(conversation.data.choices[0].text);

    ctx.type = 'text/xml';
    ctx.body = twiml.toString();
});

router.post('/respond', async (ctx) => {
    const speechResult = ctx.request.body.SpeechResult;
    const userPhone = ctx.request.body.From;

    // Assuming the speechResult contains comma-separated values for name, occupation, residence, gender, married, hobbies, favorite food
    const [name, occupation, residence, gender, married, hobbies, favorite_food] = speechResult.split(',');

    const newUser = new User({
        phone: userPhone,
        details: { phone: userPhone, name, occupation, residence, gender, married, hobbies, favorite_food }
    });

    await newUser.save();

    // Send SMS with follow-up questions
    const client = new twilio(twilio_account_sid, twilio_auth_token);
    client.messages.create({
        body: 'What is your phone model, recent travel plans, and frequent countries you visit?',
        from: twilio_phone_number,
        to: userPhone
    }).then((message) => console.log('Message sent:', message.sid))
    .catch(err => console.log('Error sending message:', err));

    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say('Thank you for providing your details. We will follow up with a text message shortly.');
    
    ctx.type = 'text/xml';
    ctx.body = twiml.toString();
});

// Endpoint to handle incoming SMS responses
router.post('/sms', async (ctx) => {
    const [phone_model, travel_plans, frequent_countries] = ctx.request.body.Body.split(',');
    const from = ctx.request.body.From;

    const user = await User.findOneAndUpdate(
        { phone: from },
        { 'details.phone_model': phone_model, 'details.travel_plans': travel_plans, 'details.frequent_countries': frequent_countries },
        { new: true }
    );

    if (user) {
        console.log('User updated:', user);
    } else {
        console.log('User not found for phone:', from);
    }

    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message('Thank you! Your information has been updated.');

    ctx.type = 'text/xml';
    ctx.body = twiml.toString();
});