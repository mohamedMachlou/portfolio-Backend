const express = require('express');
const router = express.Router();
const db = require('../models'); 
const multer = require('multer')
const fs = require('fs');
const path = require('path');

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
            req.body.description,
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
            // Supprimer la photo si elle a été uploadée
            if (req.file) {
                const photoPath = path.join(__dirname, '../adminphoto', req.file.filename);
                fs.unlink(photoPath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error('Erreur lors de la suppression de la photo :', unlinkErr);
                    } else {
                        console.log('Photo supprimée avec succès');
                    }
                });
            }
            res.status(400).json({ error: err });
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
router.get('/machlouadmin/:id', (req, res) => {
    db.Admin.findOne({ where: { id: req.params.id } })
    .then((response) => res.status(200).send(response))
    .catch((err) => res.status(400).send(err));
});


///////////////////////////////////////////////////////////////
/////////// Update Admin By ID
///////////////////////////////////////////////////////////////

router.patch('/machlouadmin/:id', upload.single('photo'), async (req, res) => {
  try {
    const id = req.params.id;
    console.log('req.body', req.body);

    // 1. Récupérer le Admin actuel
    const admin = await db.Admin.findOne({ where: { id } });

    // 2. Si l Admin n'existe pas → supprimer la photo nouvellement uploadée si présente
    if (!admin) {
      if (req.file) {
        const uploadedPath = path.join(__dirname, '../adminphoto', req.file.filename);
        if (fs.existsSync(uploadedPath)) {
          fs.unlinkSync(uploadedPath);
        }
      }
      return res.status(404).json({ error: 'Admin non trouvé' });
    }

    const updatedFields = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      description: req.body.description,
      jobTitle: req.body.jobTitle,
      experience: req.body.experience,
      specialty: req.body.specialty,
      addresse: req.body.addresse,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      freelance: req.body.freelance,
      linkedin: req.body.linkedin,
      github: req.body.github,
      facebook: req.body.facebook,
      instagram: req.body.instagram,
      twitter: req.body.twitter,
      downloadcv: req.body.downloadcv
    };

    // 3. Supprimer l'ancienne photo si une nouvelle est uploadée
    if (req.file) {
      if (admin.photo) {
        const oldIconPath = path.join(__dirname, '../adminphoto', admin.photo);
        if (fs.existsSync(oldIconPath)) {
          fs.unlinkSync(oldIconPath); // Supprime l'ancien fichier
        }
      }

      // 4. Ajouter la nouvelle photo
      updatedFields.photo = req.file.filename;
    }

    // 5. Mise à jour
    const [updated] = await db.Admin.update(updatedFields, {
      where: { id }
    });

    if (updated) {
      res.status(200).json({ message: 'Admin mis à jour avec succès' });
    } else {
      res.status(400).json({ error: 'Aucune mise à jour effectuée' });
    }

  } catch (err) {
    console.error(err);

    // 6. Supprimer l'image si erreur inconnue ET upload existant
    if (req.file) {
      const errorPath = path.join(__dirname, '../adminphoto', req.file.filename);
      if (fs.existsSync(errorPath)) {
        fs.unlinkSync(errorPath);
      }
    }

    res.status(400).send({ error: err.message || err });
  }
});



///////////////////////////////////////////////////////////////
/////////// Delete Admin By ID
///////////////////////////////////////////////////////////////

router.delete('/machlouadmin/:id', async (req, res) => {
  try {
    // 1. Récupérer l'admin pour obtenir le nom de la photo
    const admin = await db.Admin.findOne({ where: { id: req.params.id } });

    if (!admin) {
      return res.status(404).json({ error: 'Admin non trouvé' });
    }

    // 2. Supprimer le fichier photo s’il existe
    if (admin.photo) {
      const photoPath = path.join(__dirname, '../adminphoto', admin.photo);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath); // supprime le fichier
      }
    }

    // 3. Supprimer l'admin de la base de données
    await db.Admin.destroy({ where: { id: req.params.id } });

    res.status(200).json({ message: 'Admin et photo supprimés avec succès' });

  } catch (err) {
    res.status(500).json({ error: err.message || 'Erreur lors de la suppression' });
  }
});



module.exports = router;