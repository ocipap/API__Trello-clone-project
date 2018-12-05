module.exports = (sequelize, DataTypes) => {
    return sequelize.define('board', {
        bid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        title: {
            type: Datatypes.STRING(30),
            allowNull: false
        },
        bgcolor: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: "rgb(255,255,255)"
        },
        bgimage: {
            type: DataTypes.STRING(20),
            allowNull: true
        }
    })
}