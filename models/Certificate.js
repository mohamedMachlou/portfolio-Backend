const {v4: uuidv4} = require('uuid')

module.exports = (sequelize, DataTypes) => {
    const Certificate = sequelize.define('Certificate', {
        id: {
            type: DataTypes.STRING,
            defaultValue: uuidv4,
            primaryKey: true
        },
        photo: {
            type: DataTypes.STRING,
            
        },
        title: {
            type:DataTypes.STRING,
            allowNull: false
        },
        link: {
            type: DataTypes.STRING, 
            allowNull: false
        }

    })

    return Certificate
}