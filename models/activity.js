module.exports = (sequelize, DataTypes) => {
    const activity = sequelize.define('activity', {
        activity_id: {
            field: "activity_id",
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        type: {
            field: "type",
            type: DataTypes.ENUM,
            values: ['move', 'add', 'delete', 'edit', 'comment'],
            allowNull: false,
        },
        bid: {
            field: "bid",
            type: DataTypes.UUID,
            allowNull: false,
        },
        uid: {
            field: "uid",
            type: DataTypes.UUID,
            allowNull: false
        },
        cid: {
            field: "cid",
            type: DataTypes.UUID,
            allowNull: true
        },
        message: {
            field: "message",
            type: DataTypes.STRING(300),
            allowNull: false,
        }
    }, {
        underscored: true,
        tableName: 'activity',
        freezeTableName: true
    })

    activity.association = (db) => {
        db.activity.belongsTo(db.user, {
            foreignKey: 'uid'
        })
    }

    return activity
}