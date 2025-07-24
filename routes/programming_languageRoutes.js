const express = require('express');
const router = express.Router();
const db = require('../models'); 
const programming_languageController = require('../controllers/programming_languageController');





///////////////////////////////////////////////////////////////
///////    Register New Programming_language
///////////////////////////////////////////////////////////////
router.post('/machlouproglanguagereg', (req, res) => {
    console.log('req.body:', req.body);
    
    programming_languageController
    .register(
            req.body.title,
            req.body.skill,
            req.body.skill_prc
        )
        .then((response) => {
            res.status(200).json(response); 
        })
        .catch((err) => {
            res.status(400).json({ error:  err }); 
        });
    
}); 


///////////////////////////////////////////////////////////////
/////////// Get All Programming_languages
///////////////////////////////////////////////////////////////
router.get('/machlouprogramming_language', (req, res) => {
    db.Programming_language.findAll({})
    .then((response) => res.status(200).send(response))
    .catch((err) => res.status(400).send(err));
});


///////////////////////////////////////////////////////////////
/////////// Get Programming_language By ID
///////////////////////////////////////////////////////////////
router.get('/machlouprogramming_language/:id', (req, res, next) => {
    db.Programming_language.findOne({ where: { id: req.params.id } })
    .then((response) => res.status(200).send(response))
    .catch((err) => res.status(400).send(err));
});


///////////////////////////////////////////////////////////////
/////////// Update Programming_language By ID
///////////////////////////////////////////////////////////////


router.patch('/machlouprogramming_language/:id', async (req, res) => {
  try {

    const updatedFields = {
      title: req.body.title,
      skill: req.body.skill,     
      skill_prc: req.body.skill_prc,     
    };

    const result = await db.Programming_language.update(updatedFields, {
      where: { id: req.params.id }
    });

    res.status(200).send(result);
  } catch (err) {
    res.status(400).send({ error: err.message || err });
  }
});

     

///////////////////////////////////////////////////////////////
/////////// Delete Programming_language By ID
///////////////////////////////////////////////////////////////
router.delete('/machlouprogramming_language/:id', (req, res, next) => {
    db.Programming_language.destroy({ where: { id: req.params.id } })
    .then((response) => res.status(200).send(response))
    .catch((err) => res.status(400).send(err));
});


module.exports = router;