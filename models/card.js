module.exports = (sequelize, DataTypes) => {
    return sequelize.define('card', {
        cid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        lid: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        title: {
            type: Datatypes.STRING(30),
            allowNull: false
        },
        description: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        position: {
            type: Datatypes.INT,
            allowNull: false,
            defaultValue: 65535
        }
    })
}