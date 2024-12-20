import React from "react";
import { StyleSheet, SafeAreaView, StatusBar, Linking } from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ColorPalette } from "@/constants/Colors";
import {
  View,
  Text,
  TouchableOpacity,
  Card,
  Image,
  Colors,
} from "react-native-ui-lib";
import { Fonts } from "@/constants/Fonts";
import CardSignUp from "@/components/shared/CardSignUp";

const SignUp = () => {
  const openURL = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Couldn't load URL:", err)
    );
  };

  const TERMS_AND_CONDITIONS_URL = "https://arielrosasc.github.io/TermsSpike/";

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={"dark-content"}
        backgroundColor={ColorPalette.white}
      />

      <View style={{ position: "absolute", left: 20, top: 50 }}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.navigate("/login")}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={34}
            color={ColorPalette.medium}
          />
        </TouchableOpacity>
      </View>
      <View flex center gap-30>
        <Text style={{ fontFamily: Fonts.PoppinsBold, fontSize: 40 }}>
          Sign Up
        </Text>
        <View row width={"100%"} style={{ justifyContent: "space-around" }}>
          <CardSignUp
            source={require("@/assets/images/user.webp")}
            text={"User"}
            onPress={() => router.push("/userRegister")}
          />
          <CardSignUp
            source={require("@/assets/images/veterinary.webp")}
            text={"Vet"}
            onPress={() => router.push("/vetRegister")}
          />
        </View>
      </View>
      <View padding-20>
        <Text center color={Colors.grey30}>
          By signing up, you agree to our{" "}
          <Text
            color={ColorPalette.bluePalette}
            onPress={() =>
              openURL(TERMS_AND_CONDITIONS_URL)
            }
          >
            Terms of Service
          </Text>{" "}
          and{" "}
          <Text
            color={ColorPalette.bluePalette}
            onPress={() =>
              openURL(TERMS_AND_CONDITIONS_URL)
            }
          >
            Privacy Policy
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: ColorPalette.white,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    marginLeft: 5,
    fontSize: 16,
    color: ColorPalette.medium,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 60,
    color: ColorPalette.lightGrey,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  userButton: {
    backgroundColor: ColorPalette.bluePalette,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20,
    width: "80%",
    alignItems: "center",
  },
  vetButton: {
    backgroundColor: ColorPalette.medium,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: ColorPalette.lightGrey,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SignUp;
