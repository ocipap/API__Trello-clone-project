module.exports = (sequelize, DataTypes) => {
    return sequelize.define('member', {
        bid: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        uid: {
            type: DataTypes.UUID,
            allowNull: false,
        }
    })
}