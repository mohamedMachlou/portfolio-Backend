const { v4: uuidv4 } = require('uuid');

module.exports =  (sequelize, DataTypes) =>  {
    const Devops_other = sequelize.define('Devops_other',{
        id: {
          type: DataTypes.STRING, 
            defaultValue: uuidv4,
             primaryKey: true 
           },
        title: {type: DataTypes.STRING, allowNull: false},
        skill: {type: DataTypes.STRING, allowNull: false},
        skill_prc: {type: DataTypes.INTEGER, allowNull: false},
    
    })


  return Devops_other
}