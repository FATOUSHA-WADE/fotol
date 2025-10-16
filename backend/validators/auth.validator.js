"use strict";
// Validateurs pour l'authentification - FotoLouJay
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationNotification = exports.validationMiseAJourProduit = exports.validationProduit = exports.validationChangementMotDePasse = exports.validationConnexion = exports.validationInscription = void 0;
const { body } = require('express-validator');
const message_1 = require("../enums/message");
/**
 * Validateurs pour l'inscription
 */
exports.validationInscription = [
    body('nom')
        .notEmpty()
        .withMessage(message_1.MESSAGES_VALIDATION.NOM_REQUIS)
        .isLength({ min: 2, max: 50 })
        .withMessage('Le nom doit contenir entre 2 et 50 caractères')
        .trim(),
    body('prenom')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('Le prénom doit contenir entre 2 et 50 caractères')
        .trim(),
    body('email')
        .notEmpty()
        .withMessage(message_1.MESSAGES_VALIDATION.EMAIL_REQUIS)
        .isEmail()
        .withMessage('Format d\'email invalide')
        .normalizeEmail(),
    body('telephone')
        .optional()
        .matches(/^(77|78|76|70|75)[0-9]{7}$/)
        .withMessage('Numéro de téléphone sénégalais invalide'),
    body('motDePasse')
        .notEmpty()
        .withMessage(message_1.MESSAGES_VALIDATION.MOT_DE_PASSE_REQUIS)
        .isLength({ min: 6, max: 100 })
        .withMessage('Le mot de passe doit contenir entre 6 et 100 caractères')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre')
];
/**
 * Validateurs pour la connexion
 */
exports.validationConnexion = [
    body('email')
        .notEmpty()
        .withMessage(message_1.MESSAGES_VALIDATION.EMAIL_REQUIS)
        .isEmail()
        .withMessage('Format d\'email invalide')
        .normalizeEmail(),
    body('motDePasse')
        .notEmpty()
        .withMessage(message_1.MESSAGES_VALIDATION.MOT_DE_PASSE_REQUIS)
];
/**
 * Validateurs pour le changement de mot de passe
 */
exports.validationChangementMotDePasse = [
    body('ancienMotDePasse')
        .notEmpty()
        .withMessage('L\'ancien mot de passe est requis'),
    body('nouveauMotDePasse')
        .notEmpty()
        .withMessage('Le nouveau mot de passe est requis')
        .isLength({ min: 6, max: 100 })
        .withMessage('Le nouveau mot de passe doit contenir entre 6 et 100 caractères')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Le nouveau mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre')
];
/**
 * Validateurs pour les produits
 */
exports.validationProduit = [
    body('titre')
        .notEmpty()
        .withMessage(message_1.MESSAGES_VALIDATION.TITRE_REQUIS)
        .isLength({ min: 3, max: 100 })
        .withMessage('Le titre doit contenir entre 3 et 100 caractères')
        .trim(),
    body('description')
        .notEmpty()
        .withMessage(message_1.MESSAGES_VALIDATION.DESCRIPTION_REQUISE)
        .isLength({ min: 10, max: 1000 })
        .withMessage('La description doit contenir entre 10 et 1000 caractères')
        .trim(),
    body('prix')
        .notEmpty()
        .withMessage(message_1.MESSAGES_VALIDATION.PRIX_REQUIS)
        .isFloat({ min: 0.01 })
        .withMessage('Le prix doit être un nombre positif supérieur à 0'),
    body('localisation')
        .optional()
        .isLength({ max: 100 })
        .withMessage('La localisation ne peut pas dépasser 100 caractères')
        .trim(),
    body('estVip')
        .optional()
        .isBoolean()
        .withMessage('Le statut VIP doit être un booléen')
];
/**
 * Validateurs pour la mise à jour d'un produit
 */
exports.validationMiseAJourProduit = [
    body('titre')
        .optional()
        .isLength({ min: 3, max: 100 })
        .withMessage('Le titre doit contenir entre 3 et 100 caractères')
        .trim(),
    body('description')
        .optional()
        .isLength({ min: 10, max: 1000 })
        .withMessage('La description doit contenir entre 10 et 1000 caractères')
        .trim(),
    body('prix')
        .optional()
        .isFloat({ min: 0.01 })
        .withMessage('Le prix doit être un nombre positif supérieur à 0'),
    body('localisation')
        .optional()
        .isLength({ max: 100 })
        .withMessage('La localisation ne peut pas dépasser 100 caractères')
        .trim(),
    body('estVip')
        .optional()
        .isBoolean()
        .withMessage('Le statut VIP doit être un booléen')
];
/**
 * Validateurs pour les notifications
 */
exports.validationNotification = [
    body('titre')
        .notEmpty()
        .withMessage('Le titre de la notification est requis')
        .isLength({ min: 3, max: 100 })
        .withMessage('Le titre doit contenir entre 3 et 100 caractères')
        .trim(),
    body('message')
        .notEmpty()
        .withMessage('Le message de la notification est requis')
        .isLength({ min: 10, max: 500 })
        .withMessage('Le message doit contenir entre 10 et 500 caractères')
        .trim(),
    body('type')
        .optional()
        .isIn(['GENERALE', 'PRODUIT_EXPIRE', 'PRODUIT_VALIDE', 'PRODUIT_REJETE', 'RAPPEL'])
        .withMessage('Type de notification invalide')
];
