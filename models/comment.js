module.exports = (sequelize, DataTypes) => {
    const comment = sequelize.define('comment', {
        comment_id: {
            field: "comment_id",
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        uid: {
            field: "uid",
            type: DataTypes.UUID,
            allowNull: false,
        },
        cid: {
            field: "cid",
            type: DataTypes.UUID,
            allowNull: false
        },
        comment: {
            field: "comment",
            type: DataTypes.STRING(50),
            allowNull: false
        }
    }, {
        underscored: true,
        tableName: 'comment',
        freezeTableName: true
    })
    comment.association = (db) => {
        db.comment.belongsTo(db.user, {
            foreignKey: 'uid'
        })
    }

    return comment
}