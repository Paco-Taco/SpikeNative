import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Alert,
  TouchableOpacity,
  Image,
  StatusBar,
  ImageBackground,
  Modal,
} from "react-native";
import { axiosInstanceSpikeCore } from "@/controllers/SpikeApiCore";
import { useLoginStore } from "@/stores/login.store";
// import DateTimePicker from "@react-native-community/datetimepicker";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { Veterinary } from "@/types/userTypes.types";
import { ColorPalette } from "@/constants/Colors";
import AbsoluteBackArrow from "@/components/shared/AbsoluteBackArrow";
import {
  Card,
  Colors,
  Incubator,
  Text,
  View,
  Button,
  DateTimePicker,
} from "react-native-ui-lib";
import { Fonts } from "@/constants/Fonts";
import FontSize from "@/constants/FontSize";
import { Ionicons } from "@expo/vector-icons";
import NewPetModal from "@/components/user/NewPetModal";
import Divider from "@/components/shared/Divider";
import LoadingCat from "@/components/shared/LoadingCat";

const AppointmentBooking = () => {
  const router = useRouter();
  const { veterinaryId } = useLocalSearchParams();
  const { dataLogin } = useLoginStore((state) => state);
  const userId = dataLogin?.user.id;

  const [veterinaryDetails, setVeterinaryDetails] = useState<Veterinary>(null);
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isSelectedDateValid, setIsSelectedDateValid] = useState(false);
  const [selectedHour, setSelectedHour] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [availableHours, setAvailableHours] = useState([]);
  const [isScrolledPastImage, setIsScrolledPastImage] = useState(false);
  const [isSelectPetModalVisible, setIsSelectPetModalVisible] = useState(false);

  const IMAGE_HEIGHT = 400;

  const calculateAvailableHours = (startTime, endTime) => {
    const hours = [];
    const [startHour] = startTime.split(":").map(Number);
    const [endHour] = endTime.split(":").map(Number);

    for (let hour = startHour; hour < endHour; hour++) {
      hours.push(`${hour.toString().padStart(2, "0")}:00`);
    }
    return hours;
  };

  const isDateAllowed = (date) => {
    if (!veterinaryDetails || !veterinaryDetails.dias) return false;

    // Map day names to numbers
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const allowedDays = veterinaryDetails.dias.map((day) =>
      dayNames.indexOf(day)
    );

    return allowedDays.includes(date.getDay());
  };

  useEffect(() => {
    const fetchVeterinaryDetails = async () => {
      try {
        const response = await axiosInstanceSpikeCore.get(
          `/getveterinary/${veterinaryId}`
        );
        const veterinaryData = response.data.veterinary;
        setVeterinaryDetails(veterinaryData);

        const hours = calculateAvailableHours(
          veterinaryData.hora_ini,
          veterinaryData.hora_fin
        );
        setAvailableHours(hours);
      } catch (error) {
        console.error("Error al obtener detalles de la veterinaria", error);
      }
    };

    const fetchUserPets = async () => {
      try {
        const response = await axiosInstanceSpikeCore.get(`/getpets/${userId}`);
        setPets(response.data);
      } catch (error) {
        console.error("Error al obtener mascotas", error);
      }
    };

    if (veterinaryId) {
      fetchVeterinaryDetails();
    }
    if (userId) {
      fetchUserPets();
    }
  }, [veterinaryId, userId]);

  const handleDateChange = (event, date) => {
    if (date && isDateAllowed(date)) {
      setSelectedDate(date);
    } else {
      Alert.alert(
        "Fecha no permitida",
        "Por favor selecciona una fecha válida."
      );
    }
    setShowDatePicker(false);
  };

  const formatDateToLocalISOString = (date) => {
    const offset = date.getTimezoneOffset() * 60000; // Obtener el offset en milisegundos
    return new Date(date.getTime() - offset).toISOString().split("T")[0];
  };
  console.log(formatDateToLocalISOString(selectedDate))

  const handleBookAppointment = async () => {
    if (!selectedPet) {
      Alert.alert("Error", "Por favor selecciona una mascota");
      return;
    }
    if (!selectedHour) {
      Alert.alert("Error", "Por favor selecciona una hora");
      return;
    }


    try {
      const response = await axiosInstanceSpikeCore.post("/crearCita", {
        veterinaryId: parseInt(veterinaryId),
        petId: selectedPet.id,
        userId: userId,
        date: formatDateToLocalISOString(selectedDate),
        hour: selectedHour,
      });

      Alert.alert("Éxito", "Cita agendada correctamente", [
        { text: "OK", onPress: () => router.replace("/(app)/(user)/citasUsuario") },
      ]);
    } catch (error) {
      console.error("Error al crear cita", error);
      Alert.alert(
        "Error",
        error.response?.data?.error || "No se pudo agendar la cita"
      );
    }
  };

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setIsScrolledPastImage(scrollY > IMAGE_HEIGHT - 50);
  };

  const isFormValid = () => {
    return selectedPet && selectedDate && isSelectedDateValid && selectedHour;
  };

  if (!veterinaryDetails) {
    return <LoadingCat />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: ColorPalette.offWhite }}>
      <StatusBar
        barStyle={isScrolledPastImage ? "dark-content" : "light-content"}
        backgroundColor={
          isScrolledPastImage ? ColorPalette.offWhite : "transparent"
        }
        translucent
      />

      <AbsoluteBackArrow
        background={isScrolledPastImage}
        color={ColorPalette.white}
      />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View>
          <ImageBackground
            source={{ uri: veterinaryDetails.img }}
            style={{
              width: "100%",
              height: IMAGE_HEIGHT,
              // resizeMode: "cover",
              justifyContent: "flex-end",
            }}
            // resizeMode="cover"
          />
        </View>
        <View padding-20>
          <Text
            style={{
              fontSize: FontSize.xLarge,
              fontFamily: Fonts.PoppinsBold,
              textAlign: "center",
            }}
          >
            {veterinaryDetails.veterinarieName}
          </Text>
          <SectionContainer>
            <CardItem
              icon={<Ionicons name="location-outline" size={20} />}
              label="Address"
              content={`${veterinaryDetails.street}, ${veterinaryDetails.locality}, ${veterinaryDetails.city}`}
            />
            <CardItem
              icon={<Ionicons name="call-outline" size={20} />}
              label="Phone"
              content={veterinaryDetails.phone}
            />
            <CardItem
              icon={<Ionicons name="time-outline" size={20} />}
              label="Working hours"
              content={`${veterinaryDetails.hora_ini} - ${veterinaryDetails.hora_fin}`}
            />
            <CardItem
              icon={<Ionicons name="calendar-outline" size={20} />}
              label="Working days"
              content={veterinaryDetails.dias?.join(", ")}
            />
          </SectionContainer>
          <Card padding-20 enableShadow={false}>
            <Text
              marginV-10
              style={{
                fontSize: FontSize.large,
                fontFamily: Fonts.PoppinsBold,
              }}
            >
              Pet:
            </Text>
            {selectedPet && (
              <Card
                padding-20
                margin-20
                style={{
                  alignItems: "center",
                }}
                containerStyle={{
                  elevation: 10,
                }}
              >
                <Image
                  source={{ uri: selectedPet.img }}
                  width={180}
                  height={180}
                  style={{
                    borderRadius: 10,
                    marginBottom: 10,
                  }}
                />
                <Text
                  style={{
                    fontSize: FontSize.large,
                    fontFamily: Fonts.PoppinsMedium,
                  }}
                >
                  {selectedPet.name}
                </Text>
              </Card>
            )}
            <Button
              label={
                selectedPet ? "Choose another pet" : "Select a pet to book"
              }
              borderRadius={10}
              onPress={() => setIsSelectPetModalVisible(true)}
              backgroundColor={ColorPalette.white}
              labelStyle={{
                color: selectedPet?.id ? Colors.grey30 : ColorPalette.primary,
                fontFamily: Fonts.PoppinsRegular,
                fontSize: FontSize.small,
              }}
              outlineColor={selectedPet?.id ? undefined : ColorPalette.primary}
            />
          </Card>

          <SectionContainer>
            <Text
              style={{
                fontFamily: Fonts.PoppinsBold,
                fontSize: FontSize.large,
              }}
            >
              Booking Date:
            </Text>

            <DateTimePicker
              // label="Selected date"
              // placeholder="Select date"
              containerStyle={
                isSelectedDateValid
                  ? {
                      borderRadius: 10,
                      backgroundColor: ColorPalette.primary,
                      padding: 10,
                      marginTop: 15,
                      alignItems: "center",
                    }
                  : {
                      borderWidth: 1,
                      borderRadius: 10,
                      borderColor: ColorPalette.primary,
                      padding: 10,
                      marginTop: 15,
                      alignItems: "center",
                    }
              }
              confirmButtonProps={{
                color: ColorPalette.primary,
              }}
              style={{
                textAlign: "center",
                color: ColorPalette.primary,
                display: "none",
              }}
              value={selectedDate}
              mode="date"
              minimumDate={new Date()}
              onChange={(date) => {
                if (date && isDateAllowed(date)) {
                  setSelectedDate(date);
                  setIsSelectedDateValid(true);
                } else {
                  Alert.alert(
                    "Date not available",
                    "Please select a valid date."
                  );
                  setIsSelectedDateValid(false);
                }
                setShowDatePicker(false);
              }}
            >
              <Text
                style={{
                  color: isSelectedDateValid
                    ? ColorPalette.white
                    : ColorPalette.primary,
                  fontFamily: Fonts.PoppinsRegular,
                }}
              >
                {isSelectedDateValid
                  ? selectedDate.toDateString()
                  : "Select a date"}
              </Text>
            </DateTimePicker>
          </SectionContainer>

          <SectionContainer>
            <Text
              style={{
                fontFamily: Fonts.PoppinsBold,
                fontSize: FontSize.large,
              }}
            >
              Booking Hour:
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingVertical: 10,
                paddingHorizontal: 5,
              }}
            >
              {availableHours.map((hour) => (
                <TouchableOpacity
                  key={hour}
                  onPress={() => setSelectedHour(hour)}
                  style={{
                    backgroundColor:
                      selectedHour === hour
                        ? ColorPalette.primary
                        : ColorPalette.white,
                    borderRadius: 20,
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                    marginHorizontal: 5,
                    borderWidth: 1,
                    borderColor: ColorPalette.primary,
                  }}
                >
                  <Text
                    style={{
                      color:
                        selectedHour === hour ? "white" : ColorPalette.primary,
                      fontFamily: Fonts.PoppinsMedium,
                    }}
                  >
                    {hour}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </SectionContainer>

          <Button
            marginT-30
            label="Book appointment"
            onPress={handleBookAppointment}
            backgroundColor={Colors.green20}
            labelStyle={{
              fontFamily: Fonts.PoppinsMedium,
            }}
            disabled={!isFormValid()}
          />
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isSelectPetModalVisible}
        onRequestClose={() => setIsSelectPetModalVisible(false)}
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
                Select one of your pets
              </Text>
            </View>
            <FlatList
              data={pets}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              contentContainerStyle={{
                paddingBottom: 20,
                paddingHorizontal: 20,
              }}
              renderItem={({ item }) => (
                <Card
                  onPress={() => {
                    setSelectedPet(item);
                    setIsSelectPetModalVisible(false);
                  }}
                  padding-20
                  margin-20
                  style={{
                    alignItems: "center",
                  }}
                  selected={selectedPet?.id === item.id}
                  selectionOptions={{ color: ColorPalette.primary }}
                >
                  <Image
                    source={{ uri: item.img }}
                    width={180}
                    height={180}
                    style={{
                      borderRadius: 10,
                      marginBottom: 10,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: FontSize.large,
                      fontFamily: Fonts.PoppinsMedium,
                    }}
                  >
                    {item.name}
                  </Text>
                </Card>
              )}
            />
            <View>
              <Button
                label="Cancel"
                labelStyle={{ fontFamily: Fonts.PoppinsMedium }}
                marginT-10
                onPress={() => setIsSelectPetModalVisible(false)}
                color={ColorPalette.medium}
                backgroundColor="transparent"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const CardItem = ({
  label,
  content,
  icon,
}: {
  label: string;
  content: string;
  icon: React.ReactNode;
}) => {
  return (
    <View marginV-10>
      <Text
        style={{ fontFamily: Fonts.PoppinsBold, fontSize: FontSize.medium }}
      >
        {label}
      </Text>
      <View row style={{ alignItems: "center" }} gap-5>
        {icon}
        <Text style={{ fontSize: FontSize.medium }}>{content}</Text>
      </View>
    </View>
  );
};

const SectionContainer = ({ children }: { children: React.ReactNode }) => (
  <Card enableShadow={false} padding-20 marginV-20>
    {children}
  </Card>
);

export default AppointmentBooking;
