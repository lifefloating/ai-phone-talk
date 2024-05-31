const glob = require('glob')

function loadRoutes(app) {
    const routes = glob.sync(`${__dirname}/../routes/**/!(index).js`)
    for (let i = 0; i < routes.length; i++) {
        require(routes[i])
    }
    const router = require('../routes/index')
    app.use(router.routes())
    app.use(router.allowedMethods())
}

module.exports = loadRoutes