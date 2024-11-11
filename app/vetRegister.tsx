import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { ColorPalette } from "@/constants/Colors";
import {
  Wizard,
  Text,
  Button,
  Picker,
  View,
  Incubator,
  Dialog,
  Image,
  LoaderScreen,
} from "react-native-ui-lib";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { VeterinaryService } from "@/services/vetServices";
import StepLayout from "@/components/layout/StepLayout";
import TipContainer from "@/components/wizard/TipContainer";
import { Fonts } from "@/constants/Fonts";
import LottieView from "lottie-react-native";
import FormContainer from "@/components/wizard/FormContainer";
import SimpleTextField from "@/components/wizard/SimpleTextField";
import ValidationTextField from "@/components/wizard/ValidationTextField";
import { isValidEmail } from "@/utils/isValidEmail";
import { isValidPhoneNumber } from "@/utils/isValidPhoneNumber";
import { isValidPassword } from "@/utils/isValidPassword";
import { PickerMultiValue } from "react-native-ui-lib/src/components/picker/types";
import MultiPicker from "@/components/wizard/MultiPicker";
import HourPicker from "@/components/wizard/HourPicker";
import PictureInput from "@/components/wizard/PictureInput";
import { AxiosError, isAxiosError } from "axios";
import ErrorDialog from "@/components/wizard/ErrorDialog";

const VetRegister = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
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
    category: [],
    horaInicio: "0:00",
    horaFin: "0:00",
    diasSemana: [],
    role: "VETERINARY_OWNER",
    img: null as ImagePicker.ImagePickerAsset | null,
  });
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const handleInputChange = (
    name: string,
    value: string | number | PickerMultiValue | undefined
  ) => {
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

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const parseTimeToDate = (time: string) => {
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date;
  };

  const isPart1Complete = () => {
    return (
      formData.veterinarieName &&
      isValidEmail(formData.email) &&
      isValidPhoneNumber(formData.phone) &&
      isValidPassword(formData.password) &&
      formData.rfc
    );
  };

  const isPart2Complete = () => {
    return (
      formData.street &&
      formData.number_int &&
      formData.locality &&
      formData.city &&
      formData.cologne &&
      formData.cp
    );
  };

  const isFormComplete = () => {
    return (
      isPart1Complete() &&
      isPart2Complete() &&
      formData.category.length > 0 &&
      formData.diasSemana.length > 0 &&
      formData.img
    );
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "img" && formData.img) {
          data.append("img", {
            uri: formData.img.uri,
            name: "vet_image.jpg",
            type: "image/jpeg",
          } as any);
        } else if (key === "diasSemana") {
          formData.diasSemana.forEach((dia) =>
            data.append("diasSemana[]", dia)
          );
        } else if (key === "category") {
          formData.category.forEach((cat) => data.append("category[]", cat));
        } else {
          data.append(key, formData[key]);
        }
      });

      const response = await VeterinaryService.createVeterinary(data);
      console.log(response);
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error.response?.data);
      } else {
        console.log(error);
      }
      setDialogMessage("Please, verify all fields are correct");
      setIsDialogVisible(true);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2500);
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
    const categories = [
      { id: 1, name: "NUTRITION" },
      { id: 2, name: "RECREATION" },
      { id: 3, name: "CARE" },
    ];
    const daysOfWeek = [
      { id: "Monday", name: "Monday" },
      { id: "Tuesday", name: "Tuesday" },
      { id: "Wednesday", name: "Wednesday" },
      { id: "Thursday", name: "Thursday" },
      { id: "Friday", name: "Friday" },
      { id: "Saturday", name: "Saturday" },
      { id: "Sunday", name: "Sunday" },
    ];

    const stepComponents = [
      <StepLayout key="step1">
        <TipContainer height={200}>
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
        </TipContainer>
        <FormContainer>
          <SimpleTextField
            placeholder="Veterinary name"
            value={formData.veterinarieName}
            onChangeText={(value) =>
              handleInputChange("veterinarieName", value)
            }
          />
          <ValidationTextField
            placeholder="Email"
            value={formData.email}
            onChangeText={(value) => handleInputChange("email", value)}
            validate={["required", (value) => isValidEmail(value || "")]}
            validationMessage={["Field is required", "Email is invalid"]}
          />
          <ValidationTextField
            placeholder="Password"
            value={formData.password}
            onChangeText={(value) => handleInputChange("password", value)}
            secureTextEntry
            validate={["required", (value) => isValidPassword(value || "")]}
            validationMessage={[
              "Field is required",
              "Password must contain at least 8 characters, one number and one special character",
            ]}
          />
          <ValidationTextField
            placeholder="RFC"
            value={formData.rfc}
            onChangeText={(value) => handleInputChange("rfc", value)}
            validate={["required", (value) => (value?.length || 0) === 12]}
            validationMessage={[
              "Field is required",
              "RFC must be 12 characters",
            ]}
          />
          <ValidationTextField
            placeholder="Phone number"
            value={formData.phone}
            onChangeText={(value) => handleInputChange("phone", value)}
            keyboardType="phone-pad"
            validate={["required", (value) => isValidPhoneNumber(value || "")]}
            validationMessage={["Field is required", "Phone number is invalid"]}
          />
        </FormContainer>
      </StepLayout>,
      <StepLayout key="step2">
        <TipContainer height={200}>
          <Text
            style={{
              textAlign: "center",
              fontFamily: Fonts.PoppinsBold,
              fontSize: 30,
            }}
          >
            Where are you located?
          </Text>
          <LottieView
            source={require("@/assets/lottie/Location.json")}
            autoPlay
            loop
            style={{ width: 125, height: 125 }}
          />
        </TipContainer>
        <FormContainer>
          <SimpleTextField
            placeholder="Street name"
            value={formData.street}
            onChangeText={(value) => handleInputChange("street", value)}
          />
          <SimpleTextField
            placeholder="Street Number"
            value={formData.number_int}
            onChangeText={(value) => handleInputChange("number_int", value)}
          />
          <SimpleTextField
            placeholder="Locality"
            value={formData.locality}
            onChangeText={(value) => handleInputChange("locality", value)}
          />
          <SimpleTextField
            placeholder="City"
            value={formData.city}
            onChangeText={(value) => handleInputChange("city", value)}
          />
          <SimpleTextField
            placeholder="Neighborhood"
            value={formData.cologne}
            onChangeText={(value) => handleInputChange("cologne", value)}
          />
          <SimpleTextField
            placeholder="Postal Code"
            value={formData.cp}
            onChangeText={(value) => handleInputChange("cp", value)}
          />
        </FormContainer>
      </StepLayout>,
      <StepLayout key="step3">
        <TipContainer height={200}>
          <Text
            style={{
              textAlign: "center",
              fontFamily: Fonts.PoppinsBold,
              fontSize: 30,
            }}
          >
            Almost done!
          </Text>
          <LottieView
            source={require("@/assets/lottie/Checklist.json")}
            autoPlay
            loop
            style={{ width: 125, height: 125 }}
          />
        </TipContainer>
        <FormContainer>
          <MultiPicker
            title="Categories"
            placeholder="Select categories"
            value={formData.category}
            onChange={(selectedItems) =>
              handleInputChange("category", selectedItems)
            }
          >
            {categories.map((cat) => (
              <Picker.Item key={cat.id} label={cat.name} value={cat.name} />
            ))}
          </MultiPicker>

          <MultiPicker
            title="Work days"
            placeholder="Select work days"
            value={formData.diasSemana}
            onChange={(selectedItems) =>
              handleInputChange("diasSemana", selectedItems)
            }
          >
            {daysOfWeek.map((day) => (
              <Picker.Item key={day.id} label={day.name} value={day.id} />
            ))}
          </MultiPicker>

          <HourPicker
            label="Opening time"
            value={parseTimeToDate(formData.horaInicio)}
            onChange={(date) =>
              handleInputChange("horaInicio", formatTime(date))
            }
            dateTimeFormatter={(date) => formatTime(date)}
          />

          <HourPicker
            label="Closing time"
            value={parseTimeToDate(formData.horaFin)}
            onChange={(date) => handleInputChange("horaFin", formatTime(date))}
            dateTimeFormatter={(date) => formatTime(date)}
          />

          <PictureInput image={formData.img} onPress={pickImage} />
        </FormContainer>
      </StepLayout>,
    ];

    return (
      <View style={styles.stepContainer}>{stepComponents[activeIndex]}</View>
    );
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
              onPress={() => router.navigate("/signUp")}
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
              label="Next"
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
              label="Done"
              onPress={handleSubmit}
              backgroundColor={ColorPalette.bluePalette}
              style={styles.nextButton}
              disabled={!isFormComplete()}
            />
          )}
        </View>
      </ScrollView>
      {loading ? (
        <LoaderScreen
          message="Loading..."
          overlay
          backgroundColor="white"
          messageStyle={{ fontFamily: Fonts.PoppinsRegular }}
          customLoader={
            <LottieView
              source={require("@/assets/lottie/LoadingCat.json")}
              autoPlay
              loop
              style={{ width: 125, height: 125 }}
            />
          }
        />
      ) : !loading && isDialogVisible ? (
        <ErrorDialog
          visible={isDialogVisible}
          dialogMessage={dialogMessage}
          onDismiss={() => setIsDialogVisible(false)}
        />
      ) : null}
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

export default VetRegister;
