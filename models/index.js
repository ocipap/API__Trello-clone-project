const fs = require('fs')
const path = require('path')
const basename = path.basename(__filename)
const Sequelize = require('sequelize')
const db = {};

const sequelize = new Sequelize(
    'trello',
    'root',
    'ocipap0531', {
        'host': 'localhost',
        'port': 3306,
        'dialect': 'mysql'
    }
)

/* sequelize model define */
fs.readdirSync(__dirname).filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
}).forEach((file) => {
    var model = sequelize['import'](path.join(__dirname, file))
    db[model.name] = model
})

/* Setting associations */
db.board.belongsTo(db.user, {
    foreignKey: 'user_id',
    targetKey: 'uid'
});

db.board.hasMany(db.member, {
    foreignKey: 'bid'
})

db.member.belongsTo(db.user, {
    foreignKey: 'uid'
})

db.board.hasMany(db.list, {
    foreignKey: 'bid'
})

db.list.hasMany(db.card, {
    foreignKey: 'lid'
})

db.board.hasMany(db.activity, {
    foreignKey: 'bid'
})

db.activity.belongsTo(db.user, {
    foreignKey: 'uid'
})

db.card.hasMany(db.activity, {
    foreignKey: 'cid'
})

db.card.hasMany(db.comment, {
    foreignKey: 'cid'
})

db.comment.belongsTo(db.user, {
    foreignKey: 'uid'
})

module.exports = { db }