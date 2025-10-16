"use strict";
// Service des notifications pour FotoLouJay
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
exports.ServiceNotification = void 0;
const notification_repository_1 = require("../repositories/notification.repository");
class ServiceNotification {
    /**
     * Récupérer les notifications d'un utilisateur
     */
    static obtenirPourUtilisateur(utilisateurId) {
        return __awaiter(this, void 0, void 0, function* () {
            return notification_repository_1.NotificationRepository.findByUserId(utilisateurId);
        });
    }
    /**
     * Créer une notification
     */
    static creer(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return notification_repository_1.NotificationRepository.create(data);
        });
    }
}
exports.ServiceNotification = ServiceNotification;
