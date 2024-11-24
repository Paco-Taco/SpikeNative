import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ColorPalette, Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import BottomSheet from "./BottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useAuth } from "@/app/context/AuthContext";
import { useLoginStore } from "@/stores/login.store";
import { useSearch } from "@/app/context/SearchContext"; // Importa el hook del contexto
import { TextField, Image, AnimatedImage, LoaderScreen } from "react-native-ui-lib";
import { Fonts } from "@/constants/Fonts";

const SearchBar = () => {
  const { searchQuery, setSearchQuery } = useSearch(); // Usa el contexto

  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchSection}>
        <View style={styles.searchField}>
          <Ionicons
            style={styles.searchIcon}
            name="search-outline"
            size={20}
            color={ColorPalette.medium}
          />
          <TextField
            placeholder="Search veterinaries..."
            padding-10
            style={styles.input}
            placeholderTextColor={ColorPalette.medium}
            cursorColor={ColorPalette.bluePalette}
            value={searchQuery} // Enlaza el valor con el contexto
            onChangeText={setSearchQuery} // Actualiza el valor en el contexto
          />
        </View>
      </View>
    </View>
  );
};

const CustomHeader = () => {
  const { dataLogin } = useLoginStore((state) => state);
  const role = dataLogin?.user.role;
  const { onLogout } = useAuth();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const router = useRouter();

  const openModal = () => {
    bottomSheetRef.current?.present();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={"dark-content"}
        backgroundColor={ColorPalette.white}
      />
      <BottomSheet ref={bottomSheetRef} />
      <View style={styles.container}>
        <TouchableOpacity>
          <Ionicons
            name="location-outline"
            color={ColorPalette.bluePalette}
            size={20}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.titleContainer} onPress={openModal}>
          <Text style={styles.title}>Clinics on</Text>
          <View style={styles.locationName}>
            <Text style={styles.subtitle}>Manzanillo</Text>
            <Ionicons
              name="chevron-down-outline"
              size={20}
              color={ColorPalette.primary}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => {
            if (role === "VETERINARY_OWNER") {
              router.push("/vetProfile");
            } else if (role === "PET_OWNER") {
              router.navigate("/(app)/(user)/petOwnerProfile");
              // console.log(role);
            } else {
              console.error("Role not recognized:", role);
            }
          }}
        >
          <AnimatedImage
            loader={<ActivityIndicator />}
            style={styles.profileButton}
            source={{ uri: dataLogin?.user.img }}
          />
        </TouchableOpacity>
      </View>
      <SearchBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: ColorPalette.white,
    flex: 1,
  },
  container: {
    height: 60,
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
    fontFamily: Fonts.PoppinsLight
  },
  profileButton: {
    width: 30,
    height: 30,
    borderRadius: 20,
  },
  subtitle: {
    fontSize: 17,
    fontFamily: Fonts.PoppinsBold,
    color: Colors.light.text,
  },
  locationName: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  searchContainer: {
    height: 60,
    backgroundColor: ColorPalette.background,
  },
  searchSection: {
    flexDirection: "row",
    gap: 10,
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10 /* propio */,
    alignItems: "center",
  },
  searchField: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    backgroundColor: ColorPalette.background,
    borderWidth: 1,
    borderColor: ColorPalette.medium,
    borderRadius: 8,
  },
  input: {
    color: ColorPalette.mediumDark,
  },
  searchIcon: {
    paddingLeft: 10,
  },
  optionButton: {
    padding: 10,
    borderRadius: 50,
  },
});

export default CustomHeader;
