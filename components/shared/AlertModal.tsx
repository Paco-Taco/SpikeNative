import { View, Text, Button } from "react-native-ui-lib";
import React from "react";
import { Modal, StyleSheet } from "react-native";
import { ColorPalette } from "@/constants/Colors";
import FontSize from "@/constants/FontSize";
import { Fonts } from "@/constants/Fonts";

const AlertModal = ({
  visible,
  title,
  message,
  onConfirm,
  confirmText = "OK",
}: {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  confirmText?: string;
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onConfirm}
    >
      <View flex style={styles.overlay}>
        <View style={styles.alertContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <Button
            label={confirmText}
            labelStyle={{ fontFamily: Fonts.PoppinsMedium }}
            backgroundColor={ColorPalette.bluePalette}
            onPress={onConfirm}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  alertContainer: {
    width: "90%",
    backgroundColor: ColorPalette.offWhite,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: FontSize.large,
    fontFamily: Fonts.PoppinsBold,
    textAlign: "center",
    marginBottom: 10,
  },
  message: {
    fontSize: FontSize.medium,
    fontFamily: Fonts.PoppinsRegular,
    textAlign: "center",
    marginBottom: 20,
  },
});

export default AlertModal;
