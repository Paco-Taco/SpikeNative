import { View, Text, StateScreen } from "react-native-ui-lib";
import React from "react";
import { router } from "expo-router";

const SuccessScreen = () => {
  return (
    <StateScreen
      title="Success"
      ctaLabel="Go to login"
      onCtaPress={() => router.replace("/login")}
      imageSource={require("@/assets/images/catbox.png")}
    />
  );
};

export default SuccessScreen;
