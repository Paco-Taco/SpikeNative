import React, { useState } from "react";
import { StyleSheet } from "react-native";
import {
  View,
  Text,
  Card,
  Button,
  Modal,
  Image,
  Colors,
} from "react-native-ui-lib";
import { Ionicons } from "@expo/vector-icons";
import { ColorPalette } from "@/constants/Colors";
import { Pendiente } from "@/types/vetTypes.types";
import { Fonts } from "@/constants/Fonts";
import FontSize from "@/constants/FontSize";

interface AppointmentDetailModalProps {
  visible: boolean;
  appointment: Pendiente | null;
  reason: string;
  onClose: () => void;
  onComplete: (id: number) => void;
  onCancel: (appointment: Pendiente) => void;
}

const AppointmentDetailModal = ({
  visible,
  appointment,
  reason,
  onClose,
  onComplete,
  onCancel,
}: AppointmentDetailModalProps) => {
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [actionType, setActionType] = useState<"cancel" | "complete" | null>(
    null
  );

  if (!appointment) return null;

  const handleAction = () => {
    if (actionType === "cancel") {
      onCancel(appointment);
    } else if (actionType === "complete") {
      onComplete(appointment.id);
    }
    setConfirmationVisible(false);
    onClose();
  };

  const genderText = appointment.pet.gender === "0" ? "Male" : "Female";
  const heightText = ["Small", "Medium", "Big", "Very big"][
    parseInt(appointment.pet.height) - 1
  ];
  const animalText = ["Dog", "Cat", "Rabbit", "Bird", "Reptile", "Other"][
    parseInt(appointment.pet.animal) - 1
  ];

  return (
    <>
      <Modal
        visible={visible}
        onBackgroundPress={onClose}
        animationType="fade"
        overlayBackgroundColor="rgba(0, 0, 0, 0.5)"
        transparent
      >
        <View flex center padding-20>
          <Card width="100%" padding-20 borderRadius={10}>
            <View row spread>
              <Text
                style={{
                  fontFamily: Fonts.PoppinsBold,
                  fontSize: FontSize.large,
                }}
                color={ColorPalette.mediumDark}
              >
                Appointment details
              </Text>
              <Button
                link
                iconSource={() => (
                  <Ionicons
                    name="close"
                    size={24}
                    color={ColorPalette.mediumDark}
                  />
                )}
                onPress={onClose}
              />
            </View>

            <View row marginT-20>
              <Image
                source={{ uri: appointment.pet.img }}
                style={styles.petImage}
              />
              <View marginL-20 flex>
                <Text
                  style={{
                    fontFamily: Fonts.PoppinsBold,
                    fontSize: FontSize.medium,
                  }}
                  color={ColorPalette.mediumDark}
                >
                  {appointment.pet.name}
                </Text>
                <View row centerV marginT-5>
                  <Ionicons
                    name="calendar-outline"
                    size={16}
                    color={ColorPalette.yellowPalette}
                  />
                  <Text
                    style={{
                      fontFamily: Fonts.PoppinsRegular,
                      fontSize: FontSize.medium,
                    }}
                    color={ColorPalette.medium}
                    marginL-5
                  >
                    {new Date(appointment.date).toLocaleDateString()}
                  </Text>
                </View>
                <View row centerV marginT-5>
                  <Ionicons
                    name="time-outline"
                    size={16}
                    color={ColorPalette.green}
                  />
                  <Text
                    style={{
                      fontFamily: Fonts.PoppinsRegular,
                      fontSize: FontSize.medium,
                    }}
                    color={ColorPalette.medium}
                    marginL-5
                  >
                    {appointment.hour.hour} - {appointment.hour.day}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.detailsContainer}>
              <DetailRow icon="paw-outline" label="Animal" value={animalText} />
              <DetailRow
                icon="male-female-outline"
                label="Sex"
                value={genderText}
              />
              <DetailRow
                icon="calendar-outline"
                label="Age"
                value={`${appointment.pet.age} years old`}
              />
              <DetailRow
                icon="scale-outline"
                label="Weight"
                value={`${appointment.pet.weight} kg`}
              />
              <DetailRow
                icon="resize-outline"
                label="Size"
                value={heightText}
              />
            </View>

            <View row spread marginT-20>
              <Button
                label="Cancel it"
                backgroundColor={"transparent"}
                color={Colors.red30}
                size={Button.sizes.medium}
                style={styles.button}
                labelStyle={{ fontFamily: Fonts.PoppinsRegular }}
                onPress={() => {
                  setActionType("cancel");
                  setConfirmationVisible(true);
                }}
              />
              <Button
                label="Completed"
                backgroundColor={ColorPalette.green}
                size={Button.sizes.medium}
                labelStyle={{ fontFamily: Fonts.PoppinsRegular }}
                style={styles.button}
                onPress={() => {
                  setActionType("complete");
                  setConfirmationVisible(true);
                }}
              />
            </View>
          </Card>
        </View>
      </Modal>

      <Modal
        visible={confirmationVisible}
        onBackgroundPress={() => setConfirmationVisible(false)}
        animationType="fade"
        overlayBackgroundColor="rgba(0, 0, 0, 0.5)"
        transparent
      >
        <View flex center padding-20>
          <Card width="100%" padding-20 borderRadius={10}>
            <Text
              style={{
                fontFamily: Fonts.PoppinsBold,
                fontSize: FontSize.large,
                textAlign: "center",
              }}
              color={ColorPalette.mediumDark}
            >
              {actionType === "cancel"
                ? "Cancel this appointment?"
                : "Mark this appointment as completed?"}
            </Text>
            <View row marginT-20 style={{ justifyContent: "space-evenly" }}>
              <Button
                label="No"
                backgroundColor={"transparent"}
                color={ColorPalette.darkGrayPalette}
                size={Button.sizes.medium}
                labelStyle={{ fontFamily: Fonts.PoppinsRegular }}
                onPress={() => setConfirmationVisible(false)}
              />
              <Button
                label="Yes"
                backgroundColor={"transparent"}
                color={
                  actionType === "cancel" ? Colors.red30 : ColorPalette.green
                }
                style={{
                  borderWidth: 1,
                  borderColor:
                    actionType === "cancel" ? Colors.red30 : ColorPalette.green,
                }}
                size={Button.sizes.medium}
                labelStyle={{ fontFamily: Fonts.PoppinsSemiBold }}
                onPress={handleAction}
              />
            </View>
          </Card>
        </View>
      </Modal>
    </>
  );
};

const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) => (
  <View row centerV marginB-10>
    <Ionicons name={icon} size={16} color={ColorPalette.mediumDark} />
    <Text
      style={{
        fontFamily: Fonts.PoppinsRegular,
        fontSize: FontSize.medium,
      }}
      color={ColorPalette.medium}
      marginL-5
      marginR-5
    >
      {label}:
    </Text>
    <Text
      style={{
        fontFamily: Fonts.PoppinsRegular,
        fontSize: FontSize.medium,
      }}
      color={ColorPalette.mediumDark}
    >
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  petImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  detailsContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: ColorPalette.offWhite,
    borderRadius: 10,
  },
  button: {
    flex: 0.48,
  },
});

export default AppointmentDetailModal;
