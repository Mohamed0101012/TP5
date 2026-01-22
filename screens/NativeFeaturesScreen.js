import React, { useState, useContext, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import * as Contacts from "expo-contacts";
import * as Notifications from "expo-notifications";
import { ThemeContext } from "../context/ThemeContext";

// Configuration des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function NativeFeaturesScreen() {
  const { colors } = useContext(ThemeContext);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [photo, setPhoto] = useState(null);
  const cameraRef = useRef(null);
  const [location, setLocation] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [locationPermission, setLocationPermission] = useState(null);
  const [contactsPermission, setContactsPermission] = useState(null);

  // Fonction pour la caméra
  const handleCamera = async () => {
    if (!cameraPermission) {
      const { status } = await requestCameraPermission();
      if (status !== "granted") {
        Alert.alert("Permission refusée", "L'accès à la caméra est nécessaire");
        return;
      }
    }
    setShowCamera(true);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setPhoto(photo.uri);
        setShowCamera(false);
      } catch (error) {
        console.error("Erreur lors de la prise de photo:", error);
        Alert.alert("Erreur", "Impossible de prendre la photo");
      }
    }
  };

  // Fonction pour la localisation
  const handleLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status);

      if (status !== "granted") {
        Alert.alert("Permission refusée", "L'accès à la localisation est nécessaire");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération de la localisation:", error);
      Alert.alert("Erreur", "Impossible de récupérer la localisation");
    }
  };

  // Fonction pour les contacts
  const handleContacts = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      setContactsPermission(status);

      if (status !== "granted") {
        Alert.alert("Permission refusée", "L'accès aux contacts est nécessaire");
        return;
      }

      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
      });

      setContacts(data.slice(0, 10)); // Limiter à 10 contacts
    } catch (error) {
      console.error("Erreur lors de la récupération des contacts:", error);
      Alert.alert("Erreur", "Impossible de récupérer les contacts");
    }
  };

  // Fonction pour les notifications
  const handleNotification = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission refusée", "L'accès aux notifications est nécessaire");
        return;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Notification de test",
          body: "Ceci est une notification locale !",
          sound: true,
        },
        trigger: null, // Immédiat
      });

      Alert.alert("Succès", "Notification envoyée !");
    } catch (error) {
      console.error("Erreur lors de l'envoi de la notification:", error);
      Alert.alert("Erreur", "Impossible d'envoyer la notification");
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
      padding: 20,
    },
    section: {
      marginBottom: 30,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 15,
    },
    button: {
      backgroundColor: colors.primary,
      padding: 15,
      borderRadius: 8,
      marginBottom: 10,
    },
    buttonText: {
      color: "#ffffff",
      textAlign: "center",
      fontWeight: "bold",
      fontSize: 16,
    },
    info: {
      backgroundColor: colors.card,
      padding: 15,
      borderRadius: 8,
      marginTop: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    infoText: {
      color: colors.text,
      fontSize: 14,
    },
    photo: {
      width: "100%",
      height: 200,
      borderRadius: 8,
      marginTop: 10,
    },
    contactItem: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    contactName: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "600",
    },
    contactPhone: {
      color: colors.text + "80",
      fontSize: 14,
      marginTop: 5,
    },
    cameraContainer: {
      flex: 1,
    },
    camera: {
      flex: 1,
    },
    cameraButton: {
      position: "absolute",
      bottom: 30,
      alignSelf: "center",
      backgroundColor: colors.primary,
      padding: 20,
      borderRadius: 50,
    },
    closeButton: {
      position: "absolute",
      top: 50,
      right: 20,
      backgroundColor: "#FF3B30",
      padding: 15,
      borderRadius: 50,
    },
  });

  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          ref={cameraRef}
        />
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setShowCamera(false)}
        >
          <Text style={{ color: "#ffffff", fontWeight: "bold" }}>✕</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cameraButton}
          onPress={takePicture}
        >
          <Text style={{ color: "#ffffff", fontSize: 24 }}>📷</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollView}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📷 Caméra</Text>
        <TouchableOpacity style={styles.button} onPress={handleCamera}>
          <Text style={styles.buttonText}>Ouvrir la caméra</Text>
        </TouchableOpacity>
        {photo && (
          <Image source={{ uri: photo }} style={styles.photo} />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📍 Localisation</Text>
        <TouchableOpacity style={styles.button} onPress={handleLocation}>
          <Text style={styles.buttonText}>Récupérer ma position</Text>
        </TouchableOpacity>
        {location && (
          <View style={styles.info}>
            <Text style={styles.infoText}>
              Latitude: {location.latitude.toFixed(6)}
            </Text>
            <Text style={styles.infoText}>
              Longitude: {location.longitude.toFixed(6)}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👥 Contacts</Text>
        <TouchableOpacity style={styles.button} onPress={handleContacts}>
          <Text style={styles.buttonText}>Charger les contacts</Text>
        </TouchableOpacity>
        {contacts.length > 0 && (
          <View style={styles.info}>
            {contacts.map((contact, index) => (
              <View key={index} style={styles.contactItem}>
                <Text style={styles.contactName}>
                  {contact.name || "Sans nom"}
                </Text>
                {contact.phoneNumbers && contact.phoneNumbers.length > 0 && (
                  <Text style={styles.contactPhone}>
                    {contact.phoneNumbers[0].number}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔔 Notifications</Text>
        <TouchableOpacity style={styles.button} onPress={handleNotification}>
          <Text style={styles.buttonText}>Envoyer une notification</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
