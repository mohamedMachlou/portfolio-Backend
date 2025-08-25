const { toDefaultValue } = require('sequelize/lib/utils')
const {v4 : uuidv4} = require('uuid')

module.exports = (sequelize, DataTypes) => {
    const Project = sequelize.define('Project', {
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
            type: DataTypes.STRING,
            allowNull: false 
        }, 
        link: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })

    return Project
}
