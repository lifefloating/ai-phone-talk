const mongoose = require('mongoose')

const PointSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
    },
    coordinates: {
        type: [Number],
    }
}, { _id: false })

module.exports = PointSchema