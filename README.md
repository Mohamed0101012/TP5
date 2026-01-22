# MonApp - Application React Native avec Firebase

Application React Native développée avec Expo intégrant Firebase (authentification et Firestore), SQLite, Zustand, et les fonctionnalités natives.

## 📋 Fonctionnalités

- ✅ Authentification Firebase (Email/Mot de passe et Google)
- ✅ Gestion des tâches avec Firestore
- ✅ Synchronisation Firestore ↔ SQLite ↔ Zustand
- ✅ Thème clair/sombre avec sauvegarde
- ✅ Fonctionnalités natives :
  - 📷 Caméra
  - 📍 Géolocalisation
  - 👥 Contacts
  - 🔔 Notifications locales

## 🚀 Installation

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configuration Firebase

1. Créer un projet sur [Firebase Console](https://console.firebase.google.com)
2. Désactiver Google Analytics lors de la création
3. Activer l'authentification :
   - Email / Mot de passe
   - Google (pour le web)
4. Créer une base de données Firestore en mode test
5. Créer un fichier `.env` à la racine du projet avec vos clés Firebase :

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id

EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_client_id.apps.googleusercontent.com
```

### 3. Configuration Google OAuth (Web uniquement)

1. Dans Firebase Console → Authentication → Sign-in method → Google
2. Activer Google et configurer le projet
3. Récupérer le Client ID Web et l'ajouter dans `.env`

### 4. Structure Firestore

Les tâches sont stockées dans la collection :
```
users/{uid}/todos
```

## 🏃 Lancer l'application

```bash
# Démarrer l'application
npm start

# Lancer sur web (nécessaire pour Google OAuth)
npm run web

# Lancer sur Android
npm run android

# Lancer sur iOS
npm run ios
```

## 📱 Architecture

### Services

- `services/firebase.js` : Initialisation Firebase
- `services/firestore.js` : Opérations Firestore (CRUD)
- `services/sqlite.js` : Base de données locale SQLite

### Contextes

- `context/AuthContext.js` : Gestion de l'authentification
- `context/ThemeContext.js` : Gestion du thème clair/sombre

### Store

- `store/todosStore.js` : Store Zustand pour les tâches

### Synchronisation

Le flux de synchronisation suit ce schéma :
1. **Firestore** → Source de vérité (cloud)
2. **SQLite** → Cache local pour accès hors ligne
3. **Zustand** → État de l'application (UI)

## 🎨 Écrans

- **LoginScreen** : Authentification (Email/Password et Google)
- **HomeScreen** : Liste des tâches avec modal d'ajout, changement de thème, déconnexion
- **TodoListScreen** : Liste des tâches avec navigation vers les détails
- **ProfileScreen** : Informations de l'utilisateur connecté
- **NativeFeaturesScreen** : Fonctionnalités natives (caméra, localisation, contacts, notifications)

## 🔐 Sécurité

- Les clés Firebase sont stockées dans `.env` (non versionné)
- Le fichier `.env` est ignoré par Git (voir `.gitignore`)

## 📝 Notes importantes

- L'authentification Google fonctionne **uniquement sur le web** (`npx expo start --web`)
- Les permissions natives (caméra, localisation, contacts) doivent être accordées par l'utilisateur
- Le thème est sauvegardé avec AsyncStorage et chargé au démarrage

## 🛠️ Technologies utilisées

- React Native / Expo
- Firebase (Auth + Firestore)
- SQLite (expo-sqlite)
- Zustand (gestion d'état)
- React Navigation (Drawer + Stack)
- Expo Camera, Location, Contacts, Notifications

## 📄 Licence

Ce projet est un travail pratique éducatif.
