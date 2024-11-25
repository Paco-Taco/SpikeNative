import React from "react";
import {
  ImageBackground,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Card, View, Text, Badge } from "react-native-ui-lib";
import { Ionicons } from "@expo/vector-icons"; // Asegúrate de instalar este paquete si aún no lo tienes
import { ColorPalette } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import AbsoluteBackArrow from "@/components/shared/AbsoluteBackArrow";

const AppointmentDetails = () => {
  const params = useLocalSearchParams();
  const {
    owner,
    petImg,
    petname,
    age,
    weight,
    date,
    hour,
    day,
    status,
    genderText,
    heightText,
    animalText,
  } = params;

  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={"transparent"}
        translucent
      />
      
      <AbsoluteBackArrow
        color={ColorPalette.white}
      />
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
                backgroundColor={ColorPalette.green}
                size={30}
              />
            </View>
            <Text style={styles.petName}>{petname}</Text>
          </ImageBackground>
        </View>
        <View style={{ padding: 20 }}>
          <Card enableShadow={false} padding-20 style={{ marginBottom: 20 }}>
            <Text style={{ fontFamily: Fonts.PoppinsBold, fontSize: 30, marginBottom: 10 }}>
              Details
            </Text>
            <DetailText label="Owned by:">{owner}</DetailText>
            <DetailText label="Animal:">{animalText}</DetailText>
            <DetailText label="Gender:">{genderText}</DetailText>
            <DetailText label="Age:">{age} years old</DetailText>
            <DetailText label="Weight:">{weight} kg</DetailText>
            <DetailText label="Height:">{heightText}</DetailText>
          </Card>
          <Card enableShadow={false} padding-20 style={{ marginBottom: 20 }}>
            <Text style={{ fontFamily: Fonts.PoppinsBold, fontSize: 30, marginBottom: 10 }}>
              Appointment
            </Text>
            <DetailText label="Day:">{day}</DetailText>
            <DetailText label="Date:">{date}</DetailText>
            <DetailText label="Hour:">{hour}</DetailText>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
};

const DetailText = ({ label, children }: {label: string, children: any}) => {
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
