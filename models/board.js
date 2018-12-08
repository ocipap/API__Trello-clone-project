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
        bg_type: {
            field: "bg_type",
            type: DataTypes.ENUM,
            values: ['image', 'color'],
            defaultValue: 'color',
            allowNull: false
        },
        background: {
            field: "background",
            type: DataTypes.STRING(100),
            defaultValue: 'rgb(0, 121, 191)',
            allowNull: false
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