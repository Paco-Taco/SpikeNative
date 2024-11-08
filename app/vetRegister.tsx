import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ColorPalette } from "@/constants/Colors";
import { Wizard, Text, TextField, Button, Toast } from "react-native-ui-lib";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { axiosInstanceSpikeCore } from "@/controllers/SpikeApiCore";
import { useNavigation, useRoute } from '@react-navigation/native';

const VetGreeting = () => {
  const [activeIndex, setActiveIndex] = useState(0);
 // const route = useRoute();  
  const [formData, setFormData] = useState({
    veterinarieName: "",
    email: "",
    phone: "",
    password: "",
    street: "",
    number_int: "",
    locality: "",
    city: "",
    cologne: "",
    cp: "",
    rfc: "",
    category: "",
    horaInicio: "",
    horaFin: "",
    diasSemana: "",
    role: "VETERINARY_OWNER",
    img: null,
  });
  const [toastMessage, setToastMessage] = useState(null);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    console.log(formData);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setFormData({ ...formData, img: result.assets[0] });
    }
  };

  const handleSubmit = async () => {
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "img" && formData.img) {
        data.append("img", {
          uri: formData.img.uri,
          name: "vet_image.jpg",
          type: "image/jpeg",
        });
      } else if (key === "category") {
        data.append(key, formData[key]);
      } else {
        data.append(key, formData[key]);
      }
    });
  
    try {
      await axiosInstanceSpikeCore.post("/createVeterinary", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setToastMessage("Veterinario registrado exitosamente.");
      setTimeout(() => setToastMessage(null), 2000);
      // route.push('Login');  

    } catch (error) {
      console.error("Error al registrar veterinaria:", error.response?.data || error);
      Alert.alert("Error", "No se pudo completar el registro.");
    }
  };

  const goToPrevStep = () => setActiveIndex((prevIndex) => Math.max(prevIndex - 1, 0));

  const goToNextStep = () => {
    if (activeIndex < 2) {
      setActiveIndex((prevIndex) => prevIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const renderCurrentStep = () => {
    const stepComponents = [
      <>
        <TextField
          placeholder="Nombre de la Veterinaria"
          placeholderTextColor={ColorPalette.medium}
          value={formData.veterinarieName}
          onChangeText={(value) => handleInputChange("veterinarieName", value)}
          style={styles.input}
        />
        <TextField
          placeholder="Correo Electrónico"
          placeholderTextColor={ColorPalette.medium}
          value={formData.email}
          onChangeText={(value) => handleInputChange("email", value)}
          style={styles.input}
        />
        <TextField
          placeholder="Teléfono"
          placeholderTextColor={ColorPalette.medium}
          value={formData.phone}
          onChangeText={(value) => handleInputChange("phone", value)}
          keyboardType="numeric"
          style={styles.input}
        />
      </>,
      <>
        <TextField
          placeholder="Contraseña"
          placeholderTextColor={ColorPalette.medium}
          value={formData.password}
          onChangeText={(value) => handleInputChange("password", value)}
          secureTextEntry
          style={styles.input}
        />
        <TextField
          placeholder="Calle"
          placeholderTextColor={ColorPalette.medium}
          value={formData.street}
          onChangeText={(value) => handleInputChange("street", value)}
          style={styles.input}
        />
        <TextField
          placeholder="Número Interior"
          placeholderTextColor={ColorPalette.medium}
          value={formData.number_int}
          onChangeText={(value) => handleInputChange("number_int", value)}
          style={styles.input}
        />
        <TextField
          placeholder="Localidad"
          placeholderTextColor={ColorPalette.medium}
          value={formData.locality}
          onChangeText={(value) => handleInputChange("locality", value)}
          style={styles.input}
        />
        <TextField
          placeholder="Ciudad"
          placeholderTextColor={ColorPalette.medium}
          value={formData.city}
          onChangeText={(value) => handleInputChange("city", value)}
          style={styles.input}
        />
        <TextField
          placeholder="Colonia"
          placeholderTextColor={ColorPalette.medium}
          value={formData.cologne}
          onChangeText={(value) => handleInputChange("cologne", value)}
          style={styles.input}
        />
        <TextField
          placeholder="Código Postal"
          placeholderTextColor={ColorPalette.medium}
          value={formData.cp}
          onChangeText={(value) => handleInputChange("cp", value)}
          keyboardType="numeric"
          style={styles.input}
        />
      </>,
      <>
        <TextField
          placeholder="RFC"
          placeholderTextColor={ColorPalette.medium}
          value={formData.rfc}
          onChangeText={(value) => handleInputChange("rfc", value)}
          style={styles.input}
        />
        <TextField
          placeholder="Categoría"
          placeholderTextColor={ColorPalette.medium}
          value={formData.category}
          onChangeText={(value) => handleInputChange("category", value)}
          style={styles.input}
        />
        <TextField
          placeholder="Hora de Inicio"
          placeholderTextColor={ColorPalette.medium}
          value={formData.horaInicio}
          onChangeText={(value) => handleInputChange("horaInicio", value)}
          style={styles.input}
        />
        <TextField
          placeholder="Hora de Fin"
          placeholderTextColor={ColorPalette.medium}
          value={formData.horaFin}
          onChangeText={(value) => handleInputChange("horaFin", value)}
          style={styles.input}
        />
        <TextField
          placeholder="Días de la Semana"
          placeholderTextColor={ColorPalette.medium}
          value={formData.diasSemana}
          onChangeText={(value) => handleInputChange("diasSemana", value)}
          style={styles.input}
        />
        <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
          <Text style={styles.imageButtonText}>Seleccionar Imagen</Text>
        </TouchableOpacity>
        {formData.img && <Text style={styles.imageText}>Imagen seleccionada</Text>}
      </>
    ];

    return <View style={styles.stepContainer}>{stepComponents[activeIndex]}</View>;
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.push("/signUp")}>
        <MaterialCommunityIcons name="arrow-left" size={24} color={ColorPalette.medium} />
        <Text style={styles.backText}>Back to Login</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.wizardContainer}>
          <Wizard activeIndex={activeIndex} onActiveIndexChanged={setActiveIndex}>
            <Wizard.Step state={Wizard.States.ENABLED} label="Paso 1" />
            <Wizard.Step state={Wizard.States.ENABLED} label="Paso 2" />
            <Wizard.Step state={Wizard.States.ENABLED} label="Paso 3" />
          </Wizard>
          {renderCurrentStep()}
        </View>
        <View style={styles.navigationButtons}>
          {activeIndex > 0 && <Button label="Anterior" onPress={goToPrevStep} style={styles.navButton} />}
          <Button label={activeIndex < 2 ? "Siguiente" : "Finalizar"} onPress={goToNextStep} style={styles.navButton} />
        </View>
      </ScrollView>
      {toastMessage && <Toast visible position="bottom" message={toastMessage} />}
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
    marginTop: 40,
    marginLeft: 20,
  },
  backText: {
    marginLeft: 5,
    fontSize: 16,
    color: ColorPalette.medium,
  },
  wizardContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  stepContainer: {
    marginVertical: 20,
  },
  input: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: ColorPalette.medium,
    borderRadius: 5,
    padding: 10,
    color: ColorPalette.lightGrey,
  },
  navButton: {
    marginVertical: 10,
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  imageButton: {
    backgroundColor: ColorPalette.darkGrey,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  imageButtonText: {
    color: ColorPalette.lightGrey,
  },
  imageText: {
    marginTop: 10,
    color: ColorPalette.lightGrey,
  },
});

export default VetGreeting;
