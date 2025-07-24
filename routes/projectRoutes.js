const express = require('express');
const router = express.Router();
const db = require('../models'); 
const multer = require('multer')
const ProjectController = require('../controllers/projectController');



// Config multer pour upload fichier dans dossier /Projectphoto
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './Projectphoto/'); // dossier d'Projectphoto
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });



///////////////////////////////////////////////////////////////
///////    Register New Project
///////////////////////////////////////////////////////////////
router.post('/machlouprojectreg', upload.single('photo'), (req, res) => {
    ProjectController
    .register(
            req.body.title,
            req.body.link,
            req.file ? req.file.filename : null, 
        )
        .then((response) => {
            res.status(200).json(response); 
        })
        .catch((err) => {
            res.status(400).json({ error:  err }); 
        });
}); 


///////////////////////////////////////////////////////////////
/////////// Get All Projects
///////////////////////////////////////////////////////////////
router.get('/machlouproject', (req, res) => {
    db.Project.findAll({})
    .then((response) => res.status(200).send(response))
    .catch((err) => res.status(400).send(err));
});


///////////////////////////////////////////////////////////////
/////////// Get Project By ID
///////////////////////////////////////////////////////////////
router.get('/machlouproject/:id', (req, res, next) => {
    db.Project.findOne({ where: { id: req.params.id } })
    .then((response) => res.status(200).send(response))
    .catch((err) => res.status(400).send(err));
});


///////////////////////////////////////////////////////////////
/////////// Update Project By ID
///////////////////////////////////////////////////////////////


router.patch('/machlouproject/:id', upload.single('photo'), async (req, res) => {
  try {

    const updatedFields = {
      title: req.body.title,
      link: req.body.link,     
    };

    // Photo si elle est présente
    if (req.file) {
      updatedFields.photo = req.file.filename;
    }

    const result = await db.Project.update(updatedFields, {
      where: { id: req.params.id }
    });

    res.status(200).send(result);
  } catch (err) {
    res.status(400).send({ error: err.message || err });
  }
});

     

///////////////////////////////////////////////////////////////
/////////// Delete Project By ID
///////////////////////////////////////////////////////////////
router.delete('/machlouproject/:id', (req, res, next) => {
    db.Project.destroy({ where: { id: req.params.id } })
    .then((response) => res.status(200).send(response))
    .catch((err) => res.status(400).send(err));
});


module.exports = router;