import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useUserStore } from "@/stores/user.store";
import { useLoginStore } from "@/stores/login.store";

const Index = () => {
  const {dataLogin} = useLoginStore(state => state)
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Index</Text>
      <Text style={{ fontSize: 30 }}>Hola {dataLogin?.user.role}</Text>
      <Text>{dataLogin?.user.firstName}</Text>
    </View>
  );
};

export default Index;
