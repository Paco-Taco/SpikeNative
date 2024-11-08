import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ColorPalette } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useLoginStore } from "@/stores/login.store";
import { useRouter } from "expo-router";
import axios from "axios";
import * as ImagePicker from 'expo-image-picker';  
import { UpdateService  } from "@/services/updateService";

const VetProfile = () => {
  const { dataLogin } = useLoginStore((state) => state);
  const { user, token } = dataLogin || {};
  const userId = user?.id;  // ID del usuario logueado
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(true); 

  const [formData, setFormData] = useState({
    veterinarieName: user?.veterinarieName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    street: user?.street || "",
    city: user?.city || "",
    locality: user?.locality || "",
    cologne: user?.cologne || "",
    number_int: user?.number_int || "",
    cp: user?.cp || "",
    rfc: user?.rfc || "",
    category: user?.category || [],
    img: user?.img || "",
    img_public_id: user?.img_public_id || null,
  });

  // Función para manejar cambios en el formulario
  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    console.log("Resultado de selección de imagen:", result); 
  
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setFormData({
        ...formData,
        img: uri,  
      });
    } else {
      console.log("Selección de imagen cancelada");
    }
  };
  

  // Función para actualizar el perfil
  const handleUpdateProfile = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('veterinarieName', formData.veterinarieName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('street', formData.street);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('locality', formData.locality);
      formDataToSend.append('cologne', formData.cologne);
      formDataToSend.append('number_int', formData.number_int);
      formDataToSend.append('cp', formData.cp);
      formDataToSend.append('rfc', formData.rfc);
      formDataToSend.append('category', JSON.stringify(formData.category));
  
      if (formData.img) {
        const imageFile = {
          uri: formData.img,
          type: 'image/jpeg',
          name: 'profile.jpg',
        };
        formDataToSend.append('img', imageFile);
      }
  
 

      const response = await UpdateService.updateVetProfile(userId, formDataToSend, token);
      useLoginStore.getState().updateProfile({
        veterinarieName: formData.veterinarieName,
        img: formData.img,
      });
      Alert.alert("Éxito", response.message);
      router.push("../")
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      Alert.alert("Error", "No se pudo actualizar el perfil. Intenta nuevamente.");
    }
  };
  
  const handleCancel = () => {
    router.push("../")
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={styles.container}>
          {/* Imagen de perfil */}
          <TouchableOpacity onPress={handleImagePick}>
            <Image source={formData.img ? { uri: formData.img } : require("@/assets/images/catbox.png")} style={styles.profileImage} />
          </TouchableOpacity>

          <Text style={styles.profileName}>{formData.veterinarieName}</Text>

          {isEditing && (
            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="Nombre del veterinario"
                value={formData.veterinarieName}
                onChangeText={(text) => handleChange("veterinarieName", text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={formData.email}
                onChangeText={(text) => handleChange("email", text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Teléfono"
                value={formData.phone}
                onChangeText={(text) => handleChange("phone", text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Calle"
                value={formData.street}
                onChangeText={(text) => handleChange("street", text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Ciudad"
                value={formData.city}
                onChangeText={(text) => handleChange("city", text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Localidad"
                value={formData.locality}
                onChangeText={(text) => handleChange("locality", text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Colonia"
                value={formData.cologne}
                onChangeText={(text) => handleChange("cologne", text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Número interior"
                value={formData.number_int}
                onChangeText={(text) => handleChange("number_int", text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Código Postal"
                value={formData.cp}
                onChangeText={(text) => handleChange("cp", text)}
              />
              <TextInput
                style={styles.input}
                placeholder="RFC"
                value={formData.rfc}
                onChangeText={(text) => handleChange("rfc", text)}
              />
            </View>
          )}

          {/* Botones para confirmar o cancelar */}
          {isEditing && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleUpdateProfile} style={styles.saveButton}>
                <Text style={styles.buttonText}>Guardar cambios</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ColorPalette.lightGrey,
  },
  container: {
    padding: 20,
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: ColorPalette.darkGrayPalette,
    marginBottom: 20,
  },
  formContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    marginVertical: 5,
    backgroundColor: ColorPalette.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: ColorPalette.border,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    backgroundColor: ColorPalette.lightGrey,
    padding: 10,
    borderRadius: 8,
    width: "45%",
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: ColorPalette.primary,
    padding: 10,
    borderRadius: 8,
    width: "45%",
    alignItems: "center",
  },
  buttonText: {
    color: ColorPalette.white,
    fontSize: 16,
  },
});

export default VetProfile;
