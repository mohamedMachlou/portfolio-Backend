const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const Service = sequelize.define('Service',{
        id: {
          type: DataTypes.STRING, 
            defaultValue: uuidv4,
             primaryKey: true 
           },
        icon :{
            type: DataTypes.STRING,
            allowNull: false
        },
        title :{
            type: DataTypes.STRING, 
            allowNull: false
        },
        description :{
            type: DataTypes.STRING,
            allowNull: false
        },
    })

    return Service
}