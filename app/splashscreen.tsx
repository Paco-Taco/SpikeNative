import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { ColorPalette } from "@/constants/Colors";

const SplashScreen = () => (
  <View style={styles.container}>
    <Image
      source={require("@/assets/images/logo.png")}
      style={styles.logo}
    />
    <Text style={styles.appName}>Spike</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: ColorPalette.darkGrayPalette,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  appName: {
    fontSize: 24,
    color: ColorPalette.lightGrey,
    marginTop: 20,
    fontWeight: "bold",
  },
});

export default SplashScreen;
