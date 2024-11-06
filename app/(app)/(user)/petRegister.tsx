import {
  View,
  Text,
  Alert,
  Button,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLoginStore } from "@/stores/login.store";
import * as ImagePicker from "expo-image-picker";
import axios, { isAxiosError } from "axios";
import { axiosInstanceSpikeCore } from "@/controllers/SpikeApiCore";
import { SafeAreaView } from "react-native-safe-area-context";
import KeyBoardAvoidWrapper from "@/components/KeyBoardAvoidWrapper";
import { TextField } from "react-native-ui-lib";
import { ColorPalette } from "@/constants/Colors";

const PetRegister = () => {
  const { dataLogin } = useLoginStore((state) => state);
  const idOwner = dataLogin?.user.id;
  const [formData, setFormData] = useState({
    id_owner: idOwner,
    name: "",
    gender: "",
    age: "",
    weight: "",
    height: "",
    animal: "",
  });
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: name === "age" ? parseInt(value) : value,
    });
  };

  const isFormComplete = () => {
    return (
      formData.name &&
      formData.gender &&
      formData.age &&
      formData.weight &&
      formData.height &&
      formData.animal &&
      image
    );
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!isFormComplete()) {
      Alert.alert(
        "Error",
        "Por favor, completa todos los campos y selecciona una imagen."
      );
      return;
    }

    setLoading(true); // Muestra el loader

    const data = new FormData();
    data.append(
      "ownerId",
      formData.id_owner !== undefined ? formData.id_owner.toString() : "no_id"
    );
    data.append("name", formData.name);
    data.append("gender", formData.gender);
    data.append("age", formData.age.toString());
    data.append("weight", formData.weight);
    data.append("height", formData.height);
    data.append("animal", formData.animal);
    data.append("img", {
      uri: image !== null ? image.uri : "no_uri",
      name: "mascota.jpg",
      type: "image/jpeg",
    } as any);

    try {
      const response = await axiosInstanceSpikeCore.post("/createpet", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      Alert.alert("Éxito", "Mascota creada exitosamente.");
    } catch (error) {
      if (isAxiosError(error)) {
        console.error("AxiosError: ", error.response?.data);
      }
      Alert.alert("Error", "Hubo un problema al crear la mascota.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <KeyBoardAvoidWrapper
      scrollEnabled={true}
      contentContainerStyle={{ padding: 30 }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20 }}>
          Registro de Mascota
        </Text>

        <TextField
          onChangeText={(value: string) => handleInputChange("name", value)}
          value={formData.name}
          placeholder='Nombre de Mascota: '
          floatingPlaceholder
          floatOnFocus
          containerStyle={styles.textField}
        />

        <Text>Género (0 = masculino, 1 = femenino):</Text>
        <TextField
          style={styles.textField}
          onChangeText={(value: string) => handleInputChange("gender", value)}
          value={formData.gender}
          keyboardType="numeric"
        />

        <Text>Edad:</Text>
        <TextField
          style={styles.textField}
          onChangeText={(value: string) => handleInputChange("age", value)}
          value={formData.age}
          keyboardType="numeric"
        />

        <Text>Peso (kg):</Text>
        <TextField
          style={styles.textField}
          onChangeText={(value: string) => handleInputChange("weight", value)}
          value={formData.weight}
          keyboardType="numeric"
        />

        <Text>Tamaño (1 = pequeño, 2 = mediano, 3 = grande, 4 = gigante):</Text>
        <TextField
          style={styles.textField}
          onChangeText={(value: string) => handleInputChange("height", value)}
          value={formData.height}
          keyboardType="numeric"
        />

        <Text>
          Tipo de Animal (1 = Perro, 2 = Gato, 3 = Conejo, 4 = Aves, 5 =
          Reptiles, 6 = Otros):
        </Text>
        <TextField
          style={styles.textField}
          onChangeText={(value: string) => handleInputChange("animal", value)}
          value={formData.animal}
          keyboardType="numeric"
        />

        <TouchableOpacity
          onPress={pickImage}
          style={{ marginBottom: 10, alignItems: "center" }}
        >
          <Text style={{ color: "blue" }}>Seleccionar Imagen</Text>
        </TouchableOpacity>

        {image && (
          <Image
            source={{ uri: image.uri }}
            style={{
              width: 200,
              height: 200,
              marginBottom: 10,
              alignSelf: "center",
            }}
          />
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Button title="Crear Mascota" onPress={handleSubmit} />
        )}
      </View>
    </KeyBoardAvoidWrapper>
  );
};

const styles = StyleSheet.create({
  textField: {
    marginBottom: 10,
    borderBottomWidth: 1
  },
});

export default PetRegister;
