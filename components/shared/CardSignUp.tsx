import {
  View,
  Text,
  TouchableOpacity,
  Card,
  Image,
  Colors,
} from "react-native-ui-lib";
import React from "react";
import { Fonts } from "@/constants/Fonts";
import { router } from "expo-router";

const CardSignUp = ({ source, text, onPress}: { source: any; text: string, onPress: () => void }) => {
  return (
    <Card
      padding-20
      enableShadow={false}
      style={{ borderWidth: 1, borderColor: Colors.grey50 }}
      activeOpacity={0.2}
      activeScale={.90}
      onPress={onPress}
      center
      margin-20
    >
      <Image source={source} height={100} width={100} />
      <Card.Section
        content={[
          {
            text: text,
            style: { fontFamily: Fonts.PoppinsSemiBold, fontSize: 20 },
          },
        ]}
        contentStyle={{ alignItems: "center", marginTop: 10 }}
      />
      {/* <Text>User</Text> */}
    </Card>
  );
};

export default CardSignUp;
