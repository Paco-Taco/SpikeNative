import React, { useEffect, useState } from "react";
import { View, Text } from "react-native-ui-lib";
import { FlatList, StatusBar } from "react-native";
import { useLoginStore } from "@/stores/login.store";
import { VeterinaryService } from "@/services/vetServices";
import { CitasVet, Pendiente } from "@/types/vetTypes.types";
import CardAppointment from "@/components/CardAppointment";
import AppointmentDetailModal from "@/components/AppointmentDetailModal";
import { Alert } from "react-native";
import LottieView from "lottie-react-native";
import { Fonts } from "@/constants/Fonts";
import { ColorPalette } from "@/constants/Colors";
import LoadingCat from "@/components/shared/LoadingCat";
import FontSize from "@/constants/FontSize";
import { RefreshControl } from "react-native-gesture-handler";

const Index = () => {
  const { dataLogin } = useLoginStore((state) => state);
  const [appointments, setAppointments] = useState<CitasVet | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Pendiente | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const vetId = dataLogin?.user.vetId;
      const response = await VeterinaryService.getCitasVet(vetId);
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

  const onRefresh = () => {
    loadAppointments();
  }

  if (loading) {
    return <LoadingCat />;
  }

  return (
    <View flex paddingH-20 style={{ paddingTop: "30%" }}>
      <Text
        marginB-20
        style={{
          fontSize: 25,
          fontFamily: Fonts.PoppinsBold,
          textAlign: "center",
        }}
      >
        Pending Appointments
      </Text>
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
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text
            style={{
              fontFamily: Fonts.PoppinsMedium,
              fontSize: FontSize.large,
            }}
            center
            marginT-60
          >
            No pending appointments
          </Text>
        }
        refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
      />

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
    </View>
  );
};

export default Index;
