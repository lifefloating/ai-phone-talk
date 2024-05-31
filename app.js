const _ = require('lodash')
const Koa = require('koa')
const path = require('path')
const fs = require('fs-extra')
const config = require('config')
const render = require('koa-ejs')
const KoaCors = require('@koa/cors')
const KoaStatic = require('koa-static')
const KoaCompress = require('koa-compress')
const KoaBodyparser = require('koa-bodyparser')
// const httpLogger = require('./middlewares/httpLogger')
const initializer = require('./initializer')
// const logger = require('./logger/logger')
const app = new Koa()

render(app, {
    root: path.join(__dirname, 'public'),
    layout: 'template',
    cache: false,
    debug: false
})

async function startApp() {
    await fs.ensureDir(path.join(__dirname, 'temp'))
    await fs.ensureDir(path.join(__dirname, 'uploads'))
    app.use(KoaCompress())
    app.use(KoaCors({
        allowHeaders: '*',
    }))
    app.use(KoaStatic(path.join(__dirname, 'public')))
    app.use(KoaBodyparser({
        formLimit: "10mb",
        jsonLimit: "10mb",
        enableTypes: ['json', 'form', 'text'],
        extendTypes: {
            text: ['text/xml', 'application/xml']
        }
    }))
    // app.use(httpLogger(app))
    await initializer(app)
    await new Promise((resolve, reject) => {
        app.listen(config.get('port'), (err) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
    // logger.info(`server listen in ${config.get('port')}`)

    // console.log => log4js TODO
    process.on('SIGINT', () => {
        // app.close?
        process.exit()
    })

    process.on('uncaughtException', (err) => {
        console.error('An uncaught error occurred in worker!')
        console.error(err.stack)
    })

    process.on('unhandledRejection', (reason, p) => {
        console.error('Unhandled Rejection at reason:', reason)
        console.error(p)

        // application specific an error ...
    })
}

startApp()