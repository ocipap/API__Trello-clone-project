module.exports = (sequelize, DataTypes) => {
    return sequelize.define('comment', {
        comment_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        uid: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        cid: {
            type: DataTypes.UUID,
            allowNull: false
        },
        comment: {
            type: DataTypes.STRING(50),
            allowNull: false
        }
    })
}