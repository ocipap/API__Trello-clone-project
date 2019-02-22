module.exports = (sequelize, DataTypes) => {
    const member = sequelize.define('member', {
        mid: {
            field: "mid",
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
        uid: {
            field: "uid",
            type: DataTypes.UUID,
            allowNull: false,
        },
        permission: {
            field: "permission",
            type: DataTypes.STRING(10),
            allowNull: false
        }
    }, {
        underscored: true,
        tableName: 'member',
        freezeTableName: true
    })

    member.association = (db) => {
        db.member.belongsTo(db.user, {
            foreignKey: 'uid'
        })

        db.member.belongsTo(db.board, {
            foreignKey: 'bid'
        })
    }

    return member;
}