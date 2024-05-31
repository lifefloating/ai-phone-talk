
const loadDatabase = require('./database')
const loadRoutes = require('./routes')

async function initialize(app) {
    let connection = await loadDatabase()
    await loadRoutes(app)
    return connection
}

module.exports = initialize