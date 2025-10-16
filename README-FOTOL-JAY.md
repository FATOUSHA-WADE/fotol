# FOTOL JAY - Application complète

## Vue d'ensemble

FOTOL JAY est une plateforme de vente en ligne d'occasion avec un système d'authentification des produits par capture photo obligatoire. L'application se compose d'un backend Node.js avec Prisma et d'un frontend Angular moderne.

## Architecture

### Backend (Node.js + TypeScript + Prisma)
- **API REST** avec Express.js
- **Base de données** MySQL avec Prisma ORM
- **Authentification** JWT
- **Gestion des fichiers** pour les photos
- **Modération** intégrée

### Frontend (Angular 17+)
- **Framework** Angular 17 avec composants standalone
- **UI/UX** Design moderne avec thème jaune moutarde
- **Responsive** Mobile-first
- **Capture photo** via API navigateur
- **Gestion d'état** avec services RxJS

## Fonctionnalités principales

### ✅ Authentification
- Inscription/Connexion sécurisée
- Gestion des rôles (USER, MODERATOR, ADMIN)
- Système VIP avec avantages

### ✅ Gestion des produits
- Publication avec capture photo obligatoire
- Modération avant publication
- Système de vues et statistiques
- Suppression automatique après une semaine

### ✅ Interface utilisateur
- Dashboard personnel avec statistiques
- Notifications en temps réel
- Recherche et filtres avancés
- Interface de modération

## Installation et démarrage

### Prérequis
- Node.js 18+
- MySQL 8.0+
- Angular CLI

### Backend

1. **Configuration de la base de données**
```bash
cd backend
npm install
cp .env.example .env
# Éditer .env avec vos paramètres MySQL
```

2. **Migrations Prisma**
```bash
npx prisma generate
npx prisma db push
# Ou pour la production :
npx prisma migrate deploy
```

3. **Peuplement initial (optionnel)**
```bash
npm run seed
```

4. **Démarrage du serveur**
```bash
npm run dev  # Développement
# ou
npm run build && npm start  # Production
```

Le serveur démarre sur `http://localhost:3000`

### Frontend

1. **Installation des dépendances**
```bash
cd frontend/enset-app
npm install
```

2. **Démarrage du serveur de développement**
```bash
ng serve
```

L'application démarre sur `http://localhost:4200`

## Structure de la base de données

### Tables principales

#### `Utilisateur`
- Gestion des comptes utilisateurs
- Rôles et statut VIP
- Métadonnées de connexion

#### `Produit`
- Informations des produits
- Statuts de modération
- Compteurs de vues
- Relations avec utilisateurs et photos

#### `Photo`
- Stockage des URLs des images
- Photo principale par produit
- Gestion des métadonnées

#### `Notification`
- Système de notifications
- Types et statuts de lecture
- Relations avec utilisateurs et produits

## API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur

### Produits
- `GET /api/produits` - Liste des produits
- `GET /api/produits/vip` - Produits VIP
- `GET /api/produits/:id` - Détails produit
- `POST /api/produits` - Créer un produit
- `PUT /api/produits/:id` - Modifier un produit
- `DELETE /api/produits/:id` - Supprimer un produit

### Utilisateurs
- `GET /api/utilisateurs/:id/produits` - Produits d'un utilisateur
- `GET /api/utilisateurs/:id/stats` - Statistiques utilisateur
- `GET /api/utilisateurs/:id/notifications` - Notifications

### Modération
- `GET /api/moderation/produits` - Produits en attente
- `PUT /api/moderation/produits/:id/approve` - Approuver un produit
- `PUT /api/moderation/produits/:id/reject` - Rejeter un produit

## Variables d'environnement

### Backend (.env)
```env
DATABASE_URL="mysql://username:password@localhost:3306/fotol_jay"
JWT_SECRET="your-secret-key"
PORT=3000
NODE_ENV="development"
```

### Frontend (environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

## Fonctionnalités détaillées

### Système de photos
- **Capture obligatoire** via l'appareil photo du navigateur
- **Authenticité garantie** - pas d'import depuis la galerie
- **Limite de 5 photos** par produit
- **Photo principale** automatique (première photo)

### Modération
- **Validation obligatoire** avant publication
- **Interface dédiée** pour les modérateurs
- **Rejet motivé** avec raison
- **Statistiques de modération**

### Système VIP
- **Badge visuel** sur les produits
- **Mise en avant** dans les résultats
- **Supplément de 5€** par annonce
- **Avantages de visibilité**

### Notifications
- **Expiration des produits** (2 jours avant)
- **Approbation/Rejet** des produits
- **Messages système**
- **Gestion des statuts** de lecture

## Sécurité

- **Authentification JWT** avec expiration
- **Validation des données** côté serveur
- **Protection CSRF**
- **Sécurisation des uploads** de photos
- **Gestion des rôles** et permissions

## Déploiement

### Backend
```bash
npm run build
npm start
```

### Frontend
```bash
ng build --configuration production
```

## Développement

### Ajout de nouvelles fonctionnalités

1. **Backend** : Créer le contrôleur et les routes
2. **Base de données** : Mettre à jour le schéma Prisma
3. **Frontend** : Créer le service et les composants
4. **Tests** : Ajouter les tests unitaires/intégration

### Structure recommandée

```
backend/
├── controllers/     # Logique métier
├── services/       # Services externes
├── middlewares/    # Auth, validation, etc.
├── routes/         # Définition des routes
└── validators/     # Validation des données

frontend/
├── models/         # Interfaces TypeScript
├── services/       # Services API
├── features/       # Fonctionnalités (modules)
└── shared/         # Composants partagés
```

## Support

Pour toute question ou problème :
1. Consulter les logs du serveur
2. Vérifier la configuration de la base de données
3. Tester les endpoints API avec Postman/curl
4. Vérifier les erreurs dans la console du navigateur

## Roadmap

- [ ] Chat entre utilisateurs
- [ ] Système de favoris
- [ ] Géolocalisation avancée
- [ ] Application mobile native
- [ ] Analytics avancés
- [ ] Intégration de paiement

---

**FOTOL JAY** - La plateforme de confiance pour la vente en ligne avec authenticité garantie ! 📸✨