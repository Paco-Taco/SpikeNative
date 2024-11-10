import React, { useState } from "react";
import { View, StyleSheet, Alert, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ColorPalette } from "@/constants/Colors";
import { Wizard, Text, TextField, Button, Toast } from "react-native-ui-lib";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Picker } from '@react-native-picker/picker';
import MultiSelect from 'react-native-multiple-select';
import { axiosInstanceSpikeCore } from "@/controllers/SpikeApiCore";
import { useNavigation, useRoute } from '@react-navigation/native';
import { VeterinaryService } from "@/services/vetServices";


const VetGreeting = () => {
  const [activeIndex, setActiveIndex] = useState(0);
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
    horaInicio: "",
    horaFin: "",
    diasSemana: [],
    role: "VETERINARY_OWNER",
    img: null,
  });
  const [toastMessage, setToastMessage] = useState(null);

  const handleInputChange = (name, value) => {
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

  const handleSubmit = async () => {
    try {
      const validDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      const filteredDays = formData.diasSemana.filter((day) => validDays.includes(day));

      if (filteredDays.length !== formData.diasSemana.length) {
        Alert.alert("Error", "Algunos días seleccionados no son válidos o están duplicados.");
        return;
      }

      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "img" && formData.img) {
          data.append("img", {
            uri: formData.img.uri,
            name: "vet_image.jpg",
            type: "image/jpeg",
          });
        } else if (key === "diasSemana") {
          filteredDays.forEach((day) => data.append("diasSemana[]", day));
        } else if (key === "category") {
          formData.category.forEach((cat) => data.append("category[]", cat));
        } else {
          data.append(key, formData[key]);
        }
      });

      const response = await VeterinaryService.createVeterinary(data);
      
      if (response.success) {
        setToastMessage("Veterinaria registrada exitosamente.");
        setTimeout(() => setToastMessage(null), 2000);
      } else {
        console.error("Error del servidor:", response);
        Alert.alert("Error", response.message);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      Alert.alert("Error", error.message || "No se pudo completar el registro.");
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
    const categories = ["NUTRITION", "RECREATION", "CARE"];
    const daysOfWeek = [
      { id: "Monday", name: "Monday" },
      { id: "Tuesday", name: "Tuesday" },
      { id: "Wednesday", name: "Wednesday" },
      { id: "Thursday", name: "Thursday" },
      { id: "Saturday", name: "Saturday" },
      { id: "Sunday", name: "Sunday" },
    ];

    const stepComponents = [
      <View key="step1">
        <TextField
          placeholder="Nombre de la Veterinaria"
          value={formData.veterinarieName}
          onChangeText={(value) => handleInputChange("veterinarieName", value)}
          style={styles.input}
        />
        <TextField
          placeholder="Correo Electrónico"
          value={formData.email}
          onChangeText={(value) => handleInputChange("email", value)}
          style={styles.input}
        />
        <TextField
          placeholder="Teléfono"
          value={formData.phone}
          onChangeText={(value) => handleInputChange("phone", value)}
          keyboardType="numeric"
          style={styles.input}
        />
      </View>,
      <View key="step2">
        <TextField
          placeholder="Contraseña"
          value={formData.password}
          onChangeText={(value) => handleInputChange("password", value)}
          secureTextEntry
          style={styles.input}
        />
        <TextField
          placeholder="Calle"
          value={formData.street}
          onChangeText={(value) => handleInputChange("street", value)}
          style={styles.input}
        />
        <TextField
          placeholder="Número Interior"
          value={formData.number_int}
          onChangeText={(value) => handleInputChange("number_int", value)}
          style={styles.input}
        />
        <TextField
          placeholder="Localidad"
          value={formData.locality}
          onChangeText={(value) => handleInputChange("locality", value)}
          style={styles.input}
        />
        <TextField
          placeholder="Ciudad"
          value={formData.city}
          onChangeText={(value) => handleInputChange("city", value)}
          style={styles.input}
        />
        <TextField
          placeholder="Colonia"
          value={formData.cologne}
          onChangeText={(value) => handleInputChange("cologne", value)}
          style={styles.input}
        />
        <TextField
          placeholder="Código Postal"
          value={formData.cp}
          onChangeText={(value) => handleInputChange("cp", value)}
          keyboardType="numeric"
          style={styles.input}
        />
      </View>,
      <View key="step3">
        <TextField
          placeholder="RFC"
          value={formData.rfc}
          onChangeText={(value) => handleInputChange("rfc", value)}
          style={styles.input}
        />

        <MultiSelect
          items={categories.map((cat) => ({ id: cat, name: cat }))}
          uniqueKey="id"
          onSelectedItemsChange={(selectedItems) => handleInputChange("category", selectedItems)}
          selectedItems={formData.category}
          selectText="Selecciona las categorías"
          searchInputPlaceholderText="Buscar categorías..."
          styleDropdownMenu={styles.multiSelectDropdown}
        />

        <MultiSelect
          items={daysOfWeek}
          uniqueKey="id"
          onSelectedItemsChange={(selectedItems) => handleInputChange("diasSemana", selectedItems)}
          selectedItems={formData.diasSemana}
          selectText="Selecciona los días de la semana"
          searchInputPlaceholderText="Buscar días..."
          styleDropdownMenu={styles.multiSelectDropdown}
        />

        <TextField
          placeholder="Hora de Inicio"
          value={formData.horaInicio}
          onChangeText={(value) => handleInputChange("horaInicio", value)}
          style={styles.input}
        />
        <TextField
          placeholder="Hora de Fin"
          value={formData.horaFin}
          onChangeText={(value) => handleInputChange("horaFin", value)}
          style={styles.input}
        />
        <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
          <Text style={styles.imageButtonText}>Seleccionar Imagen</Text>
        </TouchableOpacity>
        {formData.img && <Text style={styles.imageText}>Imagen seleccionada</Text>}
      </View>,
    ];

    return <View style={styles.stepContainer}>{stepComponents[activeIndex]}</View>;
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.push("/signUp")}>
        <MaterialCommunityIcons name="arrow-left" size={24} color={ColorPalette.medium} />
        <Text style={styles.backText}>Back to Login</Text>
      </TouchableOpacity>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
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
      </KeyboardAvoidingView>

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
    paddingHorizontal: 20,
    marginTop: 20,
  },
  stepContainer: {
    marginTop: 30,
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
  imageButton: {
    backgroundColor: ColorPalette.medium,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  imageButtonText: {
    color: "#fff",
  },
  imageText: {
    marginTop: 10,
    color: ColorPalette.medium,
  },
  multiSelectDropdown: {
    marginBottom: 20,
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
});

export default VetGreeting;