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
          Registra tu primer mascota
        </Text>
        <Text marginB-20 color={ColorPalette.mediumDark}>
          Aún no tienes mascotas registradas. Registra tu primera mascota para
          empezar.
        </Text>
        <View row spread marginT-10>
          <Button
            label="Omitir"
            labelStyle={{ fontFamily: Fonts.PoppinsRegular }}
            onPress={onDismiss}
            backgroundColor={ColorPalette.white}
            color={ColorPalette.medium}
          />
          <Button
            label="Registrar Mascota"
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
