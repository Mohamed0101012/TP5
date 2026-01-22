import { createDrawerNavigator } from "@react-navigation/drawer";
import AppStack from "./AppStack";
import ProfileScreen from "../screens/ProfileScreen";
import HomeScreen from "../screens/HomeScreen";
import NativeFeaturesScreen from "../screens/NativeFeaturesScreen";

const Drawer = createDrawerNavigator();

export default function AppDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Accueil" component={HomeScreen} />
      <Drawer.Screen name="Mes tâches" component={AppStack} />
      <Drawer.Screen name="Profil" component={ProfileScreen} />
      <Drawer.Screen name="Fonctionnalités natives" component={NativeFeaturesScreen} />
    </Drawer.Navigator>
  );
}
