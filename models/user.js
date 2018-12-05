module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user', {
        uid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        password: {
            type: Datatypes.STRING(32),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: "rgb(255,255,255)"
        },
        photo: {
            type: DataTypes.STRING(20),
            allowNull: false
        }
    })
}