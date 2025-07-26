const express = require('express');
const router = express.Router();
const db = require('../models'); 
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const ProjectController = require('../controllers/projectController');



// Config multer pour upload fichier dans dossier /Projectphoto
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './projectphoto/'); // dossier d'Projectphoto
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
            // Supprimer la photo si elle a été uploadée
                        if (req.file) {
                            const photoPath = path.join(__dirname, '../projectphoto', req.file.filename);
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
    const id = req.params.id;


    // 1. Récupérer le Project actuel
    const project = await db.Project.findOne({ where: { id } });

    // 2. Si le Project n'existe pas → supprimer la photo nouvellement uploadée si présente
    if (!project) {
      if (req.file) {
        const uploadedPath = path.join(__dirname, '../projectphoto', req.file.filename);
        if (fs.existsSync(uploadedPath)) {
          fs.unlinkSync(uploadedPath);
        }
      }
      return res.status(404).json({ error: 'Project non trouvé' });
    }

    const updatedFields = {
      title: req.body.title,
      link: req.body.link,   
    };

    // 3. Supprimer l'ancienne photo si une nouvelle est uploadée
    if (req.file) {
      if (project.photo) {
        const oldIconPath = path.join(__dirname, '../projectphoto', project.photo);
        if (fs.existsSync(oldIconPath)) {
          fs.unlinkSync(oldIconPath); // Supprime l'ancien fichier
        }
      }

      // 4. Ajouter la nouvelle photo
      updatedFields.photo = req.file.filename;
    }

    // 5. Mise à jour
    const [updated] = await db.Project.update(updatedFields, {
      where: { id }
    });

    if (updated) {
      res.status(200).json({ message: 'Project mis à jour avec succès' });
    } else {
      res.status(400).json({ error: 'Aucune mise à jour effectuée' });
    }

  } catch (err) {
    console.error(err);

    // 6. Supprimer l'image si erreur inconnue ET upload existant
    if (req.file) {
      const errorPath = path.join(__dirname, '../projectphoto', req.file.filename);
      if (fs.existsSync(errorPath)) {
        fs.unlinkSync(errorPath);
      }
    }

    res.status(400).send({ error: err.message || err });
  }
});





     

///////////////////////////////////////////////////////////////
/////////// Delete Project By ID
///////////////////////////////////////////////////////////////
router.delete('/machlouproject/:id', async (req, res) => {
  try {
    // 1. Récupérer le Project pour obtenir le nom de la photo
    const project = await db.Project.findOne({ where: { id: req.params.id } });

    if (!project) {
      return res.status(404).json({ error: 'Project non trouvé' });
    }

    // 2. Supprimer le fichier photo s’il existe
    if (project.photo) {
      const photoPath = path.join(__dirname, '../projectphoto', project.photo);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath); // supprime le fichier
      }
    }

    // 3. Supprimer le Project de la base de données
    await db.Project.destroy({ where: { id: req.params.id } });

    res.status(200).json({ message: 'Project et photo supprimés avec succès' });

  } catch (err) {
    res.status(500).json({ error: err.message || 'Erreur lors de la suppression' });
  }
});


module.exports = router;