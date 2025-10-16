// Routes des utilisateurs pour FotoLouJay

import { Router } from 'express';
import { verifierToken, verifierRole } from '../middlewares/auth.middleware';
import { RoleUtilisateur } from '../enums/message';
import { ControleurUtilisateur } from '../controllers/utilisateur.controller';

export const routesUtilisateur = Router();

/**
 * @route GET /api/utilisateurs
 * @desc Récupérer tous les utilisateurs
 * @access Private (Admin)
 */
routesUtilisateur.get(
  '/',
  verifierToken,
  verifierRole(RoleUtilisateur.ADMINISTRATEUR),
  ControleurUtilisateur.obtenirTous
);

/**
 * @route GET /api/utilisateurs/:id
 * @desc Récupérer un utilisateur par ID
 * @access Private (Admin ou Propriétaire)
 */
routesUtilisateur.get('/:id', verifierToken, ControleurUtilisateur.obtenirParId);

/**
 * @route PUT /api/utilisateurs/:id
 * @desc Mettre à jour un utilisateur
 * @access Private (Propriétaire)
 */
routesUtilisateur.put('/:id', verifierToken, ControleurUtilisateur.mettreAJour);

/**
 * @route DELETE /api/utilisateurs/:id
 * @desc Supprimer un utilisateur
 * @access Private (Admin)
 */
routesUtilisateur.delete(
  '/:id',
  verifierToken,
  verifierRole(RoleUtilisateur.ADMINISTRATEUR),
  ControleurUtilisateur.supprimer
);