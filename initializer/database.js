const config = require('config')
const mongoose = require('mongoose')
// const logger = require('../logger/logger')
const User = require('../models/user')
const { v4 } = require('node-uuid')

mongoose.set('debug', config.get('debug'))

async function inject() {
    if (!await User.findOne({ roles: 'root' })) {
        await User.create({
            name: '超级管理员',
            username: 'admin',
            password: "admin",
            roles: ['root'],
            phone: `${v4()}`,
        })
    }
}
async function connectDatabase() {
    let connection = await mongoose.connect(config.mongodb, {
        useNewUrlParser: true,
        socketTimeoutMS: 360000 * 2,
        useUnifiedTopology: true
    })
    // logger.info(`mongodb has connected`)
    console.log(`mongodb has connected`)
    await inject()
    return connection
}

module.exports = connectDatabase