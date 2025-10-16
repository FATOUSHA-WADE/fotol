// Contrôleur des notifications pour FotoLouJay

import { Request, Response } from 'express';
// Correction :
const ServiceNotification = require('../services/notification.service').ServiceNotification;
import { MESSAGES_ERREUR } from '../enums/message';

export class ControleurNotification {
  /**
   * Récupérer les notifications de l'utilisateur connecté
   */
  static async obtenirPourUtilisateur(req: Request, res: Response) {
    try {
      const utilisateurId = req.utilisateur?.id;
      if (!utilisateurId) {
        return res.status(401).json({
          success: false,
          message: MESSAGES_ERREUR.TOKEN_INVALIDE
        });
      }
      const notifications = await ServiceNotification.obtenirPourUtilisateur(utilisateurId);
      return res.status(200).json({ success: true, notifications });
    } catch (error) {
      console.error('Erreur dans ControleurNotification.obtenirPourUtilisateur:', error);
      return res.status(500).json({ success: false, message: MESSAGES_ERREUR.ERREUR_SERVEUR });
    }
  }

  /**
   * Créer une notification (admin/modérateur)
   */
  static async creer(req: Request, res: Response) {
    try {
      const notification = await ServiceNotification.creer(req.body);
      return res.status(201).json({ success: true, notification });
    } catch (error) {
      console.error('Erreur dans ControleurNotification.creer:', error);
      return res.status(500).json({ success: false, message: MESSAGES_ERREUR.ERREUR_SERVEUR });
    }
  }
}
