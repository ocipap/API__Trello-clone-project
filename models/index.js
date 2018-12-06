const fs = require('fs')
const path = require('path')
const basename = path.basename(__filename)
const Sequelize = require('sequelize')
const config = require('../config/db.config')
const db = {};

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password, {
        'host': config.host,
        'port': config.port,
        'dialect': config.dialect
    }
)

/* sequelize model define */
fs.readdirSync(__dirname).filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
}).forEach((file) => {
    var model = sequelize['import'](path.join(__dirname, file))
    db[model.name] = model
})

Object.values(db).filter(model => model.hasOwnProperty('association'))
    .forEach(model => model['association'](db))

module.exports = {
    sequelize,
    db
}