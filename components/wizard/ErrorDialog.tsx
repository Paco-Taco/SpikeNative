import {
  View,
  Text,
  Dialog,
  TouchableOpacity,
  Image,
  Incubator,
} from "react-native-ui-lib";
import React from "react";
import { ColorPalette } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

const ErrorDialog = ({
  visible,
  onDismiss,
  dialogMessage,
}: {
  visible: boolean;
  onDismiss: () => void;
  dialogMessage: string;
}) => {
  return (
    <Incubator.Dialog
      useSafeArea
      visible={visible}
      onDismiss={onDismiss}
      center
      containerStyle={{
        borderRadius: 8,
        backgroundColor: ColorPalette.background,
        padding: 30,
      }}
      width={350}
    >
      <View
        marginB-20
        paddingB-10
        width="100%"
        style={{
          borderBottomWidth: 1,
          borderColor: ColorPalette.grey,
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        <Text>Whoops... an error occurred :c</Text>
        <TouchableOpacity>
          <Ionicons
            name="close"
            size={24}
            color={ColorPalette.medium}
            onPress={onDismiss}
          />
        </TouchableOpacity>
      </View>
      <Text bold>{dialogMessage}</Text>
      <Image
        source={require("@/assets/images/seriousDog1.webp")}
        style={{ width: 200, height: 200, alignSelf: "center", margin: 20 }}
      />
    </Incubator.Dialog>
  );
};

export default ErrorDialog;
