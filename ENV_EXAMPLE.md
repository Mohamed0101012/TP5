# Configuration des variables d'environnement

Créez un fichier `.env` à la racine du projet avec le contenu suivant :

```env
# Configuration Firebase
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id

# Configuration Google OAuth (Web uniquement)
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_client_id.apps.googleusercontent.com
```

## Comment obtenir ces valeurs

1. **Firebase Console** : https://console.firebase.google.com
2. Sélectionnez votre projet
3. Allez dans **Paramètres du projet** (icône d'engrenage)
4. Dans **Vos applications**, sélectionnez votre application web ou créez-en une
5. Copiez les valeurs de configuration

## Google OAuth Client ID

1. Dans Firebase Console → **Authentication** → **Sign-in method**
2. Activez **Google**
3. Dans la section **Web SDK configuration**, copiez le **Client ID Web**
