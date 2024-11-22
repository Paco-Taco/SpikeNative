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
            placeholder="Look for appointments..."
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

const CustomVetHeader = () => {
  const { onLogout } = useAuth();
  const { dataLogin } = useLoginStore((state) => state);
  const veterinaryName = dataLogin?.user.veterinarieName;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={"dark-content"}
        backgroundColor={ColorPalette.white}
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
          <Image
            style={styles.profileButton}
            source={require("@/assets/images/ic_pet.jpg")}
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

export default CustomVetHeader;
