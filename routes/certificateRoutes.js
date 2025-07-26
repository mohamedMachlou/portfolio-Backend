const express = require('express');
const router = express.Router();
const db = require('../models'); 
const multer = require('multer')
const fs = require('fs')
const path = require('path')
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
            // Supprimer la photo si elle a été uploadée
                        if (req.file) {
                            const photoPath = path.join(__dirname, '../certificatephoto', req.file.filename);
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
    const id = req.params.id;


    // 1. Récupérer le Certificate actuel
    const certificate = await db.Certificate.findOne({ where: { id } });

    // 2. Si le Certificate n'existe pas → supprimer la photo nouvellement uploadée si présente
    if (!certificate) {
      if (req.file) {
        const uploadedPath = path.join(__dirname, '../certificatephoto', req.file.filename);
        if (fs.existsSync(uploadedPath)) {
          fs.unlinkSync(uploadedPath);
        }
      }
      return res.status(404).json({ error: 'Crtificate non trouvé' });
    }

    const updatedFields = {
      title: req.body.title,
      link: req.body.link,   
    };

    // 3. Supprimer l'ancienne photo si une nouvelle est uploadée
    if (req.file) {
      if (certificate.photo) {
        const oldIconPath = path.join(__dirname, '../certificatephoto', certificate.photo);
        if (fs.existsSync(oldIconPath)) {
          fs.unlinkSync(oldIconPath); // Supprime l'ancien fichier
        }
      }

      // 4. Ajouter la nouvelle photo
      updatedFields.photo = req.file.filename;
    }

    // 5. Mise à jour
    const [updated] = await db.Certificate.update(updatedFields, {
      where: { id }
    });

    if (updated) {
      res.status(200).json({ message: 'Certificate mis à jour avec succès' });
    } else {
      res.status(400).json({ error: 'Aucune mise à jour effectuée' });
    }

  } catch (err) {
    console.error(err);

    // 6. Supprimer l'image si erreur inconnue ET upload existant
    if (req.file) {
      const errorPath = path.join(__dirname, '../certificatephoto', req.file.filename);
      if (fs.existsSync(errorPath)) {
        fs.unlinkSync(errorPath);
      }
    }

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