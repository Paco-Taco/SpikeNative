import React, { useState } from "react";
import { StyleSheet, ScrollView, Alert } from "react-native";
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
  TouchableOpacity,
} from "react-native-ui-lib";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { axiosInstanceSpikeCore } from "@/controllers/SpikeApiCore";
import axios, { isAxiosError } from "axios";
import { Roles } from "@/constants/Roles";
import { Fonts } from "@/constants/Fonts";
import LottieView from "lottie-react-native";

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
            <View marginV-20 centerV padding-20 centerH height={200}>
              <Text style={{ fontFamily: Fonts.PoppinsBold }} text30>
                ¡Hey there!
              </Text>
              <Text style={{ fontFamily: Fonts.PoppinsLight }} text30>
                Let's start
              </Text>
              <LottieView
                source={require("@/assets/lottie/BrownDogWalking.json")}
                autoPlay
                loop
                style={{ width: 125, height: 125 }}
              />
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
          <View
            flex
            padding-20
            centerH
            backgroundColor={ColorPalette.background}
            style={styles.stepContainer}
          >
            <View marginV-20 centerV padding-20 centerH height={300}>
              <Text style={{ textAlign: "center" }} text30 bold>
                Where are you from?
              </Text>
              <LottieView
                source={require("@/assets/lottie/LocationHand.json")}
                autoPlay
                loop
                style={{ width: 200, height: 200,flex: 1 }}
              />
            </View>
            <View paddingT-20 style={{ width: "100%" }}>
              <TextField
                placeholder="Teléfono"
                placeholderTextColor={ColorPalette.medium}
                value={formData.phone}
                onChangeText={(value) => handleInputChange("phone", value)}
                keyboardType="numeric"
                containerStyle={styles.textFieldContainer}
              />
              <TextField
                placeholder="Ciudad"
                placeholderTextColor={ColorPalette.medium}
                value={formData.city}
                onChangeText={(value) => handleInputChange("city", value)}
                containerStyle={styles.textFieldContainer}
              />
              <TextField
                placeholder="Número Interior"
                placeholderTextColor={ColorPalette.medium}
                value={formData.number_int}
                onChangeText={(value) => handleInputChange("number_int", value)}
                containerStyle={styles.textFieldContainer}
              />
              <TextField
                placeholder="Código Postal"
                placeholderTextColor={ColorPalette.medium}
                value={formData.cp}
                onChangeText={(value) => handleInputChange("cp", value)}
                containerStyle={styles.textFieldContainer}
              />
            </View>
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContainer}>
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
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.wizardContainer}>
          <Wizard
            activeIndex={activeIndex}
            onActiveIndexChanged={setActiveIndex}
          >
            <Wizard.Step
              state={Wizard.States.ENABLED}
              label="Personal details"
            />
            <Wizard.Step state={Wizard.States.ENABLED} label="Location" />
            <Wizard.Step state={Wizard.States.ENABLED} label="Picture" />
          </Wizard>
          {renderCurrentStep()}
        </View>

        <View style={styles.navigationButtons}>
          {activeIndex == 0 && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.push("/signUp")}
            >
              <Text style={styles.backText}>Cancel</Text>
            </TouchableOpacity>
          )}
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
    width: "20%",
    justifyContent: "center",
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
    backgroundColor: ColorPalette.medium,
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
    marginBottom: 60,
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
