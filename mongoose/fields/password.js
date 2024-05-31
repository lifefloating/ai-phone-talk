const { promisify } = require('util')
const bcrypt = require('bcryptjs')
const hash = promisify(bcrypt.hash)
const compare = promisify(bcrypt.compare)
const BaseField = require('./base')

class Password extends BaseField {
    wrap(schema) {
        schema.add({
            password: {
                type: String,
                select: false
            }
        })
        schema.pre('save', function (next) {
            if (this.isModified('password')) {
                hash(this.password, 5).then((hash) => {
                    this.password = hash
                    next()
                }).catch(next)
            } else {
                next()
            }
        })
        schema.methods = Object.assign(schema.methods, {
            compwd(password) {
                return compare(password, this.password)
            }
        })
    }
}

module.exports = new Password()