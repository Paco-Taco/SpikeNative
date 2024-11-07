import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ColorPalette } from "@/constants/Colors";

const VetGreeting = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Botón de regreso al login */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push("/signUp")}>
        <MaterialCommunityIcons name="arrow-left" size={24} color={ColorPalette.medium} />
        <Text style={styles.backText}>Back to Login</Text>
      </TouchableOpacity>
      
      {/* Mensaje de saludo */}
      <View style={styles.content}>
        <Text style={styles.text}>Hola Veterinaria</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorPalette.graphitePalette,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40, // Incrementa este valor para bajar el botón más
    marginLeft: 20, // Asegura que el botón no esté pegado al borde izquierdo
  },
  backText: {
    marginLeft: 5,
    fontSize: 16,
    color: ColorPalette.medium,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    color: ColorPalette.lightGrey,
    fontWeight: "bold",
  },
});

export default VetGreeting;