import React from "react";
import { View, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { Text } from 'react-native-ui-lib'
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ColorPalette } from "@/constants/Colors";

const SignUp = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Botón de regreso al login */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push("/login")}>
        <MaterialCommunityIcons name="arrow-left" size={24} color={ColorPalette.medium} />
        <Text style={styles.backText}>Back to Login</Text>
      </TouchableOpacity>
      
      {/* Contenido de la pantalla de registro */}
      <Text style={styles.title}>Sign Up</Text>
      
      {/* Botones de selección de tipo de usuario */}
      <View style={styles.buttonContainer}>
      <TouchableOpacity
      style={styles.userButton}
      onPress={() => router.push("/userRegister")}
    >
      <Text style={styles.buttonText}>Usuario de Mascota</Text>
    </TouchableOpacity>
    
    <TouchableOpacity
      style={styles.vetButton}
      onPress={() => router.push("/vetRegister")}
    >
      <Text style={styles.buttonText}>Veterinaria</Text>
    </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: ColorPalette.graphitePalette,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 60,
    marginLeft: 5,
  },
  backText: {
    marginLeft: 5,
    fontSize: 16,
    color: ColorPalette.medium,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 60,
    color: ColorPalette.lightGrey,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  userButton: {
    backgroundColor: ColorPalette.bluePalette,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20,
    width: '80%',
    alignItems: "center",
  },
  vetButton: {
    backgroundColor: ColorPalette.medium,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '80%',
    alignItems: "center",
  },
  buttonText: {
    color: ColorPalette.lightGrey,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SignUp;
