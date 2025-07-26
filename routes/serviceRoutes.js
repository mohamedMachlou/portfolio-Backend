const express = require('express');
const router = express.Router();
const db = require('../models'); 
const multer = require('multer')
const fs = require('fs');
const path = require('path');

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
             // Supprimer la photo si elle a été uploadée
                                    if (req.file) {
                                        const photoPath = path.join(__dirname, '../serviceicon', req.file.filename);
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
    const id = req.params.id;

    // 1. Récupérer le service actuel
    const service = await db.Service.findOne({ where: { id } });

    // 2. Si le service n'existe pas → supprimer l'icône nouvellement uploadée si présente
    if (!service) {
      if (req.file) {
        const uploadedPath = path.join(__dirname, '../serviceicon', req.file.filename);
        if (fs.existsSync(uploadedPath)) {
          fs.unlinkSync(uploadedPath);
        }
      }
      return res.status(404).json({ error: 'Service non trouvé' });
    }

    const updatedFields = {
      title: req.body.title,
      description: req.body.description,
    };

    // 3. Supprimer l'ancienne icône si une nouvelle est uploadée
    if (req.file) {
      if (service.icon) {
        const oldIconPath = path.join(__dirname, '../serviceicon', service.icon);
        if (fs.existsSync(oldIconPath)) {
          fs.unlinkSync(oldIconPath); // Supprime l'ancien fichier
        }
      }

      // 4. Ajouter la nouvelle icône
      updatedFields.icon = req.file.filename;
    }

    // 5. Mise à jour
    const [updated] = await db.Service.update(updatedFields, {
      where: { id }
    });

    if (updated) {
      res.status(200).json({ message: 'Service mis à jour avec succès' });
    } else {
      res.status(400).json({ error: 'Aucune mise à jour effectuée' });
    }

  } catch (err) {
    console.error(err);

    // 6. Supprimer l'image si erreur inconnue ET upload existant
    if (req.file) {
      const errorPath = path.join(__dirname, '../serviceicon', req.file.filename);
      if (fs.existsSync(errorPath)) {
        fs.unlinkSync(errorPath);
      }
    }

    res.status(400).send({ error: err.message || err });
  }
});



     

///////////////////////////////////////////////////////////////
/////////// Delete Service By ID
///////////////////////////////////////////////////////////////


router.delete('/machlouservice/:id', async (req, res) => {
  try {
    // 1. Récupérer le service pour obtenir le nom de l'icône
    const service = await db.Service.findOne({ where: { id: req.params.id } });

    if (!service) {
      return res.status(404).json({ error: 'Service non trouvé' });
    }

    // 2. Supprimer le fichier icon s’il existe
    if (service.icon) {
      const iconPath = path.join(__dirname, '../serviceicon', service.icon);
      if (fs.existsSync(iconPath)) {
        fs.unlinkSync(iconPath); // supprime le fichier
      }
    }

    // 3. Supprimer le service de la base de données
    await db.Service.destroy({ where: { id: req.params.id } });

    res.status(200).json({ message: 'Service et icône supprimés avec succès' });

  } catch (err) {
    res.status(500).json({ error: err.message || 'Erreur lors de la suppression' });
  }
});



module.exports = router;