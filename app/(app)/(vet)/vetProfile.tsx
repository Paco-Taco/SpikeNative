import React, { useState } from "react";
import { StyleSheet, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ColorPalette } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/app/context/AuthContext";
import { useLoginStore } from "@/stores/login.store";
import OptionButton from "@/components/vet/OptionButton";
import LogOutButton from "@/components/vet/LogOutButton";
import Modal from "react-native-modal";
import { Button, Text, View } from "react-native-ui-lib";
import { Fonts } from "@/constants/Fonts";
import LogOutModal from "@/components/vet/LogOutModal";

const VetProfile = () => {
  const { dataLogin } = useLoginStore((state) => state);
  const { user } = dataLogin || {};
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { onLogout } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={styles.container}>
          {/* Imagen de perfil */}
          <Image
            source={
              user?.img
                ? { uri: user.img }
                : require("@/assets/images/catbox.png")
            }
            style={styles.profileImage}
          />

          <Text style={styles.profileName}>{user?.veterinarieName}</Text>

          <OptionButton
            text="Editar perfil"
            icon={
              <Ionicons
                name="person-circle-outline"
                size={20}
                color={ColorPalette.mediumDark}
              />
            }
            href="/editVetProfile"
          />
          {/* Historial de citas */}
          <OptionButton
            text="Historial de citas"
            icon={
              <Ionicons
                name="calendar-outline"
                size={20}
                color={ColorPalette.mediumDark}
              />
            }
            href="/appointmentHistory"
          />

          {/* Botón de cerrar sesión */}
          <LogOutButton
            text="Log out"
            icon={
              <Ionicons
                name="log-out-outline"
                size={20}
                color={ColorPalette.mediumDark}
              />
            }
            onPress={() => setShowLogoutModal(true)}
          />
        </View>
      </ScrollView>
      <LogOutModal
        isVisible={showLogoutModal}
        onDismiss={() => setShowLogoutModal(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ColorPalette.offWhite,
  },
  container: {
    padding: 30,
    alignItems: "center",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 100,
    marginBottom: 20,
  },
  profileName: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: ColorPalette.darkGrayPalette,
    marginBottom: 20,
  },
});

export default VetProfile;
