import React, { useEffect } from "react";
import { Slot } from "expo-router";
import { AuthProvider } from "./context/AuthContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { ThemeManager, Typography } from "react-native-ui-lib";

SplashScreen.preventAutoHideAsync();

Typography.loadTypographies({
  regular: { fontFamily: "Poppins-Regular" },
  bold: { fontFamily: "Poppins-Bold" },
  semiBold: { fontFamily: "Poppins-SemiBold" },
  medium: { fontFamily: "Poppins-Medium" },
  light: { fontFamily: "Poppins-Light" },
  extraLight: { fontFamily: "Poppins-ExtraLight" },
  thin: { fontFamily: "Poppins-Thin" },
});

ThemeManager.setComponentTheme("Text", {
  regular: true,
});

export default function Root() {
  const [loaded, error] = useFonts({
    "Poppins-Regular": require("@/assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("@/assets/fonts/Poppins-Bold.ttf"),
    "Poppins-SemiBold": require("@/assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Medium": require("@/assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Light": require("@/assets/fonts/Poppins-Light.ttf"),
    "Poppins-ExtraLight": require("@/assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Thin": require("@/assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <Slot />
      </SafeAreaProvider>
    </AuthProvider>
  );
}
