import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/app/context/AuthContext";
import { useLoginStore } from "@/stores/login.store";
import * as ImagePicker from "expo-image-picker";

const PetOwnerProfile = () => {
  const { dataLogin } = useLoginStore((state) => state);
  const { user } = dataLogin || {};
  const { onLogout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // const handleImagePick = async () => {
  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     quality: 1,
  //   });
  //   if (!result.canceled) {
  //     setFormData({ ...formData, img: result.uri });
  //   }
  // };

  // const handleSaveChanges = async () => {
  //   setLoading(true);
  //   try {
  //     const formDataToSubmit = new FormData();
  //     formDataToSubmit.append("veterinarieName", formData.veterinarieName);
  //     if (formData.img && formData.img !== user.img) {
  //       const uriParts = formData.img.split(".");
  //       const fileType = uriParts[uriParts.length - 1];
  //       formDataToSubmit.append("img", {
  //         uri: formData.img,
  //         name: `profile.${fileType}`,
  //         type: `image/${fileType}`,
  //       });
  //     }

  //     const response = await axiosInstanceSpikeCore.get(`/users/${userId}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //         "Authorization": `Bearer ${user.token}`, // Cambia si usas otro método de autenticación
  //       },
  //       body: formDataToSubmit,
  //     });

  //     const data = await response.json();
  //     if (response.ok) {
  //       Alert.alert("Perfil actualizado", "Tus cambios se han guardado correctamente.");
  //     } else {
  //       Alert.alert("Error", data.error || "No se pudo actualizar el perfil");
  //     }
  //   } catch (error) {
  //     Alert.alert("Error", "Ocurrió un error al actualizar el perfil.");
  //     console.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={styles.container}>
          <Image
            source={
              user?.img
                ? { uri: user?.img }
                : require("@/assets/images/catbox.png")
            }
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>{user?.firstName}</Text>

          <TouchableOpacity
            onPress={() => router.push("/editPetOwnerProfile")}
            style={styles.optionButton}
          >
            <Text style={styles.optionText}>Editar perfil</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#000" />
          </TouchableOpacity>

          {/* Otras opciones */}
          <TouchableOpacity
            // onPress={() => router.push("/appointmentHistory")}
            style={styles.optionButton}
          >
            <Text style={styles.optionText}>Mis citas</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/petlist")}
            style={styles.optionButton}
          >
            <Text style={styles.optionText}>Mis mascotas</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onLogout} style={styles.optionButton}>
            <Text style={styles.optionText}>Cerrar sesión</Text>
            <Ionicons name="log-out-outline" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { alignItems: "center", padding: 20 },
  profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 20 },
  profileName: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  optionButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    padding: 15,
    borderBottomWidth: 1,
  },
  optionText: { fontSize: 18 },
  saveButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    marginVertical: 20,
    borderRadius: 10,
  },
  saveButtonText: { color: "#FFF", fontSize: 18, textAlign: "center" },
});

export default PetOwnerProfile;
