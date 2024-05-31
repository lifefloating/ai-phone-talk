const _ = require('lodash')
const mongoose = require('mongoose')

function normalizeDecimal(schema) {
    schema.set('toJSON', {
        getters: true,
        transform: (document, json) => {
            Object.keys(json).forEach((key) => {
                if (json[key] && json[key] instanceof mongoose.Types.Decimal128) {
                    json[key] = json[key].toString()
                }
            })
            delete json.__version
            delete json._id
            return json
        },
    })
}

module.exports = {
    normalizeDecimal,
}