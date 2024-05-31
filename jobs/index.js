const _ = require('lodash')
const Bull = require('bull')
const moment = require('moment')
const config = require('config')

const QUEUE = new Bull('QUEUE')

QUEUE.process(async (job) => {

})

module.exports = {
    QUEUE
}