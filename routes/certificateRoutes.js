const express = require('express');
const router = express.Router();
const db = require('../models'); 
const multer = require('multer')
const certificateController = require('../controllers/certificateController');



// Config multer pour upload fichier dans dossier /certificatephoto
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './certificatephoto/'); // dossier d'certificatephoto
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });



///////////////////////////////////////////////////////////////
///////    Register New Certificate
///////////////////////////////////////////////////////////////
router.post('/machloucertificatereg', upload.single('photo'), (req, res) => {
    certificateController
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
/////////// Get All Certificates
///////////////////////////////////////////////////////////////
router.get('/machloucertificate', (req, res) => {
    db.Certificate.findAll({})
    .then((response) => res.status(200).send(response))
    .catch((err) => res.status(400).send(err));
});


///////////////////////////////////////////////////////////////
/////////// Get Certificate By ID
///////////////////////////////////////////////////////////////
router.get('/machloucertificate/:id', (req, res, next) => {
    db.Certificate.findOne({ where: { id: req.params.id } })
    .then((response) => res.status(200).send(response))
    .catch((err) => res.status(400).send(err));
});


///////////////////////////////////////////////////////////////
/////////// Update Certificate By ID
///////////////////////////////////////////////////////////////


router.patch('/machloucertificate/:id', upload.single('photo'), async (req, res) => {
  try {

    const updatedFields = {
      title: req.body.title,
      link: req.body.link,     
    };

    // Photo si elle est présente
    if (req.file) {
      updatedFields.photo = req.file.filename;
    }

    const result = await db.Certificate.update(updatedFields, {
      where: { id: req.params.id }
    });

    res.status(200).send(result);
  } catch (err) {
    res.status(400).send({ error: err.message || err });
  }
});

     

///////////////////////////////////////////////////////////////
/////////// Delete Certificate By ID
///////////////////////////////////////////////////////////////
router.delete('/machloucertificate/:id', (req, res, next) => {
    db.Certificate.destroy({ where: { id: req.params.id } })
    .then((response) => res.status(200).send(response))
    .catch((err) => res.status(400).send(err));
});


module.exports = router;