import { NavigationContainer } from "@react-navigation/native";
import { useContext } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";

import AuthProvider, { AuthContext } from "./context/AuthContext";
import ThemeProvider, { ThemeContext } from "./context/ThemeContext";
import AppDrawer from "./navigation/AppDrawer";
import LoginScreen from "./screens/LoginScreen";

function RootNavigator() {
  const { user, loading } = useContext(AuthContext);
  const { colors } = useContext(ThemeContext);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return user ? <AppDrawer /> : <LoginScreen />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
