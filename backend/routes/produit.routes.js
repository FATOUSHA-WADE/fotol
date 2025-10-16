"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routesProduit = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const produit_controller_1 = require("../controllers/produit.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const security_middleware_1 = require("../middlewares/security.middleware");
const message_1 = require("../enums/message");
const auth_validator_1 = require("../validators/auth.validator");
const stockage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage: stockage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE || '2097152'), // 2MB
        files: 5
    },
    fileFilter: (req, file, cb) => {
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
exports.routesProduit = (0, express_1.Router)();
exports.routesProduit.get('/statistiques-globales', produit_controller_1.ControleurProduit.obtenirStatistiques);
exports.routesProduit.get('/publics', auth_middleware_1.authentificationOptionnelle, produit_controller_1.ControleurProduit.obtenirProduitsPublics);
exports.routesProduit.get('/vip', auth_middleware_1.authentificationOptionnelle, produit_controller_1.ControleurProduit.obtenirProduitsVip);
exports.routesProduit.get('/statistiques', auth_middleware_1.verifierToken, produit_controller_1.ControleurProduit.obtenirStatistiques);
exports.routesProduit.get('/mes-produits', auth_middleware_1.verifierToken, produit_controller_1.ControleurProduit.obtenirMesProduits);
exports.routesProduit.post('/', security_middleware_1.loggerSecurite, auth_middleware_1.verifierToken, upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'photosSupplementaires', maxCount: 4 }
]), security_middleware_1.validerSecuritePhotos, auth_validator_1.validationProduit, produit_controller_1.ControleurProduit.creer);
exports.routesProduit.get('/', auth_middleware_1.verifierToken, (0, auth_middleware_1.verifierRole)(message_1.RoleUtilisateur.MODERATEUR, message_1.RoleUtilisateur.ADMINISTRATEUR), produit_controller_1.ControleurProduit.obtenirTous);
exports.routesProduit.get('/:id', auth_middleware_1.authentificationOptionnelle, produit_controller_1.ControleurProduit.obtenirParId);
exports.routesProduit.put('/:id', auth_middleware_1.verifierToken, upload.single('image'), auth_validator_1.validationMiseAJourProduit, produit_controller_1.ControleurProduit.mettreAJour);
exports.routesProduit.delete('/:id', auth_middleware_1.verifierToken, produit_controller_1.ControleurProduit.supprimer);
exports.routesProduit.put('/:id/valider', auth_middleware_1.verifierToken, (0, auth_middleware_1.verifierRole)(message_1.RoleUtilisateur.MODERATEUR, message_1.RoleUtilisateur.ADMINISTRATEUR), produit_controller_1.ControleurProduit.valider);
exports.routesProduit.put('/:id/rejeter', auth_middleware_1.verifierToken, (0, auth_middleware_1.verifierRole)(message_1.RoleUtilisateur.MODERATEUR, message_1.RoleUtilisateur.ADMINISTRATEUR), produit_controller_1.ControleurProduit.rejeter);
