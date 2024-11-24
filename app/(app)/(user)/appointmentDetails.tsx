import React, { useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { Card, View, Text, Badge, Colors, Button } from "react-native-ui-lib";
import { Ionicons } from "@expo/vector-icons"; // Asegúrate de instalar este paquete si aún no lo tienes
import { ColorPalette } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import AbsoluteBackArrow from "@/components/shared/AbsoluteBackArrow";
import FontSize from "@/constants/FontSize";
import { axiosInstanceSpikeCore } from "@/controllers/SpikeApiCore";
import axios from "axios";
import AlertModal from "@/components/shared/AlertModal";

const AppointmentDetails = () => {
  const params = useLocalSearchParams();
  const {
    vetCategory,
    appointmentId,
    vetName,
    vetAddress,
    vetImg,
    vetPhone,
    petImg,
    petname,
    age,
    weight,
    date,
    hour,
    day,
    status,
    isDone,
    genderText,
    heightText,
    animalText,
  } = params;

  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [alertProps, setAlertProps] = useState({
    visible: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const handleCancelAppointment = async (appointmentId) => {
    try {
      setIsCancelModalVisible(false);
      await axiosInstanceSpikeCore.post("/cancelarCita", {
        appointmentId: appointmentId,
      });

      setAlertProps({
        visible: true,
        title: "Success",
        message: "The appointment has been canceled successfully",
        onConfirm: () => router.replace("/(app)/(user)/citasUsuario"),
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "An unknown error occurred";
        setAlertProps({
          visible: true,
          title: "Error",
          message: errorMessage,
          onConfirm: () =>
            setAlertProps((prev) => ({ ...prev, visible: false })),
        });
        console.error("Error canceling appointment:", errorMessage, error.message);
        throw error;
      }

      setAlertProps({
        visible: true,
        title: "Error",
        message: "An unknown error occurred",
        onConfirm: () => setAlertProps((prev) => ({ ...prev, visible: false })),
      });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={"transparent"}
        translucent
      />

      <AbsoluteBackArrow color={ColorPalette.white} />
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}>
        <View>
          <ImageBackground
            source={
              petImg ? { uri: petImg } : require("@/assets/images/catbox.png")
            }
            style={styles.profileImage}
          >
            <View style={styles.badgeContainer}>
              <Badge
                label={status}
                labelStyle={{
                  fontFamily: Fonts.PoppinsBold,
                  color: ColorPalette.white,
                }}
                backgroundColor={isDone ? ColorPalette.green : Colors.grey30}
                size={30}
              />
            </View>
            <Text style={styles.petName}>{petname}</Text>
          </ImageBackground>
        </View>
        <View style={{ padding: 20 }}>
          <Card enableShadow={false} padding-20 style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontFamily: Fonts.PoppinsBold,
                fontSize: 30,
                marginBottom: 10,
              }}
            >
              Details
            </Text>
            <DetailText label="Clinic name:">{vetName}</DetailText>
            <DetailText label="Adress:">{vetAddress}</DetailText>
            <DetailText label="Phone:">{vetPhone}</DetailText>
          </Card>
          <Card enableShadow={false} padding-20 style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontFamily: Fonts.PoppinsBold,
                fontSize: 30,
                marginBottom: 10,
              }}
            >
              Appointment
            </Text>
            <DetailText label="Day:">{day}</DetailText>
            <DetailText label="Date:">{date}</DetailText>
            <DetailText label="Hour:">{hour}</DetailText>
          </Card>
        </View>

        {!isDone && (
          <Button
            label="Cancel Appointment"
            labelStyle={{
              fontFamily: Fonts.PoppinsMedium,
              color: Colors.red10,
            }}
            backgroundColor={"transparent"}
            style={{
              marginHorizontal: 20,
              borderWidth: 1,
              borderColor: Colors.red10,
            }}
            onPress={() => setIsCancelModalVisible(true)}
          />
        )}
      </ScrollView>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isCancelModalVisible}
        onRequestClose={() => setIsCancelModalVisible(false)}
      >
        <View
          flex
          style={{
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              width: "90%",
              maxHeight: "70%",
              backgroundColor: ColorPalette.offWhite,
              borderRadius: 20,
              padding: 20,
              alignItems: "center",
            }}
          >
            <View marginB-5 width={"100%"}>
              <Text
                style={{
                  fontSize: FontSize.large,
                  fontFamily: Fonts.PoppinsBold,
                  marginBottom: 10,
                  textAlign: "center",
                }}
              >
                Are you sure you want to cancel this appointment?
              </Text>
            </View>
            <View marginB-20 width={"100%"}>
              <Text
                style={{
                  fontSize: FontSize.medium,
                  fontFamily: Fonts.PoppinsRegular,
                  marginBottom: 10,
                  textAlign: "center",
                }}
              >
                You can't undo this action.
              </Text>
            </View>
            <View row style={{ width: "100%", justifyContent: "space-evenly" }}>
              <Button
                label="Close"
                labelStyle={{ fontFamily: Fonts.PoppinsMedium }}
                backgroundColor={ColorPalette.bluePalette}
                onPress={() => setIsCancelModalVisible(false)}
              />
              <Button
                label="Cancel anyway"
                color={Colors.red10}
                labelStyle={{ fontFamily: Fonts.PoppinsMedium }}
                backgroundColor={"transparent"}
                onPress={() => {
                  setIsCancelModalVisible(false);
                  handleCancelAppointment(appointmentId);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
      <AlertModal {...alertProps} />
    </View>
  );
};

const DetailText = ({ label, children }: { label: string; children: any }) => {
  return (
    <Text style={{ fontFamily: Fonts.PoppinsRegular, marginBottom: 10 }}>
      <Text style={{ fontFamily: Fonts.PoppinsBold }}>{label}</Text> {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorPalette.offWhite,
  },
  petName: {
    position: "absolute",
    bottom: 10,
    left: 40,
    fontSize: 24,
    fontFamily: Fonts.PoppinsBold,
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  profileImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
    justifyContent: "flex-end",
  },
  badgeContainer: {
    position: "absolute",
    bottom: 10,
    right: 40,
  },
});

export default AppointmentDetails;
