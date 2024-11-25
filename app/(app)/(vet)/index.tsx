import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Dimensions, Alert } from "react-native";
import { useLoginStore } from "@/stores/login.store";
import { VeterinaryService } from "@/services/vetServices";
import { CitasVet, Pendiente } from "@/types/vetTypes.types";
import CardAppointment from "@/components/CardAppointment";
import AppointmentDetailModal from "@/components/AppointmentDetailModal";
import LoadingCat from "@/components/shared/LoadingCat";
import FontSize from "@/constants/FontSize";
import { FlatList } from "react-native";

import { Fonts } from "@/constants/Fonts";

const Index = () => {
  const { dataLogin } = useLoginStore((state) => state);
  const [appointments, setAppointments] = useState<CitasVet | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Pendiente | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [todayAndWeekAppointments, setTodayAndWeekAppointments] = useState<Pendiente[]>([]);
  const [laterAppointments, setLaterAppointments] = useState<Pendiente[]>([]);
  const [allAppointments, setAllAppointments] = useState<Pendiente[]>([]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const vetId = dataLogin?.user.vetId;
      const response = await VeterinaryService.getCitasVet(vetId);

      if (response?.pendientes) {
        const today = new Date();
        const oneWeekFromNow = new Date();
        oneWeekFromNow.setDate(today.getDate() + 7);

        // Filtros combinados
        const todayAndWeekFiltered = response.pendientes
          .filter((appointment) => {
            const appointmentDate = new Date(appointment.date);
            return (
              appointmentDate.toDateString() === today.toDateString() || // Citas de hoy
              (appointmentDate > today && appointmentDate <= oneWeekFromNow) // Próximas dentro de una semana
            );
          })
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Ordenar por fecha ascendente

        const laterFiltered = response.pendientes
          .filter((appointment) => {
            const appointmentDate = new Date(appointment.date);
            return appointmentDate > oneWeekFromNow;
          })
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Ordenar por fecha ascendente

        setTodayAndWeekAppointments(todayAndWeekFiltered);
        setLaterAppointments(laterFiltered);

        // Combina todas las citas y ordénalas
        const allAppointmentsSorted = [...response.pendientes].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        setAllAppointments(allAppointmentsSorted);
      }

      setAppointments(response);
    } catch (error) {
      console.error("Error loading appointments:", error);
      Alert.alert("Error", "No se pudieron cargar las citas");
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
      Alert.alert("Éxito", "Cita marcada como completada");
      loadAppointments();
    } catch (error) {
      Alert.alert("Error", "No se pudo completar la cita");
    }
  };

  const handleCancel = async (appointmentId: number) => {
    try {
      await VeterinaryService.cancelarCita(appointmentId);
      Alert.alert("Éxito", "Cita cancelada");
      loadAppointments();
    } catch (error) {
      Alert.alert("Error", "No se pudo cancelar la cita");
    }
  };

  const handlePressDetails = (appointment: Pendiente) => {
    setSelectedAppointment(appointment);
    setModalVisible(true);
  };

  const screenWidth = Dimensions.get("window").width;

  if (loading) {
    return <LoadingCat />;
  }

  return (
    <ScrollView contentContainerStyle={{ paddingVertical: 20, paddingHorizontal: 16 }}>
      <Text
        
        style={{
          fontSize: 25,
          fontFamily: Fonts.PoppinsBold,
          textAlign: "left",
          marginBottom: 20,
          marginTop: 80
        }}
      >
        Pending appointments
      </Text>

      {/* Sección 1: Hoy y Próximas dentro de una semana */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontFamily: Fonts.PoppinsBold, fontSize: FontSize.medium, marginBottom: 8 }}>
          Appointments Today and Within a Week
        </Text>
        {todayAndWeekAppointments.length > 1 && (
          <Text style={{ alignSelf: "flex-end", fontSize: FontSize.small, color: "gray" }}>
            Swipe →
          </Text>
        )}
        <FlatList
          data={todayAndWeekAppointments}
          renderItem={({ item }) => (
            <View
              style={{
                width: screenWidth * 0.9,
                marginRight: screenWidth * 0.05,
                height: 200,
              }}
            >
              <CardAppointment
                item={item}
                onComplete={handleComplete}
                onCancel={handleCancel}
                onPressDetails={handlePressDetails}
              />
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={<Text>No appointments today or within a week</Text>}
          contentContainerStyle={{ paddingVertical: 10 }}
        />
      </View>

      {/* Sección 2: Después de una semana */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontFamily: Fonts.PoppinsBold, fontSize: FontSize.medium, marginBottom: 10 }}>
          Later Appointments
        </Text>
        {laterAppointments.length > 1 && (
          <Text style={{ alignSelf: "flex-end", fontSize: FontSize.small, color: "gray" }}>
            Swipe →
          </Text>
        )}
        <FlatList
          data={laterAppointments}
          renderItem={({ item }) => (
            <View
              style={{
                width: screenWidth * 0.9,
                marginRight: screenWidth * 0.05,
                height: 200,
              }}
            >
              <CardAppointment
                item={item}
                onComplete={handleComplete}
                onCancel={handleCancel}
                onPressDetails={handlePressDetails}
              />
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={<Text>No appointments later</Text>}
          contentContainerStyle={{ paddingVertical: 10 }}
        />
      </View>

      {/* Sección 3: Todas las citas */}
      <View>
        <Text style={{ fontFamily: Fonts.PoppinsBold, fontSize: FontSize.medium, marginBottom: 10 }}>
          All Appointments
        </Text>
        <FlatList
          data={allAppointments}
          renderItem={({ item }) => (
            <View
              style={{
                width: "100%",
                marginBottom: 10,
                height: 150,
              }}
            >
              <CardAppointment
                item={item}
                onComplete={handleComplete}
                onCancel={handleCancel}
                onPressDetails={handlePressDetails}
              />
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text>No appointments available</Text>}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>

      <AppointmentDetailModal
        visible={modalVisible}
        appointment={selectedAppointment}
        onClose={() => {
          setModalVisible(false);
          setSelectedAppointment(null);
        }}
        onComplete={handleComplete}
        onCancel={handleCancel}
      />
    </ScrollView>
  );
};

export default Index;
