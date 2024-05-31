const Schema = require('../mongoose')

// 用户
const User = Schema('User', {
    // 手机号
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    details: {
        phone: Number,
        name: String,
        occupation: String,
        residence: String,
        gender: String,
        married: String,
        hobbies: String,
        favorite_food: String,
        phone_model: String,
        travel_plans: String,
        frequent_countries: String,
    },
    // 软删除
    deleted_at: Date,
})

module.exports = User