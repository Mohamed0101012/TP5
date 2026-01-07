import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DetailsScreen({ route }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📄 Détails</Text>
      <Text>ID reçu : {route.params?.id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
  },
});
