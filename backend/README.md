# 🚀 FotoLouJay Backend API

Backend de l'application mobile de vente en ligne FotoLouJay développé avec Node.js, Express, TypeScript et Prisma.

## 📋 Table des matières

- [Installation et Configuration](#installation-et-configuration)
- [Authentification](#authentification)
- [Endpoints API](#endpoints-api)
- [Tests avec des données](#tests-avec-des-données)
- [Codes d'erreur](#codes-derreur)
- [Sécurité](#sécurité)

## 🛠 Installation et Configuration

### Prérequis
- Node.js 18+
- MySQL/MariaDB
- npm ou yarn

### Installation
```bash
# Cloner le projet
git clone https://github.com/FATOUSHA-WADE/fotol.git
cd fotol/backend

# Installer les dépendances
npm install

# Configuration de la base de données
cp .env.example .env
# Éditer .env avec vos paramètres de base de données

# Synchroniser la base de données
npx prisma db push
npx prisma generate

# Créer des données de test
npm run seed

# Démarrer le serveur de développement
npm run dev
```

### Variables d'environnement (.env)
```env
# Base de données
DATABASE_URL="mysql://username:password@localhost:3306/fotol"

# JWT
JWT_SECRET="votre_jwt_secret_tres_securise"
JWT_EXPIRES_IN="24h"

# Upload de fichiers
MAX_FILE_SIZE=2097152
ALLOWED_FILE_TYPES="image/jpeg,image/png"

# Serveur
PORT=3001
NODE_ENV=development
```

## 🔐 Authentification

### 1. Inscription d'un utilisateur

**POST** `/api/auth/inscription`

```json
{
  "nom": "Diop",
  "prenom": "Amadou",
  "email": "amadou.diop@fotoljay.sn",
  "telephone": "+221 77 123 45 67",
  "motDePasse": "motDePasseSecurise123"
}
```

**Réponse de succès (201):**
```json
{
  "success": true,
  "message": "Utilisateur créé avec succès",
  "data": {
    "utilisateur": {
      "id": 1,
      "nom": "Diop",
      "prenom": "Amadou",
      "email": "amadou.diop@fotoljay.sn",
      "role": "UTILISATEUR"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Connexion

**POST** `/api/auth/connexion`

```json
{
  "email": "fatousha@gmail.com",
  "motDePasse": "toufa"
}
```

**Réponse de succès (200):**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "utilisateur": {
      "id": 1,
      "nom": "Wade",
      "prenom": "Fatousha",
      "email": "fatousha@gmail.com",
      "role": "ADMINISTRATEUR"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Vérification du token

**GET** `/api/auth/verifier-token`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🛍️ Gestion des Produits

### 1. Créer un produit (Photos capturées uniquement)

**POST** `/api/produits`

**Headers:**
```
Authorization: Bearer TOKEN_JWT
Content-Type: multipart/form-data
```

**FormData:**
```javascript
const formData = new FormData();
formData.append('nom', 'iPhone 15 Pro Max');
formData.append('description', 'Téléphone neuf, encore sous garantie. Couleur bleu titane, 256GB.');
formData.append('prix', '850000');
formData.append('localisation', 'Dakar Plateau');
formData.append('sourceType', 'camera_capture_only');
formData.append('securityLevel', 'authenticated_photos');
formData.append('photo', fileBlob, 'fotoljay_capture_1697123456789.jpg');
// Optionnel: photos supplémentaires
formData.append('photosSupplementaires', fileBlob2, 'fotoljay_extra_1697123456790.jpg');
```

**Exemple avec curl:**
```bash
curl -X POST "http://localhost:3001/api/produits" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "nom=iPhone 15 Pro Max" \
  -F "description=Téléphone neuf sous garantie" \
  -F "prix=850000" \
  -F "localisation=Dakar Plateau" \
  -F "sourceType=camera_capture_only" \
  -F "securityLevel=authenticated_photos" \
  -F "photo=@path/to/captured_photo.jpg"
```

### 2. Obtenir les produits publics

**GET** `/api/produits/publics`

**Paramètres optionnels:**
```
?recherche=iPhone&estVip=true&page=1&limite=10&prixMin=100000&prixMax=1000000
```

**Exemple:**
```bash
curl "http://localhost:3001/api/produits/publics?recherche=iPhone&page=1&limite=5"
```

**Réponse:**
```json
{
  "success": true,
  "message": "Produits récupérés avec succès",
  "data": {
    "produits": [
      {
        "id": 1,
        "titre": "iPhone 15 Pro Max",
        "description": "Téléphone neuf...",
        "prix": 850000,
        "imageUrl": "uploads/produit_1697123456789.jpg",
        "estVip": false,
        "vues": 15,
        "localisation": "Dakar Plateau",
        "dateCreation": "2025-10-13T10:30:00Z",
        "utilisateur": {
          "nom": "Diop",
          "prenom": "Amadou",
          "telephone": "+221 77 123 45 67"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limite": 5,
      "total": 25,
      "totalPages": 5
    }
  }
}
```

### 3. Obtenir un produit par ID

**GET** `/api/produits/:id`

```bash
curl "http://localhost:3001/api/produits/1"
```

### 4. Obtenir les produits VIP

**GET** `/api/produits/vip`

```bash
curl "http://localhost:3001/api/produits/vip?page=1&limite=10"
```

### 5. Mes produits (authentifié)

**GET** `/api/produits/mes-produits`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3001/api/produits/mes-produits?statut=EN_ATTENTE"
```

### 6. Mettre à jour un produit

**PUT** `/api/produits/:id`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

```json
{
  "titre": "iPhone 15 Pro Max - Prix réduit",
  "prix": 800000,
  "description": "Prix négociable, très bon état"
}
```

### 7. Supprimer un produit

**DELETE** `/api/produits/:id`

```bash
curl -X DELETE \
  -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3001/api/produits/1"
```

## 🔧 Modération (Modérateur/Admin)

### 1. Obtenir tous les produits

**GET** `/api/produits`

**Headers:**
```
Authorization: Bearer MODERATEUR_TOKEN
```

```bash
curl -H "Authorization: Bearer MODERATEUR_TOKEN" \
  "http://localhost:3001/api/produits?statut=EN_ATTENTE&page=1"
```

### 2. Valider un produit

**PUT** `/api/produits/:id/valider`

```bash
curl -X PUT \
  -H "Authorization: Bearer MODERATEUR_TOKEN" \
  "http://localhost:3001/api/produits/1/valider"
```

### 3. Rejeter un produit

**PUT** `/api/produits/:id/rejeter`

```bash
curl -X PUT \
  -H "Authorization: Bearer MODERATEUR_TOKEN" \
  "http://localhost:3001/api/produits/1/rejeter"
```

## 🔔 Notifications

### 1. Obtenir mes notifications

**GET** `/api/notifications`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3001/api/notifications?isLu=false"
```

### 2. Marquer comme lue

**PUT** `/api/notifications/:id/lire`

```bash
curl -X PUT \
  -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3001/api/notifications/1/lire"
```

## 📊 Statistiques

### 1. Statistiques des produits

**GET** `/api/produits/statistiques`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3001/api/produits/statistiques"
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "statistiques": {
      "total": 25,
      "enAttente": 5,
      "valides": 18,
      "rejetes": 1,
      "expires": 1,
      "vip": 7
    }
  }
}
```

## 🧪 Données de Test

### Utilisateurs créés par le seeder

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| `fatousha@gmail.com` | `toufa` | ADMINISTRATEUR |
| `amadou.diop@fotoljay.sn` | `password123` | MODERATEUR |
| `fatou.fall@fotoljay.sn` | `password123` | MODERATEUR |
| `moussa.ndiaye@fotoljay.sn` | `password123` | UTILISATEUR |

### Exemples de produits pour tests

```json
{
  "nom": "Samsung Galaxy S24 Ultra",
  "description": "Smartphone Samsung en excellent état, utilisé 3 mois seulement.",
  "prix": 750000,
  "localisation": "Médina, Dakar"
}
```

```json
{
  "nom": "MacBook Pro M3",
  "description": "Ordinateur portable Apple, 14 pouces, 16GB RAM, 512GB SSD.",
  "prix": 1200000,
  "localisation": "Grand Yoff"
}
```

```json
{
  "nom": "Nike Air Max 270",
  "description": "Baskets Nike neuves, taille 42. Couleur noir et blanc.",
  "prix": 85000,
  "localisation": "Parcelles Assainies"
}
```

## 🚨 Codes d'Erreur

| Code | Status | Description |
|------|--------|-------------|
| `INVALID_CREDENTIALS` | 401 | Email ou mot de passe incorrect |
| `TOKEN_INVALIDE` | 401 | Token JWT invalide ou expiré |
| `ACCES_REFUSE` | 403 | Permissions insuffisantes |
| `UTILISATEUR_NON_TROUVE` | 404 | Utilisateur introuvable |
| `PRODUIT_NON_TROUVE` | 404 | Produit introuvable |
| `EMAIL_DEJA_UTILISE` | 409 | Email déjà utilisé |
| `IMAGE_REQUISE` | 400 | Photo obligatoire |
| `INVALID_SOURCE_TYPE` | 400 | Source de photo non autorisée |
| `NO_PHOTO_PROVIDED` | 400 | Aucune photo fournie |

## 🔒 Sécurité des Photos

### Contraintes de sécurité

- **Photos capturées uniquement** : Seules les photos prises avec l'appareil photo sont acceptées
- **Métadonnées obligatoires** : `sourceType: "camera_capture_only"`, `securityLevel: "authenticated_photos"`
- **Validation stricte** : Taille, format, origine des fichiers
- **Logging sécurisé** : Toutes les tentatives d'upload sont enregistrées

### Formats autorisés
- **Types MIME** : `image/jpeg`, `image/png`
- **Taille** : 5KB minimum, 2MB maximum
- **Nombre** : 1 photo principale + 4 supplémentaires max

## 🔧 Scripts Utiles

```bash
# Démarrer le serveur de développement
npm run dev

# Compiler TypeScript
npm run build

# Démarrer en production
npm start

# Réinitialiser la base de données avec des données de test
npm run prisma:reset

# Créer des données de test
npm run seed

# Générer le client Prisma
npm run prisma:generate

# Migrer la base de données
npm run prisma:migrate
```

## 📝 Logs

Les logs sont stockés dans le dossier `logs/` :
- `combined.log` : Tous les logs
- `error.log` : Erreurs uniquement

```bash
# Voir les logs en temps réel
tail -f logs/combined.log

# Voir les erreurs récentes
tail -20 logs/error.log
```

## 🌐 Endpoints Complets

### Authentification
- `POST /api/auth/inscription` - Créer un compte
- `POST /api/auth/connexion` - Se connecter
- `GET /api/auth/verifier-token` - Vérifier le token
- `POST /api/auth/deconnexion` - Se déconnecter

### Produits
- `GET /api/produits/publics` - Produits publics
- `GET /api/produits/vip` - Produits VIP
- `GET /api/produits/statistiques` - Statistiques
- `GET /api/produits/mes-produits` - Mes produits
- `POST /api/produits` - Créer un produit
- `GET /api/produits` - Tous les produits (modération)
- `GET /api/produits/:id` - Produit par ID
- `PUT /api/produits/:id` - Modifier un produit
- `DELETE /api/produits/:id` - Supprimer un produit
- `PUT /api/produits/:id/valider` - Valider (modération)
- `PUT /api/produits/:id/rejeter` - Rejeter (modération)

### Notifications
- `GET /api/notifications` - Mes notifications
- `PUT /api/notifications/:id/lire` - Marquer comme lue
- `POST /api/notifications` - Créer une notification (admin)

### Utilisateurs
- `GET /api/utilisateurs` - Liste des utilisateurs (admin)
- `GET /api/utilisateurs/:id` - Utilisateur par ID
- `PUT /api/utilisateurs/:id/role` - Changer le rôle (admin)

## 🎯 Tests Postman

Import cette collection Postman pour tester rapidement :

```json
{
  "info": {
    "name": "FotoLouJay API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:3001/api"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

---

## 📞 Support

Pour toute question ou problème :
- **Email** : support@fotoloujay.sn
- **GitHub** : [Issues](https://github.com/khoussngom/fotoloujay/issues)

---

*Développé avec ❤️ au Sénégal pour FotoLouJay* 🇸🇳