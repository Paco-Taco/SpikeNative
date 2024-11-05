import React from "react";
import { Slot } from "expo-router";
import { AuthProvider } from "./context/AuthContext";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Root() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <Slot />
      </SafeAreaProvider>
    </AuthProvider>
  );
}
