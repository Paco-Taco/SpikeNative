import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLoginStore } from "@/stores/login.store";
import { useRouter } from "expo-router";
import axios from "axios";
import * as ImagePicker from 'expo-image-picker';
import { VeterinaryService } from "@/services/vetServices";

const VetProfile = () => {
  const { dataLogin } = useLoginStore((state) => state);
  const { user, token } = dataLogin || {};
  const [loading, setLoading] = useState<boolean>(true); 
  const userId = user?.id;
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
    diasSemana: user?.diasSemana || [], 
    horaInicio: user?.horaInicio || "", 
    horaFin: user?.horaFin || "", 
    img: user?.img || "",
    img_public_id: user?.img_public_id || null,
  });

  const categories = ["CARE", "RECREATION", "NUTRITION"];
  const dias = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Elimina el fetch de datos del perfil
  useEffect(() => {
    if (userId && token) {
      console.log("User ID:", userId);
    }
  }, [userId, token]);

  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setFormData({
        ...formData,
        img: uri,
      });
    }
  };

  const handleCategoryChange = (category) => {
    const updatedCategories = formData.category.includes(category)
      ? formData.category.filter((cat) => cat !== category)
      : [...formData.category, category];
    
    handleChange("category", updatedCategories);
  };

  const handleSubmit = async () => {
    const validDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const filteredDays = Array.isArray(formData.diasSemana) 
      ? formData.diasSemana.filter(day => validDays.includes(day)) 
      : [];

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === "img" && formData.img) {
        data.append("img", {
          uri: formData.img,
          name: "vet_image.jpg",
          type: "image/jpeg",
        });
      } else if (key === "diasSemana") {
        filteredDays.forEach((day) => data.append("diasSemana[]", day));
      } else if (key === "horaInicio") {
        data.append("horaInicio", formData.horaInicio);
      } else if (key === "horaFin") {
        data.append("horaFin", formData.horaFin);
      } else if (key === "category") {
        formData.category.forEach(cat => data.append("category[]", cat)); 
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      const response = await VeterinaryService.updateVeterinary(userId, data, token);
      useLoginStore.getState().updateProfile({
        veterinarieName: formData.veterinarieName,
        img: formData.img,
      });
      Alert.alert("Éxito", response.message);
      router.push("../");
    } catch (error) {
      console.error("Error al actualizar perfil:", error.response?.data || error);
      Alert.alert("Error", `No se pudo actualizar el perfil. Detalles: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleCancel = () => {
    router.push("../");
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
              {/* Campos de texto */}
              <TextInput
                style={styles.input}
                placeholder="Nombre del veterinario"
                value={formData.veterinarieName}
                onChangeText={(text) => handleChange("veterinarieName", text)}
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
              {/* Campos para horaInicio y horaFin */}
              <TextInput
                style={styles.input}
                placeholder="Hora de inicio"
                value={formData.horaInicio}
                onChangeText={(text) => handleChange("horaInicio", text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Hora de fin"
                value={formData.horaFin}
                onChangeText={(text) => handleChange("horaFin", text)}
              />

              {/* Menú para elegir días de la semana */}
              <Text style={styles.label}>Días disponibles:</Text>
              <View style={styles.categoryContainer}>
                {dias.map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.categoryButton,
                      formData.diasSemana.includes(day) && styles.categorySelected,
                    ]}
                    onPress={() => {
                      const updatedDays = formData.diasSemana.includes(day)
                        ? formData.diasSemana.filter((d) => d !== day)
                        : [...formData.diasSemana, day];
                      handleChange("diasSemana", updatedDays);
                    }}
                  >
                    <Text style={styles.categoryText}>{day}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Menú para elegir categorías */}
              <Text style={styles.label}>Categorías de servicio:</Text>
              <View style={styles.categoryContainer}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryButton,
                      formData.category.includes(category) && styles.categorySelected,
                    ]}
                    onPress={() => handleCategoryChange(category)}
                  >
                    <Text style={styles.categoryText}>{category}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Botones de guardar y cancelar */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 20,
    flex: 1,
    alignItems: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
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
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginVertical: 5,
    color: '#333',
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  categoryButton: {
    padding: 10,
    margin: 5,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  categorySelected: {
    backgroundColor: '#00f',
  },
  categoryText: {
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  cancelButton: {
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
  },
  saveButton: {
    padding: 10,
    backgroundColor: '#00f',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default VetProfile;
