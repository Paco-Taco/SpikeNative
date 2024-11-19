import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native-ui-lib';
import { FlatList } from 'react-native';
import { useLoginStore } from '@/stores/login.store';
import { VeterinaryService } from '@/services/vetServices';
import { CitasVet, Pendiente } from '@/types/vetTypes.types';
import CardAppointment from '@/components/CardAppointment';
import { Alert } from 'react-native';
import LottieView from 'lottie-react-native';

const Index = () => {
  const { dataLogin } = useLoginStore((state) => state);
  const [appointments, setAppointments] = useState<CitasVet | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const vetId = dataLogin?.user.vetId;
      const response = await VeterinaryService.getCitasVet(vetId);
      setAppointments(response);
    } catch (error) {
      console.error('Error loading appointments:', error);
      Alert.alert('Error', 'No se pudieron cargar las citas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleComplete = async (appointmentId: number) => {
    try {
      await VeterinaryService.marcarCitaCompletada(appointmentId);
      Alert.alert('Éxito', 'Cita marcada como completada');
      loadAppointments();
    } catch (error) {
      Alert.alert('Error', 'No se pudo completar la cita');
    }
  };

  const handleCancel = async (appointmentId: number) => {
    try {
      await VeterinaryService.cancelarCita(appointmentId);
      Alert.alert('Éxito', 'Cita cancelada');
      loadAppointments();
    } catch (error) {
      Alert.alert('Error', 'No se pudo cancelar la cita');
    }
  };

  const handlePressDetails = (appointment: Pendiente) => {
    const genderText = appointment.pet.gender === "0" ? "Masculino" : "Femenino";
    const heightText = ["Pequeño", "Mediano", "Grande", "Gigante"][
      parseInt(appointment.pet.height) - 1
    ];
    const animalText = ["Perro", "Gato", "Conejo", "Aves", "Reptiles", "Otros"][
      parseInt(appointment.pet.animal) - 1
    ];

    Alert.alert(
      "Detalles de la Cita",
      `Mascota: ${appointment.pet.name}
      \nEdad: ${appointment.pet.age}
      \nGénero: ${genderText}
      \nAnimal: ${animalText}
      \nPeso: ${appointment.pet.weight} kg
      \nAltura: ${heightText}
      \nFecha: ${new Date(appointment.date).toLocaleDateString()}
      \nHora: ${appointment.hour.hour} - Día: ${appointment.hour.day}`
    );
  };

  if (loading) {
    return (
      <View flex center>
        <LottieView
          source={require("@/assets/lottie/LoadingCat.json")}
          autoPlay
          loop
          style={{ width: 100, height: 100 }}
        />
        <Text medium>Cargando...</Text>
      </View>
    );
  }

  return (
    <View flex padding-20>
      <Text text40 marginB-20>Citas Pendientes</Text>
      <FlatList
        data={appointments?.pendientes}
        renderItem={({ item }) => (
          <CardAppointment
            item={item}
            onComplete={handleComplete}
            onCancel={handleCancel}
            onPressDetails={handlePressDetails}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text text70 center marginT-20>
            No hay citas pendientes
          </Text>
        }
      />
    </View>
  );
};

export default Index;