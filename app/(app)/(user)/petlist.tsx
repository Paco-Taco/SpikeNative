import React, { useState, useEffect } from "react";
import { StyleSheet, TextInput, Alert, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLoginStore } from "@/stores/login.store";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { axiosInstanceSpikeCore } from "@/controllers/SpikeApiCore";
import LoadingCat from "@/components/shared/LoadingCat";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Colors,
  Button,
} from "react-native-ui-lib";
import AbsoluteBackArrow from "@/components/shared/AbsoluteBackArrow";
import { Fonts } from "@/constants/Fonts";
import { ColorPalette } from "@/constants/Colors";
import PetsNotFoundScreen from "@/components/user/PetsNotFoundScreen";

const PetListAndEdit = () => {
  const { dataLogin } = useLoginStore((state) => state);
  const { user, token } = dataLogin || {};
  const userId = user?.id;
  const router = useRouter();

  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  // Obtener lista de mascotas
  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        const response = await axiosInstanceSpikeCore.get(
          `/getpets/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPets(response.data);
      } catch (error) {
        console.error(
          "Error fetching pets:",
          error.response?.data || error.message
        );
        Alert.alert("Error", "No se pudo cargar la lista de mascotas.");
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) {
      fetchPets();
    }
  }, [userId, token]);

  // Manejo de cambios en el formulario
  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Manejo de selección de imagen
  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setFormData((prevData) => ({
        ...prevData,
        img: uri,
      }));
    }
  };

  // Manejo de actualización de mascota
  const handleSubmit = async () => {
    const data = new FormData();

    // Iterar sobre los datos del formulario y agregar al FormData
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== undefined && formData[key] !== null) {
        if (key === "img" && formData.img) {
          data.append("img", {
            uri: formData.img,
            name: "pet_image.jpg",
            type: "image/jpeg",
          });
        } else {
          data.append(key, formData[key]);
        }
      }
    });

    console.log("Datos a actualizar:", formData); // Verificar datos en la consola

    try {
      const response = await axiosInstanceSpikeCore.post(
        `/updatepet/${selectedPet.id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Actualizar la lista de mascotas localmente después de la actualización
      setPets((prevPets) => {
        return prevPets.map((pet) =>
          pet.id === selectedPet.id ? { ...pet, ...formData } : pet
        );
      });

      // Verificar respuesta del servidor
      console.log("Respuesta del servidor:", response.data);
      Alert.alert("Éxito", response.data.message);
      setSelectedPet(null); // Volver a la lista de mascotas
    } catch (error) {
      console.error(
        "Error actualizando la mascota:",
        error.response?.data || error
      );
      Alert.alert(
        "Error",
        "No se pudo actualizar la mascota. Intente nuevamente."
      );
    }
  };

  // Cancelar edición y volver a la lista de mascotas
  const handleCancel = () => {
    setSelectedPet(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AbsoluteBackArrow color={Colors.grey30} />
      {loading ? (
        <LoadingCat />
      ) : pets.length === 0 ? (
        <PetsNotFoundScreen />
      ) : selectedPet ? (
        // Vista de edición de mascota
        <View style={styles.container}>
          <TouchableOpacity onPress={handleImagePick}>
            <Image
              source={
                formData.img
                  ? { uri: formData.img }
                  : require("@/assets/images/catbox.png")
              }
              style={styles.profileImage}
            />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Nombre de la mascota"
            value={formData.name}
            onChangeText={(text) => handleChange("name", text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Peso"
            value={String(formData.weight)}
            onChangeText={(text) => handleChange("weight", text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Altura"
            value={formData.height}
            onChangeText={(text) => handleChange("height", text)}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // Lista de mascotas con FlatList
        <FlatList
          data={pets}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.petItem}
              onPress={() => {
                setSelectedPet(item);
                setFormData({
                  name: item.name,
                  weight: String(item.weight),
                  height: item.height,
                  img: item.img || "",
                });
              }}
            >
              <Image
                source={
                  item.img
                    ? { uri: item.img }
                    : require("@/assets/images/catbox.png")
                }
                style={styles.petImage}
              />
              <Text style={styles.petName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { padding: 20, alignItems: "center" },
  profileImage: { width: 120, height: 120, borderRadius: 60, marginBottom: 20 },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  cancelButton: { padding: 10, backgroundColor: "#ccc", borderRadius: 5 },
  saveButton: { padding: 10, backgroundColor: "#00f", borderRadius: 5 },
  buttonText: { color: "#fff" },
  petItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  petImage: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  petName: { fontSize: 18 },
});

export default PetListAndEdit;
