// Routes des notifications pour FotoLouJay

import { Router } from 'express';
import { verifierToken, verifierRole } from '../middlewares/auth.middleware';
import { RoleUtilisateur } from '../enums/message';

export const routesNotification = Router();

import { ControleurNotification } from '../controllers/notification.controller';

/**
 * @route GET /api/notifications
 * @desc Récupérer les notifications de l'utilisateur connecté
 * @access Private
 */
routesNotification.get('/', verifierToken, ControleurNotification.obtenirPourUtilisateur);

/**
 * @route POST /api/notifications
 * @desc Créer une nouvelle notification
 * @access Private (Admin/Modérateur)
 */
routesNotification.post(
  '/',
  verifierToken,
  verifierRole(RoleUtilisateur.MODERATEUR, RoleUtilisateur.ADMINISTRATEUR),
  ControleurNotification.creer
);

/**
 * @route PUT /api/notifications/:id/lire
 * @desc Marquer une notification comme lue
 * @access Private
 */
routesNotification.put('/:id/lire', verifierToken, (req, res) => {
  res.json({ message: 'Marquer notification lue - À implémenter' });
});

/**
 * @route DELETE /api/notifications/:id
 * @desc Supprimer une notification
 * @access Private
 */
routesNotification.delete('/:id', verifierToken, (req, res) => {
  res.json({ message: 'Suppression notification - À implémenter' });
});