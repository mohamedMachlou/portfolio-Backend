const Joi= require('joi');
const db = require('../models'); 
const bcrypt= require('bcrypt');
const jwt=  require('jsonwebtoken');


const schemaValidation= Joi.object({

    firstName:  Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$'))
    .min(3)
    .max(30)
    .required(),

    lastName:  Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$'))
    .min(3)
    .max(20)
    .required(),
    
    jobTitle:  Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$'))
    .min(3)
    .max(20)
    .required(),

    experience:  Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$'))
    .min(3)
    .max(20)
    .required(),

    specialty:  Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$'))
    .min(3)
    .max(30)
    .required(),

    addresse:  Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$'))
    .min(3)
    .max(20)
    .required(),
    
    phone:  Joi.string()
    .pattern(/^\+?[0-9\s\-()]+$/)
    .min(3)
    .max(20)
    .required(),

    freelance:  Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$'))
    .min(3)
    .max(20)
    .required(),
    

    linkedin:  Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$'))
    .min(3)
    .max(255),
    

    github:  Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$'))
    .min(3)
    .max(255),
    

    facebook:  Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$'))
    .min(3)
    .max(255),
    

    instagram:  Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$'))
    .min(3)
    .max(255),
    

    twitter:  Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$'))
    .min(3)
    .max(255),
    
    downloadcv:  Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$'))
    .min(3)
    .max(255),
    

    email: Joi.string().email(),

    password: Joi.string()
    .min(6)
    .required(),

})


// Admin Register Function
exports.register = (firstName, lastName, jobTitle, experience, specialty, addresse, email, password, phone,freelance, linkedin, github, facebook, instagram, twitter, photo, downloadcv) => {
    return new Promise((resolve, reject) => {
        // Validate Data
        const validation = schemaValidation.validate({
           firstName, 
           lastName, 
           jobTitle, 
           experience, 
           specialty, 
           addresse, 
           email, 
           password, 
           phone,
           freelance, 
           linkedin, 
           github, 
           facebook, 
           instagram, 
           twitter, 
           downloadcv
        });

        if (validation.error) {
            return reject(validation.error.details.map((detail) => detail.message).join(", "));
        }

        

        db.Admin.count({ where: { email } })
            .then((doc) => {

                    if (doc !== 0 ) {
                    return reject("You can not register an admin today !!");
                }
                
                
                // Hashed Password
                return bcrypt
                    .hash(password, 10)
                    .then((hashedPassword) => {

                            return db.Admin.create({
                                    firstName, 
                                    lastName, 
                                    jobTitle, 
                                    experience, 
                                    specialty, 
                                    addresse, 
                                    email, 
                                    password: hashedPassword,
                                    phone,
                                    freelance, 
                                    linkedin, 
                                    github, 
                                    facebook, 
                                    instagram, 
                                    twitter, 
                                    photo, 
                                    downloadcv
                            });
                        
                    })
                    .then((response) => {

                        resolve(response);
                    });
            })
            .catch((err) => {

                reject(err);
            });
    });
};



//Login  Function
const PrivateKey = "This is private key : HGDR534EDY888I@@@@IOUYIO"
exports.login= (email, password)=> {
    return new Promise((resolve, reject) => {

        db.Admin.findOne({where: {email:email}}).then(admin => {
            if(!admin){
                reject({msg: "invalid email "})
            }else{
                bcrypt.compare(password, admin.password)
                .then(samePassword => {
                    if(samePassword){
                       let token=jwt.sign({id: admin.id, username: admin.firstName, role: "adminrole"},
                        PrivateKey,{ expiresIn:"2h"}) 
                       
                        resolve({token: token})
                    }else{
                        reject({msg: "invalid  password"})
                    }
                })
            }
        })
    })
}