import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Alert,
  FlatList,
  Platform,
  ToastAndroid,
  Modal,
} from "react-native";
import { View, Text, Colors, Button, TextField } from "react-native-ui-lib";
import { useLoginStore } from "@/stores/login.store";
import { VeterinaryService } from "@/services/vetServices";
import { CitasVet, Pendiente } from "@/types/vetTypes.types";
import CardAppointment from "@/components/CardAppointment";
import AppointmentDetailModal from "@/components/AppointmentDetailModal";
import LoadingCat from "@/components/shared/LoadingCat";
import FontSize from "@/constants/FontSize";
import { Fonts } from "@/constants/Fonts";
import { SafeAreaView } from "react-native-safe-area-context";
import { ColorPalette } from "@/constants/Colors";

const Index = () => {
  const { dataLogin } = useLoginStore((state) => state);
  const [appointments, setAppointments] = useState<CitasVet | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Pendiente | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [todayAndWeekAppointments, setTodayAndWeekAppointments] = useState<
    Pendiente[]
  >([]);
  const [laterAppointments, setLaterAppointments] = useState<Pendiente[]>([]);
  const [allAppointments, setAllAppointments] = useState<Pendiente[]>([]);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [appointmentId, setAppointmentId] = useState<number | null>(null);

  const screenWidth = Dimensions.get("window").width;

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const vetId = dataLogin?.user.vetId;
      const response = await VeterinaryService.getCitasVet(vetId);

      if (response?.pendientes) {
        const today = new Date();
        const oneWeekFromNow = new Date();
        oneWeekFromNow.setDate(today.getDate() + 7);

        const todayAndWeekFiltered = response.pendientes.filter(
          (appointment) => {
            const appointmentDate = new Date(appointment.date);
            return (
              appointmentDate.toDateString() === today.toDateString() || // Hoy
              (appointmentDate > today && appointmentDate <= oneWeekFromNow) // Próximas dentro de una semana
            );
          }
        );

        const laterFiltered = response.pendientes.filter((appointment) => {
          const appointmentDate = new Date(appointment.date);
          return appointmentDate > oneWeekFromNow;
        });

        setTodayAndWeekAppointments(todayAndWeekFiltered);
        setLaterAppointments(laterFiltered);
        setAllAppointments(response.pendientes);
      }
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

  const showToastWithGravity = (message: string) => {
    ToastAndroid.showWithGravity(
      message,
      ToastAndroid.LONG,
      ToastAndroid.CENTER
    );
  };

  const handleComplete = async (appointmentId: number) => {
    try {
      await VeterinaryService.marcarCitaCompletada(appointmentId);
      Platform.OS === "android"
        ? showToastWithGravity("Appointment marked as completed")
        : Alert.alert("Success", "Appointment marked as completed");
      loadAppointments();
    } catch (error) {
      Platform.OS === "android"
        ? showToastWithGravity("Could not mark appointment as completed")
        : Alert.alert("Error", "Could not mark appointment as completed");
    }
  };

  const handleCancel = async (appointmentId: number, razon: string) => {
    try {
      setIsCancelModalVisible(false);
      setIsLoading(true);
      await VeterinaryService.cancelarCita(appointmentId, razon);
      Platform.OS === "android"
        ? showToastWithGravity("Appointment canceled")
        : Alert.alert("Success", "Appointment canceled");
      loadAppointments();
    } catch (error) {
      Platform.OS === "android"
        ? showToastWithGravity(`Error: ${error}`)
        : Alert.alert("Error", "Could not cancel appointment");
    } finally {
      setIsLoading(false);
      setIsCancelModalVisible(false);
    }
  };

  const beforeUserCancels = (appointmentId: number | null, cancelReason: string) => {
    return (
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
              Please, tell us why you want to cancel this appointment.
            </Text>
          </View>
          <View marginB-20 padding-20 width={"100%"}>
            <TextField
              placeholder="Reason (10 characters minimum)"
              value={cancelReason}
              style={{ width: "100%", fontFamily: Fonts.PoppinsRegular }}
              containerStyle={{
                borderWidth: 1,
                borderColor: Colors.grey40,
                borderRadius: 5,
                minHeight: 100,
              }}
              padding-10
              multiline
              numberOfLines={3}
              showCharacterCounter
              onChangeText={(text) => setCancelReason(text)}
              maxLength={100}
            />
          </View>
          <View row style={{ width: "100%", justifyContent: "space-evenly" }}>
            <Button
              label="Close"
              labelStyle={{ fontFamily: Fonts.PoppinsMedium }}
              backgroundColor={ColorPalette.bluePalette}
              onPress={() => {
                setIsCancelling(false);
                setIsCancelModalVisible(false);
              }}
            />
            <Button
              disabled={cancelReason.length < 10}
              label="Cancel anyway"
              labelStyle={{
                fontFamily: Fonts.PoppinsMedium,
                color: cancelReason.length < 10 ? Colors.grey40 : Colors.red10,
              }}
              style={{ backgroundColor: "transparent" }}
              onPress={() => {
                handleCancel(appointmentId, cancelReason);
                setIsCancelModalVisible(false);
              }}
            />
          </View>
        </View>
      </View>
    );
  };

  const handlePressDetails = (appointment: Pendiente) => {
    setSelectedAppointment(appointment);
    setModalVisible(true);
  };

  const handleOpenCancelModal = (appointment: Pendiente) => {
    setAppointmentId(appointment.id);
    setCancelReason("");
    setIsCancelModalVisible(true);
  };

  if (loading) {
    return <LoadingCat />;
  }

  return (
    <View
      style={{ flex: 1, marginTop: Platform.OS === "android" ? "30%" : "25%" }}
    >
      <Modal
        animationType="fade"
        transparent={true}
        visible={isCancelModalVisible}
        onRequestClose={() => setIsCancelModalVisible(false)}
      >
        {!isCancelling ? (
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
                  Are you completely sure you want to cancel this appointment?
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
              <View
                row
                style={{ width: "100%", justifyContent: "space-evenly" }}
              >
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
                    // setIsCancelModalVisible(false);
                    setIsCancelling(true);
                  }}
                />
              </View>
            </View>
          </View>
        ) : (
          beforeUserCancels(appointmentId, cancelReason)
        )}
      </Modal>
      <Text
        center
        style={{ fontFamily: Fonts.PoppinsBold, fontSize: FontSize.large }}
        marginB-25
      >
        Pending appointments
      </Text>
      <FlatList
        style={{ paddingHorizontal: 20 }}
        data={[{ id: 1 }, { id: 2 }, { id: 3 }]} // Solo un índice para cada sección
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          switch (item.id) {
            case 1: // Hoy y dentro de una semana
              return (
                <View style={{ marginBottom: 20 }}>
                  <View row style={{ justifyContent: "space-between" }}>
                    <Text
                      style={{
                        fontFamily: Fonts.PoppinsBold,
                        fontSize: FontSize.medium,
                        marginBottom: 8,
                      }}
                    >
                      Today and Within a Week
                    </Text>
                    {todayAndWeekAppointments.length > 1 && (
                      <Text
                        style={{
                          fontSize: FontSize.small,
                          color: "gray",
                        }}
                      >
                        Swipe →
                      </Text>
                    )}
                  </View>
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
                          // onCancel={handleCancel}
                          onPressDetails={handlePressDetails}
                        />
                      </View>
                    )}
                    keyExtractor={(appointment) => appointment.id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    ListEmptyComponent={
                      <Text center light color={Colors.grey30}>
                        No appointments today or within a week
                      </Text>
                    }
                  />
                </View>
              );
            case 2: // Más tarde
              return (
                <View style={{ marginBottom: 20 }}>
                  <View row style={{ justifyContent: "space-between" }}>
                    <Text
                      style={{
                        fontFamily: Fonts.PoppinsBold,
                        fontSize: FontSize.medium,
                        marginBottom: 8,
                      }}
                    >
                      Later
                    </Text>
                    {laterAppointments.length > 1 && (
                      <Text
                        style={{
                          fontSize: FontSize.small,
                          color: "gray",
                        }}
                      >
                        Swipe →
                      </Text>
                    )}
                  </View>

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
                          // onCancel={handleCancel}
                          onPressDetails={handlePressDetails}
                        />
                      </View>
                    )}
                    keyExtractor={(appointment) => appointment.id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    ListEmptyComponent={
                      <Text center light color={Colors.grey30}>
                        No appointments later
                      </Text>
                    }
                    contentContainerStyle={{ paddingBottom: 10 }}
                  />
                </View>
              );
            case 3: // Todas las citas (vertical)
              return (
                <View style={{ marginBottom: 20 }}>
                  <Text
                    style={{
                      fontFamily: Fonts.PoppinsBold,
                      fontSize: FontSize.medium,
                      marginBottom: 8,
                    }}
                  >
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
                          // onCancel={handleCancel}
                          onPressDetails={handlePressDetails}
                        />
                      </View>
                    )}
                    keyExtractor={(appointment) => appointment.id.toString()}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<Text>No appointments available</Text>}
                    contentContainerStyle={{ paddingBottom: 20 }}
                  />
                </View>
              );
          }
        }}
        ListFooterComponent={
          <AppointmentDetailModal
            visible={modalVisible}
            appointment={selectedAppointment}
            onClose={() => {
              setModalVisible(false);
              setSelectedAppointment(null);
            }}
            onComplete={handleComplete}
            onCancel={handleOpenCancelModal}
          />
        }
      />
    </View>
  );
};

export default Index;
