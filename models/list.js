module.exports = (sequelize, DataTypes) => {
    return sequelize.define('list', {
        lid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        bid: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        title: {
            type: Datatypes.STRING(30),
            allowNull: false
        },
        position: {
            type: DataTypes.INT,
            allowNull: false,
            defaultValue: 65535
        }
    })
}