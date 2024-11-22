import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  Alert,
  TouchableOpacity,
  Image,
  StatusBar,
  ImageBackground,
} from "react-native";
import { axiosInstanceSpikeCore } from "@/controllers/SpikeApiCore";
import { useLoginStore } from "@/stores/login.store";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ScrollView } from "react-native-gesture-handler";
import { Veterinary } from "@/types/userTypes.types";
import { ColorPalette } from "@/constants/Colors";
import AbsoluteBackArrow from "@/components/shared/AbsoluteBackArrow";
import { Text, View } from "react-native-ui-lib";

const AppointmentBooking = () => {
  const router = useRouter();
  const { veterinaryId } = useLocalSearchParams();
  const { dataLogin } = useLoginStore((state) => state);
  const userId = dataLogin?.user.id;

  const [veterinaryDetails, setVeterinaryDetails] = useState<Veterinary>(null);
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [availableHours, setAvailableHours] = useState([]);
  const [isScrolledPastImage, setIsScrolledPastImage] = useState(false);

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
        date: selectedDate.toISOString(),
        hour: selectedHour,
      });

      Alert.alert("Éxito", "Cita agendada correctamente", [
        { text: "OK", onPress: () => router.push("/(app)/(user)/") },
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
    setIsScrolledPastImage(scrollY > IMAGE_HEIGHT-50);
  };

  if (!veterinaryDetails) {
    return <Text>Cargando detalles de la veterinaria...</Text>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: ColorPalette.offWhite }}>
      <StatusBar
        barStyle={isScrolledPastImage ? "dark-content" : "light-content"}
        backgroundColor={"transparent"}
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
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>
            {veterinaryDetails.veterinarieName}
          </Text>
          <Text>
            Dirección:{" "}
            {`${veterinaryDetails.street}, ${veterinaryDetails.locality}, ${veterinaryDetails.city}`}
          </Text>
          <Text>Teléfono: {veterinaryDetails.phone}</Text>
          <Text>
            Horario:{" "}
            {`${veterinaryDetails.hora_ini} - ${veterinaryDetails.hora_fin}`}
          </Text>
          <Text>Días disponibles: {veterinaryDetails.dias.join(", ")}</Text>

          <View>
            <Text>Selecciona tu mascota:</Text>
            {pets.map((pet) => (
              <Button
                key={pet.id}
                title={pet.name}
                onPress={() => setSelectedPet(pet)}
                color={selectedPet?.id === pet.id ? "green" : undefined}
              />
            ))}
          </View>

          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={{
              backgroundColor: "blue",
              padding: 10,
              borderRadius: 5,
              marginVertical: 10,
            }}
          >
            <Text style={{ color: "white", textAlign: "center" }}>
              Seleccionar Fecha: {selectedDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              minimumDate={new Date()} // Evita seleccionar fechas anteriores
              onChange={(event, date) => {
                if (date && isDateAllowed(date)) {
                  setSelectedDate(date);
                } else {
                  Alert.alert(
                    "Fecha no permitida",
                    "Por favor selecciona una fecha válida."
                  );
                }
                setShowDatePicker(false);
              }}
            />
          )}

          <View>
            <Text>Selecciona una hora:</Text>
            {availableHours.map((hour) => (
              <Button
                key={hour}
                title={hour}
                onPress={() => setSelectedHour(hour)}
                color={selectedHour === hour ? "green" : undefined}
              />
            ))}
          </View>

          <Button
            title="Agendar cita"
            onPress={handleBookAppointment}
            disabled={!selectedPet || !selectedHour}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default AppointmentBooking;
