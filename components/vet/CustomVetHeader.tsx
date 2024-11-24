import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextField,
} from "react-native-ui-lib";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ColorPalette, Colors } from "@/constants/Colors";
import { useSearch } from "@/app/context/SearchContext";
import { router } from "expo-router";
import { useAuth } from "@/app/context/AuthContext";
import { useLoginStore } from "@/stores/login.store";

const CustomVetHeader = () => {
  const { onLogout } = useAuth();
  const { dataLogin } = useLoginStore((state) => state);
  const veterinaryName = dataLogin?.user.veterinarieName;
  const userImg = dataLogin?.user.img;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={"dark-content"} // Texto oscuro para barra de estado
        backgroundColor={"#FFFFFF"} // Fondo blanco
      />
      <View style={styles.container}>
        <TouchableOpacity onPress={onLogout}>
          <Ionicons
            name="storefront-outline"
            color={ColorPalette.bluePalette}
            size={20}
          />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Nice to see you again</Text>
          <View style={styles.locationName}>
            <Text style={styles.subtitle}>{veterinaryName}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => {
            router.navigate("/vetProfile");
          }}
        >
          <Image style={styles.profileButton} source={{ uri: userImg }} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF", // Fondo blanco del SafeAreaView
  },
  container: {
    height: 100,
    flexDirection: "row",
    gap: 20,
    backgroundColor: ColorPalette.background,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  leftIcon: {
    width: 30,
    height: 200,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    color: Colors.light.text,
  },
  profileButton: {
    width: 30,
    height: 30,
    borderRadius: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  locationName: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
});

export default CustomVetHeader;
