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
import { Button,Text, View } from "react-native-ui-lib";
import { Fonts } from "@/constants/Fonts";

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
      <Modal
        isVisible={showLogoutModal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        onBackdropPress={() => setShowLogoutModal(false)}
        useNativeDriver
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Confirm log out</Text>
          <Text style={styles.modalMessage}>
            Are you sure you want to log out?
          </Text>
          <View style={styles.modalButtons}>
            <Button
              label="Cancel"
              labelStyle={{ color: ColorPalette.white, fontFamily: Fonts.PoppinsRegular }}
              onPress={() => setShowLogoutModal(false)}
              style={styles.cancelButton}
            />
            <Button
              label="Log out"
              labelStyle={{ color: ColorPalette.lightGraphite, fontFamily: Fonts.PoppinsRegular }}
              onPress={onLogout}
              style={styles.confirmButton}
            />
          </View>
        </View>
      </Modal>


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
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    borderRadius: 8,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: Fonts.PoppinsBold,
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    fontFamily: Fonts.PoppinsRegular,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    backgroundColor: ColorPalette.primary,
    flex: 1,
    marginRight: 10,
  },
  confirmButton: {
    backgroundColor: 'transparent',
    flex: 1,
    marginLeft: 10,
  },
});

export default VetProfile;
