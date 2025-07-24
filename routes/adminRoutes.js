const express = require('express');
const router = express.Router();
const db = require('../models'); 
const multer = require('multer')
const bcrypt = require('bcrypt'); 
const adminController = require('../controllers/adminController');



// Config multer pour upload fichier dans dossier /adminphoto
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './adminphoto/'); // dossier d'adminphoto
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });



///////////////////////////////////////////////////////////////
///////    Register New Admin
///////////////////////////////////////////////////////////////
router.post('/machlouadminreg', upload.single('photo'), (req, res) => {
    adminController
    .register(
            req.body.firstName,
            req.body.lastName,
            req.body.jobTitle,
            req.body.experience,
            req.body.specialty,
            req.body.addresse,
            req.body.email,
            req.body.password,
            req.body.phone,
            req.body.freelance,
            req.body.linkedin,
            req.body.github,
            req.body.facebook,
            req.body.instagram,
            req.body.twitter,
            req.file ? req.file.filename : null, 
            req.body.downloadcv
        )
        .then((response) => {
            res.status(200).json(response); 
        })
        .catch((err) => {
            res.status(400).json({ error:  err }); 
        });
}); 


///////////////////////////////////////////////////////////////
/////////// Login Admin
///////////////////////////////////////////////////////////////
router.post('/machlouadminlog', (req, res) =>{
    adminController.login(req.body.email, req.body.password)
    .then((token)=> {res.status(200).json({token: token})})
    .catch((err)=>{res.status(400).json(err)})
});


///////////////////////////////////////////////////////////////
/////////// Get All Admins
///////////////////////////////////////////////////////////////
router.get('/machlouadmin', (req, res) => {
    db.Admin.findAll({})
    .then((response) => res.status(200).send(response))
    .catch((err) => res.status(400).send(err));
});


///////////////////////////////////////////////////////////////
/////////// Get Admin By ID
///////////////////////////////////////////////////////////////
router.get('/machlouadmin/:id', (req, res, next) => {
    db.Admin.findOne({ where: { id: req.params.id } })
    .then((response) => res.status(200).send(response))
    .catch((err) => res.status(400).send(err));
});


///////////////////////////////////////////////////////////////
/////////// Update Admin By ID
///////////////////////////////////////////////////////////////


router.patch('/machlouadmin/:id', upload.single('photo'), async (req, res) => {
  try {
    const updatedFields = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      jobTitle: req.body.jobTitle,
      experience: req.body.experience,
      specialty: req.body.specialty,
      addresse: req.body.addresse,
      email: req.body.email,
      phone: req.body.phone,
      freelance: req.body.freelance,
      linkedin: req.body.linkedin,
      github: req.body.github,
      facebook: req.body.facebook,
      instagram: req.body.instagram,
      twitter: req.body.twitter,
      downloadcv: req.body.downloadcv
    };

    // Hash du mot de passe s’il est fourni
    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      updatedFields.password = hashedPassword;
    }

    // Photo si elle est présente
    if (req.file) {
      updatedFields.photo = req.file.filename;
    }

    const result = await db.Admin.update(updatedFields, {
      where: { id: req.params.id }
    });

    res.status(200).send(result);
  } catch (err) {
    res.status(400).send({ error: err.message || err });
  }
});

     

///////////////////////////////////////////////////////////////
/////////// Delete Admin By ID
///////////////////////////////////////////////////////////////
router.delete('/machlouadmin/:id', (req, res, next) => {
    db.Admin.destroy({ where: { id: req.params.id } })
    .then((response) => res.status(200).send(response))
    .catch((err) => res.status(400).send(err));
});


module.exports = router;