const mongoose = require('mongoose')
const { Schema, Types } = mongoose
const BaseField = require('./fields/base')

const QueryHelpers = function (schema) {
    schema.query['page'] = function (page, limit) {
        if (!page) {
            page = 1
        }
        if (!limit) {
            limit = 10
        }
        return this.skip((+page - 1) * +limit).limit(+limit)
    }
}

const BaseSchema = (modelName, definition, options = {}) => {
    let columns = {}
    let fields = []
    for (const key in definition) {
        let value = definition[key]
        if (value instanceof BaseField) {
            fields.push(value)
        } else {
            columns[key] = value
        }
    }
    // Create schema
    const schema = new Schema(columns, Object.assign({
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        },
        toJSON: { virtuals: true, getters: true },
    }, options))
    // Install fields
    if (fields.length > 0) {
        fields.forEach((field) => {
            field.wrap(schema)
        })
    }
    // Install helpers
    QueryHelpers(schema)
    schema.set('toJSON', {
        getters: true,
        virtuals: true,
        transform: (document, json) => {
            delete json.__version
            delete json._id
            return json
        },
    })
    if (modelName) {
        return mongoose.model(modelName, schema)
    } else {
        return schema
    }
}

BaseSchema.ObjectId = Schema.Types.ObjectId
BaseSchema.Decimal128 = Schema.Types.Decimal128
BaseSchema.Mixed = Schema.Types.Mixed
BaseSchema.Field = require('./fields')
BaseSchema.Id = function (id) {
    return new Types.ObjectId(id)
}
BaseSchema.genId = function () {
    return mongoose.Types.ObjectId()
}

module.exports = BaseSchema