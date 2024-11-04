import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useUserStore } from "@/stores/user.store";

const Index = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Index</Text>
      <Text style={{ fontSize: 30 }}>Hola veterinaria</Text>
    </View>
  );
};

export default Index;
