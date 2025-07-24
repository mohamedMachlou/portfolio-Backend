const express = require('express');
const router = express.Router();
const db = require('../models'); 
const Frameworks_toolController = require('../controllers/frameworks_toolController');





///////////////////////////////////////////////////////////////
///////    Register New Frameworks_tool
///////////////////////////////////////////////////////////////
router.post('/machlouframeworkreg', (req, res) => {
    console.log('req.body:', req.body);
    
    Frameworks_toolController
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
/////////// Get All Frameworks_tools
///////////////////////////////////////////////////////////////
router.get('/machlouframeworks_tool', (req, res) => {
    db.Frameworks_tool.findAll({})
    .then((response) => res.status(200).send(response))
    .catch((err) => res.status(400).send(err));
});


///////////////////////////////////////////////////////////////
/////////// Get Frameworks_tool By ID
///////////////////////////////////////////////////////////////
router.get('/machlouframeworks_tool/:id', (req, res, next) => {
    db.Frameworks_tool.findOne({ where: { id: req.params.id } })
    .then((response) => res.status(200).send(response))
    .catch((err) => res.status(400).send(err));
});


///////////////////////////////////////////////////////////////
/////////// Update Frameworks_tool By ID
///////////////////////////////////////////////////////////////


router.patch('/machlouframeworks_tool/:id', async (req, res) => {
  try {

    const updatedFields = {
      title: req.body.title,
      skill: req.body.skill,     
      skill_prc: req.body.skill_prc,     
    };

    const result = await db.Frameworks_tool.update(updatedFields, {
      where: { id: req.params.id }
    });

    res.status(200).send(result);
  } catch (err) {
    res.status(400).send({ error: err.message || err });
  }
});

     

///////////////////////////////////////////////////////////////
/////////// Delete Frameworks_tool By ID
///////////////////////////////////////////////////////////////
router.delete('/machlouframeworks_tool/:id', (req, res, next) => {
    db.Frameworks_tool.destroy({ where: { id: req.params.id } })
    .then((response) => res.status(200).send(response))
    .catch((err) => res.status(400).send(err));
});


module.exports = router;