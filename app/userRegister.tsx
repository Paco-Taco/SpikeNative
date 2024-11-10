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
  Image,
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

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password: string): boolean => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const isValidPhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const isPart1Complete = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      isValidEmail(formData.email) &&
      isValidPassword(formData.password)
    );
  };

  const isPart2Complete = () => {
    return (
      isValidPhoneNumber(formData.phone) &&
      formData.city &&
      formData.number_int &&
      formData.cp
    );
  };

  const isFormComplete = () => {
    return isPart1Complete() && isPart2Complete() && formData.img;
  };

  const handleSubmit = async () => {
    if (!isFormComplete()) {
      Alert.alert(
        "Error",
        "Por favor, completa todos los campos antes de continuar."
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
            <View paddingT-20 style={{ width: "100%" }}>
              <TextField
                placeholder="Name"
                placeholderTextColor={ColorPalette.medium}
                value={formData.firstName}
                onChangeText={(value) => handleInputChange("firstName", value)}
                containerStyle={styles.textFieldContainer}
              />
              <TextField
                placeholder="Second Name"
                placeholderTextColor={ColorPalette.medium}
                value={formData.lastName}
                onChangeText={(value) => handleInputChange("lastName", value)}
                containerStyle={styles.textFieldContainer}
              />
              <TextField
                placeholder="Email"
                placeholderTextColor={ColorPalette.medium}
                value={formData.email}
                onChangeText={(value) => handleInputChange("email", value)}
                containerStyle={styles.textFieldContainer}
                enableErrors
                validateOnChange
                validate={["required", (value) => isValidEmail(value || "")]}
                validationMessage={["Field is required", "Email is invalid"]}
                retainValidationSpace={false}
              />
              <TextField
                placeholder="Password"
                placeholderTextColor={ColorPalette.medium}
                value={formData.password}
                onChangeText={(value) => handleInputChange("password", value)}
                secureTextEntry
                enableErrors
                validateOnChange
                validate={["required", (value) => isValidPassword(value || "")]}
                validationMessage={[
                  "Field is required",
                  "Password must contain at least 8 characters, one number and one special character",
                ]}
                retainValidationSpace={false}
                containerStyle={styles.textFieldContainer}
              />
            </View>
          </View>
        );
      case 1:
        return (
          <View
            flex
            paddingH-20
            centerH
            backgroundColor={ColorPalette.background}
            style={styles.stepContainer}
          >
            <View marginV-20 centerV padding-20 centerH height={250}>
              <Text style={{ textAlign: "center" }} text30 bold>
                Where are you from?
              </Text>
              <LottieView
                source={require("@/assets/lottie/LocationHand.json")}
                autoPlay
                loop
                style={{ width: 150, height: 150, flex: 1 }}
              />
            </View>
            <View paddingT-20 style={{ width: "100%" }}>
              <TextField
                placeholder="Phone number"
                placeholderTextColor={ColorPalette.medium}
                value={formData.phone}
                onChangeText={(value) => handleInputChange("phone", value)}
                keyboardType="numeric"
                containerStyle={styles.textFieldContainer}
                enableErrors
                validateOnChange
                validate={["required", (value) => isValidPhoneNumber(value)]}
                validationMessage={[
                  "Field is required",
                  "Phone number is invalid",
                ]}
                retainValidationSpace={false}
              />
              <TextField
                placeholder="City"
                placeholderTextColor={ColorPalette.medium}
                value={formData.city}
                onChangeText={(value) => handleInputChange("city", value)}
                containerStyle={styles.textFieldContainer}
              />
              <TextField
                placeholder="Street Number"
                placeholderTextColor={ColorPalette.medium}
                value={formData.number_int}
                onChangeText={(value) => handleInputChange("number_int", value)}
                containerStyle={styles.textFieldContainer}
              />
              <TextField
                placeholder="Postal Code"
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
          <View
            flex
            padding-20
            centerH
            backgroundColor={ColorPalette.background}
            style={styles.stepContainer}
          >
            <View marginV-20 centerV padding-20 centerH height={200}>
              <Text style={{ textAlign: "center" }} text30 bold>
                Picture time!
              </Text>
              <LottieView
                source={require("@/assets/lottie/CameraShot.json")}
                autoPlay
                loop
                style={{ width: 200, height: 200, flex: 1 }}
              />
            </View>
            <TouchableOpacity
              onPress={pickImage}
              // style={{ marginBottom: 10, alignItems: "center" }}
              style={{
                width: "100%",
                borderWidth: 1,
                borderRadius: 15,
                padding: 20,
                borderStyle: "dashed",
                borderColor: ColorPalette.medium,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: ColorPalette.bluePalette, margin: 10 }}>
                Select picture
              </Text>
              {formData.img && (
                <Image
                  source={{ uri: formData.img.uri }}
                  style={{
                    width: 200,
                    height: 200,
                    marginBottom: 10,
                    alignSelf: "center",
                  }}
                />
              )}
            </TouchableOpacity>
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
            containerStyle={{
              shadowOpacity: 0,
              borderBottomWidth: 0,
            }}
          >
            <Wizard.Step
              state={
                activeIndex === 0
                  ? Wizard.States.ENABLED
                  : isPart1Complete()
                  ? Wizard.States.COMPLETED
                  : Wizard.States.DISABLED
              }
              label="Personal details"
            />
            <Wizard.Step
              state={
                activeIndex === 1
                  ? Wizard.States.ENABLED
                  : isPart1Complete() && isPart2Complete()
                  ? Wizard.States.COMPLETED
                  : Wizard.States.DISABLED
              }
              label="Location"
            />
            <Wizard.Step
              state={
                activeIndex === 2
                  ? Wizard.States.ENABLED
                  : isFormComplete()
                  ? Wizard.States.COMPLETED
                  : Wizard.States.DISABLED
              }
              label="Picture"
            />
          </Wizard>

          {renderCurrentStep()}
        </View>

        <View style={styles.navigationButtons}>
          {activeIndex == 0 && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.push("/signUp")}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          )}
          {activeIndex > 0 && (
            <Button
              label="Back"
              onPress={goToPrevStep}
              backgroundColor="transparent"
              color={ColorPalette.medium}
              style={styles.backButton}
            />
          )}
          {activeIndex < 2 ? (
            <Button
              label="Siguiente"
              onPress={goToNextStep}
              style={styles.nextButton}
              backgroundColor={ColorPalette.bluePalette}
              disabled={
                (activeIndex == 0 && !isPart1Complete()) ||
                (activeIndex == 1 && !isPart2Complete())
              }
            />
          ) : (
            <Button
              label="Finalizar"
              onPress={handleSubmit}
              backgroundColor={ColorPalette.bluePalette}
              style={styles.nextButton}
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
  cancelButton: {
    width: "20%",
    justifyContent: "center",
  },
  cancelText: {
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
  nextButton: {
    borderRadius: 8,
  },
  backButton: {
    borderRadius: 8,
    borderColor: ColorPalette.medium,
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
