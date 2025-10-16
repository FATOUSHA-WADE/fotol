// Service des notifications pour FotoLouJay

import { NotificationRepository } from '../repositories/notification.repository';

export class ServiceNotification {
  /**
   * Récupérer les notifications d'un utilisateur
   */
  static async obtenirPourUtilisateur(utilisateurId: number) {
    return NotificationRepository.findByUserId(utilisateurId);
  }

  /**
   * Créer une notification
   */
  static async creer(data: any) {
    return NotificationRepository.create(data);
  }
}
