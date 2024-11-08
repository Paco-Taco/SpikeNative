import React, { useState } from "react";
import { StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ColorPalette } from "@/constants/Colors";
import {
  Wizard,
  TextField,
  Button,
  Toast,
  View,
  Text,
} from "react-native-ui-lib";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { axiosInstanceSpikeCore } from "@/controllers/SpikeApiCore";
import axios, { isAxiosError } from "axios";
import { Roles } from "@/constants/Roles";

const UserRegister = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    role: Roles.user,
    city: "",
    number_int: "",
    cp: "",
    img: null as ImagePicker.ImagePickerAsset | null,
  });
  const [toastMessage, setToastMessage] = useState("");

  const handleInputChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
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

  const isFormComplete = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.phone &&
      formData.password &&
      formData.city &&
      formData.number_int &&
      formData.cp &&
      formData.img
    );
  };

  const handleSubmit = async () => {
    if (!isFormComplete()) {
      Alert.alert(
        "Error",
        "Por favor, completa todos los campos y selecciona una imagen."
      );
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "img" && formData.img) {
        data.append("img", {
          uri: formData.img.uri,
          name: "user_image.jpg",
          type: "image/jpeg",
        } as any);
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      await axiosInstanceSpikeCore.post("/createUser", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setToastMessage("Usuario registrado exitosamente.");
      setTimeout(() => setToastMessage(""), 2000);
    } catch (error) {
      Alert.alert("Error", "No se pudo completar el registro.");
      if (isAxiosError(error)) {
        console.error(
          error.response?.data !== undefined
            ? error.response.data.error
            : "Error desconocido"
        );
      }
    }
  };

  const goToPrevStep = () => {
    setActiveIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  };

  const goToNextStep = () => {
    if (activeIndex < 2) {
      setActiveIndex((prevIndex) => prevIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const renderCurrentStep = () => {
    switch (activeIndex) {
      case 0:
        return (
          <View
            flex
            padding-20
            centerH
            backgroundColor={ColorPalette.background}
            style={styles.stepContainer}
          >
            <View marginB-40 centerV centerH height={200}>
              <Text style={{ fontFamily: "Poppins" }} text30>
                ¡Hey there!
              </Text>
              <Text text30>Let's start</Text>
            </View>
            <View padding-20 style={{ width: "100%" }}>
              <TextField
                placeholder="Nombre"
                placeholderTextColor={ColorPalette.medium}
                value={formData.firstName}
                onChangeText={(value) => handleInputChange("firstName", value)}
                containerStyle={styles.textFieldContainer}
              />
              <TextField
                placeholder="Apellido"
                placeholderTextColor={ColorPalette.medium}
                value={formData.lastName}
                onChangeText={(value) => handleInputChange("lastName", value)}
                containerStyle={styles.textFieldContainer}
              />
              <TextField
                placeholder="Correo Electrónico"
                placeholderTextColor={ColorPalette.medium}
                value={formData.email}
                onChangeText={(value) => handleInputChange("email", value)}
                containerStyle={styles.textFieldContainer}
              />
              <TextField
                placeholder="Contraseña"
                placeholderTextColor={ColorPalette.medium}
                value={formData.password}
                onChangeText={(value) => handleInputChange("password", value)}
                secureTextEntry
                containerStyle={styles.textFieldContainer}
              />
            </View>
          </View>
        );
      case 1:
        return (
          <View style={styles.stepContainer}>
            <TextField
              placeholder="Teléfono"
              placeholderTextColor={ColorPalette.medium}
              value={formData.phone}
              onChangeText={(value) => handleInputChange("phone", value)}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextField
              placeholder="Ciudad"
              placeholderTextColor={ColorPalette.medium}
              value={formData.city}
              onChangeText={(value) => handleInputChange("city", value)}
              style={styles.input}
            />
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContainer}>
            <TextField
              placeholder="Número Interior"
              placeholderTextColor={ColorPalette.medium}
              value={formData.number_int}
              onChangeText={(value) => handleInputChange("number_int", value)}
              style={styles.input}
            />
            <TextField
              placeholder="Código Postal"
              placeholderTextColor={ColorPalette.medium}
              value={formData.cp}
              onChangeText={(value) => handleInputChange("cp", value)}
              style={styles.input}
            />
            <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
              <Text style={styles.imageButtonText}>Seleccionar Imagen</Text>
            </TouchableOpacity>
            {formData.img && (
              <Text style={styles.imageText}>Imagen seleccionada</Text>
            )}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/signUp")}
      >
        <MaterialCommunityIcons
          name="arrow-left"
          size={24}
          color={ColorPalette.medium}
        />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.wizardContainer}>
          <Wizard
            activeIndex={activeIndex}
            onActiveIndexChanged={setActiveIndex}
          >
            <Wizard.Step state={Wizard.States.ENABLED} label="Paso 1" />
            <Wizard.Step state={Wizard.States.ENABLED} label="Paso 2" />
            <Wizard.Step state={Wizard.States.ENABLED} label="Paso 3" />
          </Wizard>
          {renderCurrentStep()}
        </View>

        <View style={styles.navigationButtons}>
          {activeIndex > 0 && (
            <Button
              label="Anterior"
              onPress={goToPrevStep}
              style={styles.navButton}
            />
          )}
          {activeIndex < 2 ? (
            <Button
              label="Siguiente"
              onPress={goToNextStep}
              style={styles.navButton}
            />
          ) : (
            <Button
              label="Finalizar"
              onPress={handleSubmit}
              style={styles.navButton}
            />
          )}
        </View>
      </ScrollView>
      {toastMessage && (
        <Toast visible position="bottom" message={toastMessage} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorPalette.background,
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
    paddingHorizontal: 20,
    marginTop: 20,
  },
  wizardComponent: {
    backgroundColor: ColorPalette.background,
    borderBottomWidth: 0,
  },
  stepContainer: {
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  input: {
    marginBottom: 15,
    backgroundColor: ColorPalette.background,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: ColorPalette.medium,
  },
  textFieldContainer: {
    width: "100%",
    marginBottom: 15,
    backgroundColor: ColorPalette.background,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: ColorPalette.medium,
  },
  navButton: {
    marginVertical: 5,
    backgroundColor: ColorPalette.medium,
    paddingVertical: 12,
    borderRadius: 8,
  },
  navButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  imageButton: {
    backgroundColor: ColorPalette.medium,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
  },
  imageButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  imageText: {
    color: ColorPalette.lightGrey,
    fontSize: 14,
    marginTop: 10,
  },
});

export default UserRegister;
