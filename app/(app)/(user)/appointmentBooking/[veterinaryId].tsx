import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Button, Alert, TouchableOpacity, Image } from "react-native";
import { axiosInstanceSpikeCore } from "@/controllers/SpikeApiCore";
import { useLoginStore } from "@/stores/login.store";
import DateTimePicker from "@react-native-community/datetimepicker";

const AppointmentBooking = () => { 
  const router = useRouter();
  const { veterinaryId } = useLocalSearchParams();
  const { dataLogin } = useLoginStore((state) => state);
  const userId = dataLogin?.user.id;

  const [veterinaryDetails, setVeterinaryDetails] = useState(null);
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [availableHours, setAvailableHours] = useState([]);


  // Fetch veterinary details
  useEffect(() => {
    const fetchVeterinaryDetails = async () => {
      try {
        const response = await axiosInstanceSpikeCore.get(`/getveterinary/${veterinaryId}`);
        setVeterinaryDetails(response.data.veterinary);
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

  const handleBookAppointment = async () => {
    // Validate inputs
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
        hour: selectedHour
      });

      Alert.alert("Éxito", "Cita agendada correctamente", [
        { text: "OK", onPress: () => router.push("/(app)/(user)/") }
      ]);
    } catch (error) {
      console.error("Error al crear cita", error);
      Alert.alert("Error", error.response?.data?.error || "No se pudo agendar la cita");
    }
  };

  if (!veterinaryDetails) {
    return <Text>Cargando detalles de la veterinaria...</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
        <View>
        {veterinaryDetails.img && (
            <Image
            source={{ uri: veterinaryDetails.img }}
            style={{ 
                height: 110, 
                width: "100%", 
                borderRadius: 10,
                marginBottom: 10 // Added margin for spacing
            }}
            resizeMode="cover" // Added to ensure image fits nicely
            />
        )}
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>{veterinaryDetails.veterinarieName}</Text>
        <Text>Dirección: {`${veterinaryDetails.street}, ${veterinaryDetails.locality}, ${veterinaryDetails.city}`}</Text>
        <Text>Teléfono: {veterinaryDetails.phone}</Text>
        <Text>Horario: {`${veterinaryDetails.hora_ini} - ${veterinaryDetails.hora_fin}`}</Text>
        <Text>Días disponibles: {veterinaryDetails.dias.join(', ')}</Text>

        {/* Selector de Mascota */}
        <View>
          <Text>Selecciona tu mascota:</Text>
          {pets.map((pet) => (
            <Button 
              key={pet.id} 
              title={pet.name} 
              onPress={() => setSelectedPet(pet)}
              color={selectedPet?.id === pet.id ? 'green' : undefined}
            />
          ))}
        </View>

        {/* Botón para abrir Selector de Fecha */}
        <TouchableOpacity 
          onPress={() => setShowDatePicker(true)}
          style={{ 
            backgroundColor: 'blue', 
            padding: 10, 
            borderRadius: 5, 
            marginVertical: 10 
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center' }}>
            Seleccionar Fecha: {selectedDate.toLocaleDateString()}
          </Text>
        </TouchableOpacity>

        {/* Selector de Fecha */}
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            onChange={(event, date) => {
              setShowDatePicker(false);
              setSelectedDate(date);
            }}
          />
        )}

        {/* Selector de Hora */}
        <View>
          <Text>Selecciona una hora:</Text>
          {veterinaryDetails.hora_ini && veterinaryDetails.hora_fin && (
            <>
              <Button 
                title={`${veterinaryDetails.hora_ini}`} 
                onPress={() => setSelectedHour(veterinaryDetails.hora_ini)}
                color={selectedHour === veterinaryDetails.hora_ini ? 'green' : undefined}
              />
              <Button 
                title={`${veterinaryDetails.hora_fin}`} 
                onPress={() => setSelectedHour(veterinaryDetails.hora_fin)}
                color={selectedHour === veterinaryDetails.hora_fin ? 'green' : undefined}
              />
            </>
          )}
        </View>

        <Button 
          title="Agendar cita" 
          onPress={handleBookAppointment} 
          disabled={!selectedPet || !selectedHour}
        />
      </View>
    </SafeAreaView>
  );
};

export default AppointmentBooking;