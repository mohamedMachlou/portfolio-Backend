const Joi = require('joi');
const db = require('../models'); 

const schemaValidation = Joi.object({
    title: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$'))
        .min(3)
        .max(255)
        .required(),
        
    description: Joi.string()
            .pattern(/^[\wÀ-ÿ0-9\s.,'"\-!?()]+$/)
            .trim()
            .min(3)
            .max(255)
            .required(),

 
});

// Service Register Function
exports.register = async (title, description, icon) => {
    // Validation
    const { error } = schemaValidation.validate({ title, description });

    if (error) {
        throw new Error(error.details.map((detail) => detail.message).join(", "));
    }

    // Création
    const newService = await db.Service.create({ title, description, icon });

    return newService;
};


