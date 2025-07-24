const { v4: uuidv4 } = require('uuid');
module.exports =  (sequelize, DataTypes) =>  {
    const Admin = sequelize.define('Admin',{
        id: {
          type: DataTypes.STRING, 
            defaultValue: uuidv4,
             primaryKey: true 
           },
        firstName: {type: DataTypes.STRING, allowNull: false},
        lastName: {type: DataTypes.STRING, allowNull: false},
        jobTitle: {type: DataTypes.STRING, allowNull: false},
        experience: {type: DataTypes.STRING, allowNull: false},
        specialty: {type: DataTypes.STRING, allowNull: false},
        addresse: {type: DataTypes.STRING, allowNull: false},
        email: {type: DataTypes.STRING, allowNull: false},
        password: {type: DataTypes.STRING, allowNull: false},
        phone: {type: DataTypes.STRING, allowNull: false},
        freelance: {type: DataTypes.STRING, allowNull: false},
        linkedin: {type: DataTypes.STRING, allowNull: true},
        github: {type: DataTypes.STRING, allowNull: true},
        facebook: {type: DataTypes.STRING, allowNull: true},
        instagram: {type: DataTypes.STRING, allowNull: true},
        twitter: {type: DataTypes.STRING, allowNull: true}, 
        photo: { type: DataTypes.STRING, allowNull: true },
        downloadcv: { type: DataTypes.STRING, allowNull: true }
    })




  return Admin
}