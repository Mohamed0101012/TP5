import { useContext } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

export default function ProfileScreen() {
  const { user, logout } = useContext(AuthContext);
  const { colors } = useContext(ThemeContext);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      Alert.alert("Erreur", "Impossible de se déconnecter");
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
      color: colors.text,
      fontWeight: "bold",
    },
    info: {
      fontSize: 16,
      marginBottom: 10,
      color: colors.text,
    },
    email: {
      fontSize: 18,
      marginBottom: 30,
      color: colors.primary,
      fontWeight: "600",
    },
    buttonContainer: {
      marginTop: 20,
      width: "100%",
      maxWidth: 300,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil utilisateur</Text>
      <Text style={styles.info}>Email :</Text>
      <Text style={styles.email}>{user?.email || "Non disponible"}</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Se déconnecter"
          onPress={handleLogout}
          color={colors.primary}
        />
      </View>
    </View>
  );
}
