const Joi = require('joi');
const db = require('../models'); 

const schemaValidation = Joi.object({
    title: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$'))
        .min(3)
        .max(255)
        .required(),

    link: Joi.string()
        .uri() 
        .max(255)
        .required()
});

// Project Register Function
exports.register = async (title, link, photo) => {
    // Validation
    const { error } = schemaValidation.validate({ title, link });

    if (error) {
        throw new Error(error.details.map((detail) => detail.message).join(", "));
    }

    // Création
    const newProject = await db.Project.create({ title, link, photo });

    return newProject;
};


