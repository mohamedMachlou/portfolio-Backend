const express = require('express');
const router = express.Router();
const db = require('../models'); 
const devops_otherController = require('../controllers/devops_otherController');





///////////////////////////////////////////////////////////////
///////    Register New Devops_other
///////////////////////////////////////////////////////////////
router.post('/machloudevopsreg', (req, res) => {
    console.log('req.body:', req.body);

    devops_otherController
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
/////////// Get All Devops_others
///////////////////////////////////////////////////////////////
router.get('/machloudevops', (req, res) => {
    db.Devops_other.findAll({})
    .then((response) => res.status(200).send(response))
    .catch((err) => res.status(400).send(err));
});


///////////////////////////////////////////////////////////////
/////////// Get Devops_other By ID
///////////////////////////////////////////////////////////////
router.get('/machloudevops/:id', (req, res, next) => {
    db.Devops_other.findOne({ where: { id: req.params.id } })
    .then((response) => res.status(200).send(response))
    .catch((err) => res.status(400).send(err));
});


///////////////////////////////////////////////////////////////
/////////// Update Devops_other By ID
///////////////////////////////////////////////////////////////


router.patch('/machloudevops/:id', async (req, res) => {
  try {

    const updatedFields = {
      title: req.body.title,
      skill: req.body.skill,      
      skill_prc: req.body.skill_prc,     
    };

    const result = await db.Devops_other.update(updatedFields, {
      where: { id: req.params.id }
    });

    res.status(200).send(result);
  } catch (err) {
    res.status(400).send({ error: err.message || err });
  }
});

     

///////////////////////////////////////////////////////////////
/////////// Delete Devops_other By ID
///////////////////////////////////////////////////////////////
router.delete('/machloudevops/:id', (req, res, next) => {
    db.Devops_other.destroy({ where: { id: req.params.id } })
    .then((response) => res.status(200).send(response))
    .catch((err) => res.status(400).send(err));
});


module.exports = router;