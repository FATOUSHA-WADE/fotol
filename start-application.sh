#!/bin/bash

# Script de démarrage pour l'application FotoLouJay
echo "🚀 Démarrage de l'application FotoLouJay..."

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier si npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier si Docker est installé (pour la base de données)
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker n'est pas installé. Assurez-vous que MySQL est démarré manuellement."
fi

echo "📦 Installation des dépendances backend..."
cd backend
npm install

echo "📦 Installation des dépendances frontend..."
cd ../frontend/enset-app
npm install

echo "🔧 Génération du client Prisma..."
cd ../backend
npx prisma generate

echo "🗄️  Démarrage de la base de données avec Docker..."
# Démarrer MySQL avec Docker si disponible
if command -v docker &> /dev/null; then
    docker run --name fotoloujay-db -e MYSQL_ROOT_PASSWORD=rootpassword -e MYSQL_DATABASE=fotoloujay -e MYSQL_USER=fotoloujay -e MYSQL_PASSWORD=password -p 3306:3306 -d mysql:8.0
    echo "⏳ Attente de la disponibilité de la base de données..."
    sleep 10
fi

echo "🗄️  Application des migrations..."
npx prisma migrate deploy

echo "🌱 Exécution du seeder..."
npm run seed

echo "🚀 Démarrage du serveur backend..."
# Démarrer le serveur en arrière-plan
npm run dev &
BACKEND_PID=$!

echo "⏳ Attente du démarrage du backend..."
sleep 5

echo "🎨 Démarrage du serveur frontend..."
cd ../frontend/enset-app
npm start &
FRONTEND_PID=$!

echo "✅ Application démarrée avec succès!"
echo "🔗 Frontend: http://localhost:4200"
echo "🔗 Backend: http://localhost:3000"
echo "📊 Base de données: localhost:3306"
echo ""
echo "Pour arrêter l'application:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "📱 Vous pouvez maintenant accéder à l'application dans votre navigateur!"

# Attendre que l'utilisateur appuie sur Ctrl+C
trap "echo '🛑 Arrêt de l application...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT
wait