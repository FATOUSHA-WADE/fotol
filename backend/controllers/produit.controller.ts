
const { validationResult } = require('express-validator');
import { Request, Response } from 'express';
import { ServiceProduit } from '../services/produit.service';
import { MESSAGES_ERREUR } from '../enums/message';
// import { StatutProduit } from '../enums/statut-produit'; // Décommentez si le fichier existe

export type CustomRequest = Request & {
  utilisateur?: any;
  files?: any;
  file?: any;
};

export class ControleurProduit {
  /**
   * Créer un nouveau produit
   */
  static async creer(req: CustomRequest, res: Response) {
    try {
      const erreurs = validationResult(req);
      if (!erreurs.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Erreurs de validation',
          erreurs: erreurs.array()
        });
      }

      const utilisateurId = req.utilisateur?.id;
      if (!utilisateurId) {
        return res.status(401).json({
          success: false,
          message: MESSAGES_ERREUR.TOKEN_INVALIDE
        });
      }

      // Vérification de la présence d'une image (file upload ou photo capturée)
      const filesObj = req.files;
      const photoFile = filesObj?.photo?.[0] || filesObj?.photosSupplementaires?.[0];

      if (!req.file && !(req.body && req.body.imageUrl) && !photoFile) {
        return res.status(400).json({
          success: false,
          message: MESSAGES_ERREUR.IMAGE_REQUISE
        });
      }

      // Support des deux formats : ancien (titre) et nouveau (nom)
      const { titre, nom, description, prix, localisation, estVip, sourceType, securityLevel, imageUrl, imagePublicId } = req.body || {};

      // Validation de sécurité pour les photos authentiques
      if (sourceType && sourceType !== 'camera_capture_only') {
        return res.status(400).json({
          success: false,
          message: 'Source de photo non autorisée. Utilisez uniquement l\'appareil photo.'
        });
      }

      if (securityLevel && securityLevel !== 'authenticated_photos') {
        return res.status(400).json({
          success: false,
          message: 'Niveau de sécurité insuffisant pour les photos.'
        });
      }

      const donneesProduit = {
        titre: titre || nom,
        description,
  prix: parseFloat(prix) || 0,
        imageUrl: imageUrl || req.file?.path || photoFile?.path || '',
        imagePublicId: imagePublicId,
        localisation,
        estVip: estVip === 'true' || estVip === true,
        utilisateurId,
        sourceType: sourceType || 'camera_capture_only',
        securityLevel: securityLevel || 'authenticated_photos'
      };

      const resultat = await ServiceProduit.creer(donneesProduit);
      const statusCode = resultat.success ? 201 : 400;
      return res.status(statusCode).json(resultat);
    } catch (error) {
      console.error('Erreur dans ControleurProduit.creer:', error);
      return res.status(500).json({
        success: false,
        message: MESSAGES_ERREUR.ERREUR_SERVEUR
      });
    }
  }
  /**
   * Obtenir tous les produits (avec filtres)
   */
  static async obtenirTous(req: Request, res: Response) {
    try {
      const {
        statut,
        estVip,
        utilisateurId,
        recherche,
        categorie,
        page = '1',
        limite = '20'
      } = req.query;

      const filtres = {
        ...(typeof statut === 'string' && { statut }),
        ...(estVip !== undefined && { estVip: estVip === 'true' }),
        ...(utilisateurId && { utilisateurId: parseInt(utilisateurId as string) }),
        ...(recherche && { recherche: recherche as string }),
        ...(categorie && { categorie: categorie as string }),
        page: parseInt(page as string),
        limite: parseInt(limite as string)
      };

      const resultat = await ServiceProduit.obtenirTous(filtres);
      return res.status(200).json(resultat);
    } catch (error) {
      console.error('Erreur dans ControleurProduit.obtenirTous:', error);
      return res.status(500).json({
        success: false,
        message: MESSAGES_ERREUR.ERREUR_SERVEUR
      });
    }
  }

  /**
   * Obtenir les produits publics (pour les utilisateurs non connectés)
   */
  static async obtenirProduitsPublics(req: Request, res: Response) {
    try {
      const {
        estVip,
        recherche,
        categorie,
        page = '1',
        limite = '20'
      } = req.query;

      const filtres = {
        ...(estVip !== undefined && { estVip: estVip === 'true' }),
        ...(recherche && { recherche: recherche as string }),
        ...(categorie && { categorie: categorie as string }),
        page: parseInt(page as string),
        limite: parseInt(limite as string)
      };

      const resultat = await ServiceProduit.obtenirProduitsPublics(filtres);

      return res.status(200).json(resultat);
    } catch (error) {
      console.error('Erreur dans ControleurProduit.obtenirProduitsPublics:', error);
      return res.status(500).json({
        success: false,
        message: MESSAGES_ERREUR.ERREUR_SERVEUR
      });
    }
  }

  /**
   * Obtenir les produits VIP
   */
  static async obtenirProduitsVip(req: Request, res: Response) {
    try {
      const {
        recherche,
        categorie,
        page = '1',
        limite = '20'
      } = req.query;

      const filtres = {
        ...(recherche && { recherche: recherche as string }),
        ...(categorie && { categorie: categorie as string }),
        page: parseInt(page as string),
        limite: parseInt(limite as string)
      };

      const resultat = await ServiceProduit.obtenirProduitsVip(filtres);

      return res.status(200).json(resultat);
    } catch (error) {
      console.error('Erreur dans ControleurProduit.obtenirProduitsVip:', error);
      return res.status(500).json({
        success: false,
        message: MESSAGES_ERREUR.ERREUR_SERVEUR
      });
    }
  }

  /**
   * Obtenir un produit par ID
   */
  static async obtenirParId(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const utilisateurId = req.utilisateur?.id;
      const adresseIp = req.ip;

      const resultat = await ServiceProduit.obtenirParId(id, utilisateurId, adresseIp);

      const statusCode = resultat.success ? 200 : 404;
      return res.status(statusCode).json(resultat);
    } catch (error) {
      console.error('Erreur dans ControleurProduit.obtenirParId:', error);
      return res.status(500).json({
        success: false,
        message: MESSAGES_ERREUR.ERREUR_SERVEUR
      });
    }
  }

  /**
   * Mettre à jour un produit
   */
  static async mettreAJour(req: Request, res: Response) {
    try {
    // Vérification des erreurs de validation
    const erreurs = validationResult(req);
      if (!erreurs.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Erreurs de validation',
          erreurs: erreurs.array()
        });
      }

      const id = parseInt(req.params.id);
      const utilisateurId = req.utilisateur?.id;
      const roleUtilisateur = req.utilisateur?.role;

      if (!utilisateurId || !roleUtilisateur) {
        return res.status(401).json({
          success: false,
          message: MESSAGES_ERREUR.TOKEN_INVALIDE
        });
      }

      const { titre, description, prix, localisation, estVip, imageUrl, imagePublicId } = req.body;

      const donneesMiseAJour = {
        ...(titre && { titre }),
        ...(description && { description }),
        ...(prix && { prix: parseFloat(prix) }),
        ...(localisation !== undefined && { localisation }),
        ...(estVip !== undefined && { estVip: estVip === 'true' || estVip === true }),
        ...(imageUrl && { imageUrl }),
        ...(imagePublicId && { imagePublicId })
      };

      const resultat = await ServiceProduit.mettreAJour(
        id,
        donneesMiseAJour,
        utilisateurId,
        roleUtilisateur
      );

      const statusCode = resultat.success ? 200 : (resultat.message === MESSAGES_ERREUR.PRODUIT_NON_TROUVE ? 404 : 403);
      return res.status(statusCode).json(resultat);
    } catch (error) {
      console.error('Erreur dans ControleurProduit.mettreAJour:', error);
      return res.status(500).json({
        success: false,
        message: MESSAGES_ERREUR.ERREUR_SERVEUR
      });
    }
  }

  /**
   * Supprimer un produit
   */
  static async supprimer(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const utilisateurId = req.utilisateur?.id;
      const roleUtilisateur = req.utilisateur?.role;

      if (!utilisateurId || !roleUtilisateur) {
        return res.status(401).json({
          success: false,
          message: MESSAGES_ERREUR.TOKEN_INVALIDE
        });
      }

      const resultat = await ServiceProduit.supprimer(id, utilisateurId, roleUtilisateur);

      const statusCode = resultat.success ? 200 : (resultat.message === MESSAGES_ERREUR.PRODUIT_NON_TROUVE ? 404 : 403);
      return res.status(statusCode).json(resultat);
    } catch (error) {
      console.error('Erreur dans ControleurProduit.supprimer:', error);
      return res.status(500).json({
        success: false,
        message: MESSAGES_ERREUR.ERREUR_SERVEUR
      });
    }
  }

  /**
   * Valider un produit (modérateur/admin)
   */
  static async valider(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      
      const resultat = await ServiceProduit.valider(id);

      const statusCode = resultat.success ? 200 : 404;
      return res.status(statusCode).json(resultat);
    } catch (error) {
      console.error('Erreur dans ControleurProduit.valider:', error);
      return res.status(500).json({
        success: false,
        message: MESSAGES_ERREUR.ERREUR_SERVEUR
      });
    }
  }

  /**
   * Rejeter un produit (modérateur/admin)
   */
  static async rejeter(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      
      const resultat = await ServiceProduit.rejeter(id);

      const statusCode = resultat.success ? 200 : 404;
      return res.status(statusCode).json(resultat);
    } catch (error) {
      console.error('Erreur dans ControleurProduit.rejeter:', error);
      return res.status(500).json({
        success: false,
        message: MESSAGES_ERREUR.ERREUR_SERVEUR
      });
    }
  }

  /**
   * Obtenir les produits de l'utilisateur connecté
   */
  static async obtenirMesProduits(req: Request, res: Response) {
    try {
      const utilisateurId = req.utilisateur?.id;
      
      if (!utilisateurId) {
        return res.status(401).json({
          success: false,
          message: MESSAGES_ERREUR.TOKEN_INVALIDE
        });
      }

      const {
        statut,
        page = '1',
        limite = '20'
      } = req.query;

      const filtres = {
        utilisateurId,
  ...(typeof statut === 'string' && { statut }),
        page: parseInt(page as string),
        limite: parseInt(limite as string)
      };

      const resultat = await ServiceProduit.obtenirTous(filtres);

      return res.status(200).json(resultat);
    } catch (error) {
      console.error('Erreur dans ControleurProduit.obtenirMesProduits:', error);
      return res.status(500).json({
        success: false,
        message: MESSAGES_ERREUR.ERREUR_SERVEUR
      });
    }
  }

  /**
   * Obtenir les statistiques des produits
   */
  static async obtenirStatistiques(req: Request, res: Response) {
    try {
      const utilisateurId = req.utilisateur?.id;
      const role = req.utilisateur?.role;

  // Seuls les modérateurs/admins peuvent voir toutes les statistiques
  // Si vous avez une enum RoleUtilisateur, utilisez-la ici
  // Exemple :
  // const idUtilisateur = (role === RoleUtilisateur.MODERATEUR || role === RoleUtilisateur.ADMINISTRATEUR)
  //   ? undefined
  //   : utilisateurId;
  // Pour l'instant, on passe toujours utilisateurId
  const idUtilisateur = utilisateurId;

      const resultat = await ServiceProduit.obtenirStatistiques(idUtilisateur);

      return res.status(200).json(resultat);
    } catch (error) {
      console.error('Erreur dans ControleurProduit.obtenirStatistiques:', error);
      return res.status(500).json({
        success: false,
        message: MESSAGES_ERREUR.ERREUR_SERVEUR
      });
    }
  }
}