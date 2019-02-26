module.exports = (sequelize, DataTypes) => {
    const list = sequelize.define('list', {
        lid: {
            field: "lid",
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        bid: {
            field: "bid",
            type: DataTypes.UUID,
            allowNull: false,
        },
        title: {
            field: "title",
            type: DataTypes.STRING(30),
            allowNull: false
        },
        position: {
            field: "position",
            type: DataTypes.DOUBLE,
            allowNull: false,
            defaultValue: 65535
        }
    }, {
        underscored: true,
        tableName: 'list',
        freezeTableName: true
    })
    list.association = (db) => {
        db.list.hasMany(db.card, {
            foreignKey: 'lid'
        })
        
        db.list.belongsTo(db.board, {
            foreignKey: 'bid'
        })
    }

    return list
}