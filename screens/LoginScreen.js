import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  TouchableOpacity,
} from "react-native";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";

// Nécessaire pour expo-auth-session
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { colors } = useContext(ThemeContext);

  // Configuration Google OAuth (Web uniquement)
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: undefined,
    androidClientId: undefined,
  });

  // Gérer la réponse Google
  React.useEffect(() => {
    if (response?.type === "success" && response.authentication?.idToken) {
      handleGoogleSignIn(response.authentication.idToken);
    }
  }, [response]);

  const handleGoogleSignIn = async (idToken) => {
    try {
      setLoading(true);
      const credential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(auth, credential);
    } catch (error) {
      console.error("Erreur lors de la connexion Google:", error);
      Alert.alert("Erreur", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    try {
      setLoading(true);
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        Alert.alert("Succès", "Compte créé avec succès !");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      console.error("Erreur d'authentification:", error);
      Alert.alert("Erreur", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    if (Platform.OS === "web") {
      promptAsync();
    } else {
      Alert.alert(
        "Non disponible",
        "L'authentification Google n'est disponible que sur le web. Utilisez 'npx expo start --web'"
      );
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      padding: 20,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 28,
      marginBottom: 20,
      textAlign: "center",
      color: colors.text,
      fontWeight: "bold",
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 15,
      padding: 12,
      borderRadius: 8,
      backgroundColor: colors.card,
      color: colors.text,
    },
    buttonContainer: {
      marginTop: 10,
      marginBottom: 15,
    },
    toggleText: {
      textAlign: "center",
      marginTop: 15,
      color: colors.text,
    },
    toggleButton: {
      color: colors.primary,
      fontWeight: "bold",
    },
    googleButton: {
      backgroundColor: colors.secondary,
      padding: 12,
      borderRadius: 8,
      marginTop: 10,
    },
    googleButtonText: {
      color: "#ffffff",
      textAlign: "center",
      fontWeight: "bold",
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isSignUp ? "Créer un compte" : "Connexion"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={colors.text + "80"}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        placeholderTextColor={colors.text + "80"}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <>
          <View style={styles.buttonContainer}>
            <Button
              title={isSignUp ? "Créer un compte" : "Se connecter"}
              onPress={handleEmailAuth}
              color={colors.primary}
            />
          </View>

          {Platform.OS === "web" && (
            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleAuth}
              disabled={!request}
            >
              <Text style={styles.googleButtonText}>
                Se connecter avec Google
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
            <Text style={styles.toggleText}>
              {isSignUp
                ? "Déjà un compte ? "
                : "Pas encore de compte ? "}
              <Text style={styles.toggleButton}>
                {isSignUp ? "Se connecter" : "S'inscrire"}
              </Text>
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
