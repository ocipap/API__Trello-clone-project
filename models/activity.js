module.exports = (sequelize, DataTypes) => {
    return sequelize.define('activity', {
        type: {
            type: DataTypes.ENUM,
            values: ['move', 'add', 'delete', 'edit', 'comment'],
            allowNull: false,
        },
        bid: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        uid: {
            type: DataTypes.UUID,
            allowNull: false
        },
        cid: {
            type: DataTypes.UUID,
            allowNull: true
        },
        message: {
            type: DataTypes.STRING(50),
            allowNull: false,
        }
    })
}