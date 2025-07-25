const express = require('express');
const router = express.Router();
const db = require('../models'); 
const multer = require('multer')
const serviceController = require('../controllers/serviceController');



// Config multer pour upload fichier dans dossier /serviceicon
const storage = multer.diskStorage({
  destination: function (req, file, cb) { 
    cb(null, './serviceicon/'); // dossier d'serviceicon
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); 
  }
});
const upload = multer({ storage }); 



///////////////////////////////////////////////////////////////
///////    Register New Service
///////////////////////////////////////////////////////////////
router.post('/machlouservicereg', upload.single('icon'), (req, res) => {
    serviceController
    .register(
            req.body.title,
            req.body.description,
            req.file ? req.file.filename : null, 
        )
        .then((response) => { 
            res.status(200).json(response); 
        })
        .catch((err) => {
            res.status(400).json({ error: err.message || "Erreur inconnue" });
        });
}); 


///////////////////////////////////////////////////////////////
/////////// Get All Services
///////////////////////////////////////////////////////////////
router.get('/machlouservice', (req, res) => {
    db.Service.findAll({})
    .then((response) => res.status(200).send(response))
    .catch((err) => res.status(400).send(err));
});


///////////////////////////////////////////////////////////////
/////////// Get Service By ID
///////////////////////////////////////////////////////////////
router.get('/machlouservice/:id', (req, res, next) => {
    db.Service.findOne({ where: { id: req.params.id } })
    .then((response) => res.status(200).send(response))
    .catch((err) => res.status(400).send(err));
});


///////////////////////////////////////////////////////////////
/////////// Update Service By ID
///////////////////////////////////////////////////////////////


router.patch('/machlouservice/:id', upload.single('icon'), async (req, res) => {
  try {

    const updatedFields = {
      title: req.body.title,
      description: req.body.description,     
    };

    // icon si elle est présente
    if (req.file) {
      updatedFields.icon = req.file.filename;
    }

    const result = await db.Service.update(updatedFields, {
      where: { id: req.params.id }
    });

    res.status(200).send(result);
  } catch (err) {
    res.status(400).send({ error: err.message || err });
  }
});

     

///////////////////////////////////////////////////////////////
/////////// Delete Service By ID
///////////////////////////////////////////////////////////////
router.delete('/machlouservice/:id', (req, res, next) => {
    db.Service.destroy({ where: { id: req.params.id } })
    .then((response) => res.status(200).send(response))
    .catch((err) => res.status(400).send(err));
});


module.exports = router;