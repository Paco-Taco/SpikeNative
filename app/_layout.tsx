import React from "react";
import { Slot } from "expo-router";
import { AuthProvider } from "./context/AuthContext";

export default function Root() {
  return (
    <AuthProvider>
        <Slot />
    </AuthProvider>
  );
};

