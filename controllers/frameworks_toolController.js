const Joi = require('joi');
const db = require('../models'); 

const schemaValidation = Joi.object({
    title: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$'))
        .min(3)
        .max(255)
        .required(),
        
    skill: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$'))
        .min(3)
        .max(255)
        .required(),
            
    skill_prc: Joi.number()
        .min(10)
        .max(100)
        .required(),
});

// Frameworks_tool Register Function
   
exports.register = async (title, skill, skill_prc) => {
    console.log('title : ',title)
    console.log('skill : ',skill)
    console.log('skill prc  : ',skill_prc)
    // Validation
    const { error } = schemaValidation.validate({ title, skill, skill_prc });
    
    if (error) {
        throw new Error(error.details.map((detail) => detail.message).join(", "));
    }
    
    // Création
    const newFrameworks_tool = await db.Frameworks_tool.create({title, skill, skill_prc});
    console.log('newFrameworks_tool  : ',newFrameworks_tool)
    
        return newFrameworks_tool;
    };
    
  
