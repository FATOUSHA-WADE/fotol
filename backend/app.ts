import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import winston from 'winston';

// Import des routes
import { routesUtilisateur } from './routes/utilisateur.routes';
import { routesProduit } from './routes/produit.routes';
import { routesNotification } from './routes/notification.routes';
import { routesAuth } from './routes/auth.routes';

// Configuration des variables d'environnement
dotenv.config();

// Configuration du logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'fotoloujay-backend' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Initialisation de Prisma
export const prisma = new PrismaClient();

// Création de l'application Express
const app = express();
const PORT = process.env.PORT || 3000;

// Configuration des middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Autoriser explicitement les préflight CORS
app.options('*', cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de logging des requêtes
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Routes de l'API
app.use('/api/auth', routesAuth);
app.use('/api/utilisateurs', routesUtilisateur);
app.use('/api/produits', routesProduit);
app.use('/api/notifications', routesNotification);

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'FotoLouJay Backend est en cours d\'exécution',
    timestamp: new Date().toISOString()
  });
});

// Middleware de gestion des erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
    path: req.originalUrl
  });
});

// Middleware de gestion des erreurs globales
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Erreur non gérée:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Erreur interne du serveur',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Démarrage du serveur
const demarrerServeur = async () => {
  try {
    // Test de la connexion à la base de données
    await prisma.$connect();
    logger.info('Connexion à la base de données établie');

    app.listen(PORT, () => {
      logger.info(`🚀 Serveur FotoLouJay démarré sur le port ${PORT}`);
      logger.info(`📡 API disponible sur http://localhost:${PORT}/api`);
    });
  } catch (error) {
    logger.error('Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

// Gestion de l'arrêt propre du serveur
process.on('SIGINT', async () => {
  logger.info('Arrêt du serveur en cours...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Arrêt du serveur en cours...');
  await prisma.$disconnect();
  process.exit(0);
});

// Démarrage de l'application
demarrerServeur();

export default app;
