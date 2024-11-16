import { View, Text, Button } from "react-native-ui-lib";
import React from "react";
import Modal from "react-native-modal";
import { StyleSheet } from "react-native";
import { Fonts } from "@/constants/Fonts";
import { ColorPalette } from "@/constants/Colors";
import { useAuth } from "@/app/context/AuthContext";

const LogOutModal = ({
  isVisible,
  onDismiss,
}: {
  isVisible: boolean;
  onDismiss: () => void;
}) => {
  const { onLogout } = useAuth();

  return (
    <Modal
      isVisible={isVisible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      onBackdropPress={onDismiss}
      useNativeDriver
    >
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Confirm log out</Text>
        <Text style={styles.modalMessage}>
          Are you sure you want to log out?
        </Text>
        <View style={styles.modalButtons}>
          <Button
            label="Cancel"
            labelStyle={{
              color: ColorPalette.white,
              fontFamily: Fonts.PoppinsRegular,
            }}
            onPress={onDismiss}
            style={styles.cancelButton}
          />
          <Button
            label="Log out"
            labelStyle={{
              color: ColorPalette.lightGraphite,
              fontFamily: Fonts.PoppinsRegular,
            }}
            onPress={onLogout}
            style={styles.confirmButton}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    borderRadius: 8,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: Fonts.PoppinsBold,
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    fontFamily: Fonts.PoppinsRegular,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    backgroundColor: ColorPalette.primary,
    flex: 1,
    marginRight: 10,
  },
  confirmButton: {
    backgroundColor: "transparent",
    flex: 1,
    marginLeft: 10,
  },
});

export default LogOutModal;
