"use strict";
// Contrôleur des notifications pour FotoLouJay
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControleurNotification = void 0;
// Correction :
const ServiceNotification = require('../services/notification.service').ServiceNotification;
const message_1 = require("../enums/message");
class ControleurNotification {
    /**
     * Récupérer les notifications de l'utilisateur connecté
     */
    static obtenirPourUtilisateur(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const utilisateurId = (_a = req.utilisateur) === null || _a === void 0 ? void 0 : _a.id;
                if (!utilisateurId) {
                    return res.status(401).json({
                        success: false,
                        message: message_1.MESSAGES_ERREUR.TOKEN_INVALIDE
                    });
                }
                const notifications = yield ServiceNotification.obtenirPourUtilisateur(utilisateurId);
                return res.status(200).json({ success: true, notifications });
            }
            catch (error) {
                console.error('Erreur dans ControleurNotification.obtenirPourUtilisateur:', error);
                return res.status(500).json({ success: false, message: message_1.MESSAGES_ERREUR.ERREUR_SERVEUR });
            }
        });
    }
    /**
     * Créer une notification (admin/modérateur)
     */
    static creer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notification = yield ServiceNotification.creer(req.body);
                return res.status(201).json({ success: true, notification });
            }
            catch (error) {
                console.error('Erreur dans ControleurNotification.creer:', error);
                return res.status(500).json({ success: false, message: message_1.MESSAGES_ERREUR.ERREUR_SERVEUR });
            }
        });
    }
}
exports.ControleurNotification = ControleurNotification;
