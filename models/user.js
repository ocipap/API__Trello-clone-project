module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user', {
        uid: {
            field: "uid",
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        username: {
            field: "username",
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        password: {
            field: "password",
            type: DataTypes.STRING(100),
            allowNull: false
        },
        email: {
            field: "email",
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        photo: {
            field: "photo",
            type: DataTypes.STRING(20),
            allowNull: false
        },
        reset_code: {
            field: "reset_code",
            type: DataTypes.UUID,
            allowNull: true
        },
        reset_code_expiredate: {
            field: "reset_code_expiredate",
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        underscored: true,
        tableName: 'user',
        freezeTableName: true
    })
}