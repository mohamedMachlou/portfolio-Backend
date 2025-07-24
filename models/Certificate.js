const {v4: uuidv4} = require('uuid')

module.exports = (sequelize, DataTypes) => {
    const Certficate = sequelize.define('Certficate', {
        id: {
            type: DataTypes.STRING,
            defaultValue: uuidv4,
            primaryKey: true
        },
        photo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        title: {
            type:DataTypes.STRING,
            allowNull: true
        },
        link: {
            type: DataTypes.STRING,
            allowNull: true
        }

    })

    return Certficate
}