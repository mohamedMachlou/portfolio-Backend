const { v4: uuidv4 } = require('uuid');

module.exports =  (sequelize, DataTypes) =>  {
    const Programming_language = sequelize.define('Programming_language',{
        id: {
          type: DataTypes.STRING, 
            defaultValue: uuidv4,
             primaryKey: true 
           },
        title: {type: DataTypes.STRING, allowNull: false},
        skill: {type: DataTypes.STRING, allowNull: false},
        skill_prc: {type: DataTypes.STRING, allowNull: false},
    
    })


  return Programming_language
}