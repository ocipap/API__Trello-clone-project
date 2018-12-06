module.exports = (sequelize, DataTypes) => {
    const board = sequelize.define('board', {
        bid: {
            field: "bid",
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        user_id: {
            field: "user_id",
            type: DataTypes.UUID,
            allowNull: false,
        },
        title: {
            field: "title",
            type: DataTypes.STRING(30),
            allowNull: false
        },
        bgcolor: {
            field: "bgcolor",
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: "rgb(255,255,255)"
        },
        bgimage: {
            field: "bgimage",
            type: DataTypes.STRING(20),
            allowNull: true
        }
    }, {
        underscored: true,
        tableName: 'board',
        freezeTableName: true
    })
    board.association = (db) => {
        db.board.belongsTo(db.user, {
            foreignKey: 'user_id',
            targetKey: 'uid'
        })

        db.board.hasMany(db.member, {
            foreignKey: 'bid'
        })

        db.board.hasMany(db.list, {
            foreignKey: 'bid'
        })

        db.board.hasMany(db.activity, {
            foreignKey: 'bid'
        })
    }

    return board
}