import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLoginStore } from "@/stores/login.store";
import { useRouter } from "expo-router";
import axios from "axios";
import * as ImagePicker from 'expo-image-picker';
import { axiosInstanceSpikeCore } from "@/controllers/SpikeApiCore";

const EditPetOwnerProfile = () => {
  const { dataLogin } = useLoginStore((state) => state);
  const { user, token } = dataLogin || {};
  const [loading, setLoading] = useState(true); 
  const userId = user?.id;
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(true);
  const [formData, setFormData] = useState({
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    locality: "",
    postalCode: "",
    img: "",
    img_public_id: null,
  });

  useEffect(() => {
    const fetchOwnerProfile = async () => {
        try {
          setLoading(true);
          const response = await axiosInstanceSpikeCore.get(`/updateowner/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = response.data; // Ensure that the data is correctly parsed
      
          setFormData({
            ownerName: data.ownerName,
            email: data.email,
            phone: data.phone,
            address: data.address,
            city: data.city,
            locality: data.locality,
            postalCode: data.postalCode,
            img: data.img || "",
            img_public_id: data.img_public_id || null,
          });
        } catch (error) {
          console.error("Error fetching profile data:", error.response?.data || error.message);
          Alert.alert("Error", "No se pudo cargar el perfil.");
        } finally {
          setLoading(false);
        }
      };      

    if (userId && token) {
      fetchOwnerProfile();
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

  const handleSubmit = async () => {
    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === "img" && formData.img) {
        data.append("img", {
          uri: formData.img,
          name: "owner_image.jpg",
          type: "image/jpeg",  // Ensure the MIME type is correct
        });
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      const response = await axiosInstanceSpikeCore.post(`/updateowner/${userId}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      useLoginStore.getState().updateProfile({
        ownerName: formData.ownerName,
        img: formData.img,
      });
      Alert.alert("Success", response.data.message);
      router.push("../");
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error);
      Alert.alert("Error", `Unable to update profile. Details: ${error.response?.data?.message || error.message}`);
    }
};

  const handleCancel = () => {
    router.push("../");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        {loading ? (
          <Text>Cargando perfil...</Text>
        ) : (
          <View style={styles.container}>
            <TouchableOpacity onPress={handleImagePick}>
              <Image source={formData.img ? { uri: formData.img } : require("@/assets/images/catbox.png")} style={styles.profileImage} />
            </TouchableOpacity>

            <Text style={styles.profileName}>{formData.ownerName}</Text>

            {isEditing && (
              <View style={styles.formContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Teléfono"
                  value={formData.phone}
                  onChangeText={(text) => handleChange("phone", text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Dirección"
                  value={formData.address}
                  onChangeText={(text) => handleChange("address", text)}
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
                  placeholder="Código Postal"
                  value={formData.postalCode}
                  onChangeText={(text) => handleChange("postalCode", text)}
                />
              </View>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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

export default EditPetOwnerProfile;
