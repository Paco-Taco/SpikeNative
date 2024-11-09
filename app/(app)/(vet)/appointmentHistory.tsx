import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLoginStore } from "@/stores/login.store";

const Index = () => {
  const { dataLogin } = useLoginStore((state) => state);
  const role = dataLogin?.user.role;

  // useEffect(()=>{
  //   console.log(role)
  // },[])
  
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Index</Text>
      <Text style={{ fontSize: 30 }}>Hola, estas en el historial de citas</Text>
    </View>
  );
};

export default Index;