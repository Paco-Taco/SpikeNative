// app/(app)/(vet)/vetProfile.tsx

import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ColorPalette } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/app/context/AuthContext";
import { useLoginStore } from "@/stores/login.store";
import OptionButton from "@/components/shared/OptionButton";
import LogOutButton from "@/components/shared/LogOutButton";
import Modal from "react-native-modal";
import { Avatar, Badge, Button, Text, View } from "react-native-ui-lib";
import { Fonts } from "@/constants/Fonts";
import LogOutModal from "@/components/shared/LogOutModal";
import { Link } from "expo-router";
import { Categories } from "@/constants/Categories";
import ProfileLayout from "@/components/layout/ProfileLayout";

const VetProfile = () => {
  const { dataLogin } = useLoginStore((state) => state);
  const { user } = dataLogin || {};
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { onLogout } = useAuth();

  return (
    <ProfileLayout
      userImg={user?.img ? user.img : ""}
      userName={user?.veterinarieName ? user.veterinarieName : "No data"}
      email={user?.email ? user.email : "No data"}
      editHref="/editVetProfile"
      onPressLogoutButton={() => setShowLogoutModal(true)}
    >
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

      <LogOutModal
        isVisible={showLogoutModal}
        onDismiss={() => setShowLogoutModal(false)}
      />
    </ProfileLayout>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ColorPalette.white,
  },
  container: {
    alignItems: "center",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 100,
    // marginBottom: 20,
  },
  profileName: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: ColorPalette.darkGrayPalette,
  },
});

export default VetProfile;
