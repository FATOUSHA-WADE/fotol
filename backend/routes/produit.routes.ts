import { Router } from 'express';
import multer from 'multer';
import { ControleurProduit } from '../controllers/produit.controller';
import { verifierToken, verifierRole, authentificationOptionnelle, verifierProprieteProduit } from '../middlewares/auth.middleware';
import { validerSecuritePhotos, loggerSecurite } from '../middlewares/security.middleware';
import { RoleUtilisateur } from '../enums/message';
import { validationProduit, validationMiseAJourProduit } from '../validators/auth.validator';

const stockage = multer.memoryStorage();
const upload = multer({
  storage: stockage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '2097152'), // 2MB
    files: 5
  },
  fileFilter: (req: any, file: any, cb: any) => {
    const typesAutorises = ['image/jpeg', 'image/png'];
    if (!typesAutorises.includes(file.mimetype)) {
      return cb(new Error('Format non autorisé. Utilisez uniquement l\'appareil photo (JPEG/PNG).'));
    }
    if (file.size && file.size < 5000) {
      return cb(new Error('Image trop petite. Utilisez l\'appareil photo pour capturer.'));
    }
    const sourceType = req.body.sourceType;
    if (sourceType && sourceType !== 'camera_capture_only') {
      return cb(new Error('Source non autorisée. Photos capturées uniquement.'));
    }
    cb(null, true);
  }
});

export const routesProduit = Router();

routesProduit.get('/statistiques-globales', ControleurProduit.obtenirStatistiques);
routesProduit.get('/publics', authentificationOptionnelle, ControleurProduit.obtenirProduitsPublics);
routesProduit.get('/vip', authentificationOptionnelle, ControleurProduit.obtenirProduitsVip);
routesProduit.get('/statistiques', verifierToken, ControleurProduit.obtenirStatistiques);
routesProduit.get('/mes-produits', verifierToken, ControleurProduit.obtenirMesProduits);
routesProduit.post(
  '/',
  loggerSecurite,
  verifierToken,
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'photosSupplementaires', maxCount: 4 }
  ]),
  validerSecuritePhotos,
  validationProduit,
  ControleurProduit.creer
);
routesProduit.get(
  '/',
  verifierToken,
  verifierRole(RoleUtilisateur.MODERATEUR, RoleUtilisateur.ADMINISTRATEUR),
  ControleurProduit.obtenirTous
);
routesProduit.get('/:id', authentificationOptionnelle, ControleurProduit.obtenirParId);
routesProduit.put(
  '/:id',
  verifierToken,
  upload.single('image'),
  validationMiseAJourProduit,
  ControleurProduit.mettreAJour
);
routesProduit.delete('/:id', verifierToken, ControleurProduit.supprimer);
routesProduit.put(
  '/:id/valider',
  verifierToken,
  verifierRole(RoleUtilisateur.MODERATEUR, RoleUtilisateur.ADMINISTRATEUR),
  ControleurProduit.valider
);
routesProduit.put(
  '/:id/rejeter',
  verifierToken,
  verifierRole(RoleUtilisateur.MODERATEUR, RoleUtilisateur.ADMINISTRATEUR),
  ControleurProduit.rejeter
);