const { v4: uuidv4 } = require('uuid');

module.exports =  (sequelize, DataTypes) =>  {
    const Frameworks_tool = sequelize.define('Frameworks_tool',{
        id: {
          type: DataTypes.STRING, 
            defaultValue: uuidv4,
             primaryKey: true 
           },
        title: {type: DataTypes.STRING, allowNull: false},
        skill: {type: DataTypes.STRING, allowNull: false},
        skill_prc: {type: DataTypes.INTEGER, allowNull: false},
        skill_prc_width: {type: DataTypes.INTEGER, allowNull: false},
    
    })


  return Frameworks_tool
}