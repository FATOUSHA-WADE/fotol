"use strict";
// Contrôleur des utilisateurs pour FotoLouJay
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
exports.ControleurUtilisateur = void 0;
const client_1 = require("@prisma/client");
const message_1 = require("../enums/message");
const prisma = new client_1.PrismaClient();
class ControleurUtilisateur {
    /**
     * Récupérer tous les utilisateurs
     */
    static obtenirTous(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const utilisateurs = yield prisma.utilisateur.findMany();
                return res.status(200).json({ success: true, utilisateurs });
            }
            catch (error) {
                console.error('Erreur dans ControleurUtilisateur.obtenirTous:', error);
                return res.status(500).json({ success: false, message: message_1.MESSAGES_ERREUR.ERREUR_SERVEUR });
            }
        });
    }
    /**
     * Récupérer un utilisateur par ID
     */
    static obtenirParId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const utilisateur = yield prisma.utilisateur.findUnique({ where: { id } });
                if (!utilisateur) {
                    return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
                }
                return res.status(200).json({ success: true, utilisateur });
            }
            catch (error) {
                console.error('Erreur dans ControleurUtilisateur.obtenirParId:', error);
                return res.status(500).json({ success: false, message: message_1.MESSAGES_ERREUR.ERREUR_SERVEUR });
            }
        });
    }
    /**
     * Mettre à jour un utilisateur
     */
    static mettreAJour(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const data = req.body;
                const utilisateur = yield prisma.utilisateur.update({ where: { id }, data });
                return res.status(200).json({ success: true, utilisateur });
            }
            catch (error) {
                console.error('Erreur dans ControleurUtilisateur.mettreAJour:', error);
                return res.status(500).json({ success: false, message: message_1.MESSAGES_ERREUR.ERREUR_SERVEUR });
            }
        });
    }
    /**
     * Supprimer un utilisateur
     */
    static supprimer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                yield prisma.utilisateur.delete({ where: { id } });
                return res.status(200).json({ success: true, message: 'Utilisateur supprimé' });
            }
            catch (error) {
                console.error('Erreur dans ControleurUtilisateur.supprimer:', error);
                return res.status(500).json({ success: false, message: message_1.MESSAGES_ERREUR.ERREUR_SERVEUR });
            }
        });
    }
}
exports.ControleurUtilisateur = ControleurUtilisateur;
