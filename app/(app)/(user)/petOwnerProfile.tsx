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
import ProfileLayout from "@/components/layout/ProfileLayout";
import OptionButton from "@/components/shared/OptionButton";
import LogOutButton from "@/components/shared/LogOutButton";
import LogOutModal from "@/components/shared/LogOutModal";
import { ColorPalette } from "@/constants/Colors";
import Divider from "@/components/shared/Divider";

const PetOwnerProfile = () => {
  const { dataLogin } = useLoginStore((state) => state);
  const { user } = dataLogin || {};
  const { onLogout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

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
    <ProfileLayout
      userName={
        user?.firstName && user.lastName
          ? `${user?.firstName} ${user?.lastName}`
          : "No data"
      }
      email={user?.email ? user.email : "No data"}
      userImg={user?.img ? user.img : ""}
      editHref="/(app)/(user)/editPetOwnerProfile"
      onPressLogoutButton={() => setIsLogoutModalVisible(true)}
    >
      <OptionButton
        text="Mis mascotas"
        icon={<Ionicons name="paw-outline" size={24} color={ColorPalette.black} />}
        href="/petlist"
      />
      <Divider />
      <OptionButton
        text="Mis citas"
        icon={<Ionicons name="list-outline" size={24} color={ColorPalette.black} />}
        href="/citasUsuario"
      />
      <Divider />
      <OptionButton
        text="Conmemoraciones"
        icon={<Ionicons name="flower-outline" size={24} color={ColorPalette.black} />}
        href="/conmemoraciones"
      />

      <LogOutModal
        isVisible={isLogoutModalVisible}
        onDismiss={() => setIsLogoutModalVisible(false)}
      />
    </ProfileLayout>
  );
};

export default PetOwnerProfile;
