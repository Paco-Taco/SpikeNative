import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ColorPalette } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/app/context/AuthContext";
import { useLoginStore } from "@/stores/login.store";  
import * as ImagePicker from 'expo-image-picker';

const VetProfile = () => {
  const { dataLogin } = useLoginStore((state) => state);  
  const { user, token } = dataLogin || {};
  const [loading, setLoading] = useState<boolean>(true); 
  const userId = user?.id;

  const { onLogout } = useAuth();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    veterinarieName: user?.veterinarieName || "",
    img: user?.img || "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        veterinarieName: user.veterinarieName,
        img: user.img,
      });
    }
  }, [user]);  

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={styles.container}>
          {/* Imagen de perfil */}
          <TouchableOpacity>
            <Image source={formData.img ? { uri: formData.img } : require("@/assets/images/catbox.png")} style={styles.profileImage} />
          </TouchableOpacity>

          <Text style={styles.profileName}>{formData.veterinarieName}</Text>

          {/* Botón para editar perfil */}
          <TouchableOpacity onPress={() => router.push("/editVetProfile")} style={styles.optionButton}>
            <Text style={styles.optionText}>Editar perfil</Text>
            <Ionicons name="chevron-forward-outline" size={20} color={ColorPalette.primary} />
          </TouchableOpacity>

          {/* Historial de citas */}
          <TouchableOpacity onPress={() => router.push("/appointmentHistory")} style={styles.optionButton}>
            <Text style={styles.optionText}>Historial de citas</Text>
            <Ionicons name="chevron-forward-outline" size={20} color={ColorPalette.primary} />
          </TouchableOpacity>

          {/* Botón de cerrar sesión */}
          <TouchableOpacity onPress={onLogout} style={styles.optionButton}>
            <Text style={styles.optionText}>Cerrar sesión</Text>
            <Ionicons name="log-out-outline" size={20} color={ColorPalette.primary} />
          </TouchableOpacity>
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
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: 15,
    backgroundColor: ColorPalette.graphitePalette,
    borderRadius: 8,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
    color: ColorPalette.lightGrey,
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
    borderColor: ColorPalette.medium,
  },
});

export default VetProfile;
