/**
 * Created by yangqiqi
 */

const log4js = require('log4js')
const conf = require('config')
const path = require('path')
const _ = require('lodash')
const fs = require('fs')

const $conf = _.cloneDeep(conf)

const logpath = process.env.NODE_ENV ? `${$conf.logpath}/api` : path.join(__dirname, '../logs/api')
if (!fs.existsSync(logpath)) {
    fs.mkdirSync(logpath, { recursive: true });
}

$conf.logger.appenders.task.filename = logpath
log4js.configure($conf.logger)
const dateFileLog = log4js.getLogger('file')
const consoleLog = log4js.getLogger('display')

const logger = {
    dev: consoleLog,
    test: consoleLog,
    prod: consoleLog
}[process.env.NODE_ENV || 'dev']

// todo 这里logger.info尽量不加中文 会丢日志 有空看下
module.exports = {
    trace:logger.trace.bind(logger),
    debug:logger.debug.bind(logger),
    info: logger.info.bind(logger),
    warn:logger.warn.bind(logger),
    error: logger.error.bind(logger),
    fatal: logger.fatal.bind(logger)
}