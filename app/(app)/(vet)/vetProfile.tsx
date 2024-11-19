// app/(app)/(vet)/vetProfile.tsx

import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ColorPalette } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/app/context/AuthContext";
import { useLoginStore } from "@/stores/login.store";
import OptionButton from "@/components/vet/OptionButton";
import LogOutButton from "@/components/vet/LogOutButton";
import Modal from "react-native-modal";
import { Avatar, Badge, Button, Text, View } from "react-native-ui-lib";
import { Fonts } from "@/constants/Fonts";
import LogOutModal from "@/components/vet/LogOutModal";
import { Link } from "expo-router";
import { Categories } from "@/constants/Categories";

const VetProfile = () => {
  const { dataLogin } = useLoginStore((state) => state);
  const { user } = dataLogin || {};
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { onLogout } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container} gap-20 padding-20>
        <View center width={"100%"}>
          {user?.img ? (
            <Avatar source={{ uri: user?.img }} animate size={100} />
          ) : (
            <Avatar
              source={{ uri: require("@/assets/images/catbox.png") }}
              size={100}
            />
          )}

          <Text style={styles.profileName} marginT-20>
            {user?.veterinarieName}
          </Text>

          <Text style={{ fontFamily: Fonts.PoppinsLight }}>{user?.email}</Text>

          <Link asChild href={"/editVetProfile"}>
            <Button
              label="Edit profile"
              backgroundColor={ColorPalette.white}
              outlineColor={ColorPalette.black}
              color={ColorPalette.black}
              labelStyle={{ fontFamily: Fonts.PoppinsMedium }}
              size="medium"
              marginT-20
            />
          </Link>
        </View>
        {/* <View width={'100%'} center row padding-10>
          {user?.category.map((category, index) => (
            <Badge
              key={index}
              label={category}
              size={30}
              labelStyle={{
                padding: 5,
                color:
                  category === Categories.NUTRITION
                    ? ColorPalette.green
                    : category === Categories.RECREATION
                    ? ColorPalette.yellowText
                    : ColorPalette.bluePalette,
              }}
              backgroundColor={
                category === Categories.NUTRITION
                  ? ColorPalette.greenLow
                  : category === Categories.RECREATION
                  ? ColorPalette.yellowLow
                  : ColorPalette.blueLow
              }
              marginR-5
            />
          ))}
        </View> */}

        <View>
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
      </View>
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
