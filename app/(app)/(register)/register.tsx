import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  LogBox,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRegisterViewModel } from "../../../hooks/useRegisterViewModel"; // Aquí importamos el hook

const RegisterScreen = () => {
  const navigation = useNavigation();
  const { setRole } = useRegisterViewModel(); 
  const [selectedButton, setSelectedButton] = useState("");

  const handleButtonPress = (role, buttonType) => {
    setSelectedButton(buttonType);
    setRole(role);
    console.log("Role actualizado: " + role); // Verifica que el rol esté correcto

    if (role === "PET_OWNER") {
      navigation.navigate("UserRegister"); 
    } else if (role === "VETERINARY_OWNER") {
      console.log("Navegando a VetDetailsScreen");  // Agregar un log aquí
      navigation.navigate("VetDetailsScreen");
    }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Before you start, which one are you?</Text>
      <View style={styles.buttonContainer}>
        {/* Botón "User" */}
        <TouchableOpacity
          onPress={() => handleButtonPress("PET_OWNER", "User")} 
          style={[ 
            styles.button,
            selectedButton === "User" ? styles.selectedButton : null,
          ]}
        >
          <Image
            source={require("../../../assets/images/user5.png")} 
            style={styles.buttonImage}
          />
          <Text style={styles.buttonText}>User</Text>
        </TouchableOpacity>

        {/* Botón "Veterinary" */}
        <TouchableOpacity
          onPress={() => handleButtonPress("VETERINARY_OWNER", "Veterinary")} // Llamada a la función para manejar el rol y navegación
          style={[
            styles.button,
            selectedButton === "Veterinary" ? styles.selectedButton : null,
          ]}
        >
          <Image
            source={require("../../../assets/images/hospital2.png")} // Asegúrate de tener la imagen
            style={styles.buttonImage}
          />
          <Text style={styles.buttonText}>Veterinary</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#243748", 
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 32,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 150,
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: "transparent",
    padding: 10,
  },
  selectedButton: {
    backgroundColor: "#2274A5",
  },
  buttonImage: {
    width: "100%",
    height: 100, 
    resizeMode: "contain",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    marginTop: 8,
  },
});

export default RegisterScreen;
