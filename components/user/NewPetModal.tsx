import { View, Text, Button } from "react-native-ui-lib";
import React from "react";
import Modal from "react-native-modal";
import { ColorPalette } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";

const NewPetModal = ({
  isVisible,
  onDismiss,
  onOk,
}: {
  isVisible: boolean;
  onDismiss: () => void;
  onOk: () => void;
}) => {
  return (
    <Modal
      isVisible={isVisible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      onDismiss={onDismiss}
      onBackdropPress={onDismiss}
      useNativeDriver
      hideModalContentWhileAnimating
      supportedOrientations={["portrait", "landscape"]}
      coverScreen={false}
    >
      <View
        backgroundColor={ColorPalette.white}
        padding-30
        style={{ borderRadius: 10 }}
      >
        <Text
          marginB-20
          color={ColorPalette.black}
          style={{ fontFamily: Fonts.PoppinsBold, fontSize: 20 }}
        >
          List your pet!
        </Text>
        <Text marginB-20 color={ColorPalette.mediumDark}>
          You don't have any pets registered yet. Please register your pet to
          access all the features.
        </Text>
        <View row spread marginT-10>
          <Button
            label="Dismiss"
            labelStyle={{ fontFamily: Fonts.PoppinsRegular }}
            onPress={onDismiss}
            backgroundColor={ColorPalette.white}
            color={ColorPalette.medium}
          />
          <Button
            label="Got it"
            labelStyle={{ fontFamily: Fonts.PoppinsRegular }}
            onPress={onOk}
            backgroundColor={ColorPalette.bluePalette}
          />
        </View>
      </View>
    </Modal>
  );
};

export default NewPetModal;
