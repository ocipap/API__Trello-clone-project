module.exports = (sequelize, DataTypes) => {
    const card = sequelize.define('card', {
        cid: {
            field: "cid",
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        lid: {
            field: "lid",
            type: DataTypes.UUID,
            allowNull: false,
        },
        title: {
            field: "title",
            type: DataTypes.STRING(30),
            allowNull: false
        },
        description: {
            field: "description",
            type: DataTypes.STRING(500),
            allowNull: true
        },
        position: {
            field: "position",
            type: DataTypes.DOUBLE,
            allowNull: false,
            defaultValue: 65535
        }
    }, {
        underscored: true,
        tableName: 'card',
        freezeTableName: true
    })

    card.association = (db) => {
        db.card.hasMany(db.activity, {
            foreignKey: 'cid'
        })

        db.card.hasMany(db.comment, {
            foreignKey: 'cid'
        })

        db.card.belongsTo(db.list, {
            foreignKey: 'lid',
        })
    }

    return card
}