// Contrôleur des utilisateurs pour FotoLouJay

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { MESSAGES_ERREUR } from '../enums/message';

const prisma = new PrismaClient();

export class ControleurUtilisateur {
  /**
   * Récupérer tous les utilisateurs
   */
  static async obtenirTous(req: Request, res: Response) {
    try {
      const utilisateurs = await prisma.utilisateur.findMany();
      return res.status(200).json({ success: true, utilisateurs });
    } catch (error) {
      console.error('Erreur dans ControleurUtilisateur.obtenirTous:', error);
      return res.status(500).json({ success: false, message: MESSAGES_ERREUR.ERREUR_SERVEUR });
    }
  }

  /**
   * Récupérer un utilisateur par ID
   */
  static async obtenirParId(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const utilisateur = await prisma.utilisateur.findUnique({ where: { id } });
      if (!utilisateur) {
        return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
      }
      return res.status(200).json({ success: true, utilisateur });
    } catch (error) {
      console.error('Erreur dans ControleurUtilisateur.obtenirParId:', error);
      return res.status(500).json({ success: false, message: MESSAGES_ERREUR.ERREUR_SERVEUR });
    }
  }

  /**
   * Mettre à jour un utilisateur
   */
  static async mettreAJour(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const data = req.body;
      const utilisateur = await prisma.utilisateur.update({ where: { id }, data });
      return res.status(200).json({ success: true, utilisateur });
    } catch (error) {
      console.error('Erreur dans ControleurUtilisateur.mettreAJour:', error);
      return res.status(500).json({ success: false, message: MESSAGES_ERREUR.ERREUR_SERVEUR });
    }
  }

  /**
   * Supprimer un utilisateur
   */
  static async supprimer(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await prisma.utilisateur.delete({ where: { id } });
      return res.status(200).json({ success: true, message: 'Utilisateur supprimé' });
    } catch (error) {
      console.error('Erreur dans ControleurUtilisateur.supprimer:', error);
      return res.status(500).json({ success: false, message: MESSAGES_ERREUR.ERREUR_SERVEUR });
    }
  }
}
