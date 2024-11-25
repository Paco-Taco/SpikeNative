import NewPetModal from "@/components/user/NewPetModal";
import { ColorPalette } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { VeterinaryService } from "@/services/vetServices";
import { useLoginStore } from "@/stores/login.store";
import { CitasVet } from "@/types/vetTypes.types";
import { Link, Redirect, router } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, StatusBar, StyleSheet } from "react-native";
import {
  View,
  Text,
  TabController,
  Colors,
  Image,
  Button,
  ListItem,
  AnimatedImage,
  LoaderScreen,
} from "react-native-ui-lib";

const AppointmentHistory = () => {
  const { dataLogin } = useLoginStore((state) => state);
  const [citas, setCitas] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadCitas = async () => {
    try {
      setLoading(true);
      const vetId = dataLogin?.user.vetId;
      const response = await VeterinaryService.getCitasVet(vetId);
      setCitas(response);
    } catch (error) {
      console.error("Error al cargar las citas:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCitas();
  }, []);

  // Función para visualizar detalles de la cita
  const visualizarCita = (cita: any) => {
    // console.log(cita);
    const genderText = cita.pet.gender === "0" ? "Male" : "Female";
    const heightText = ["Small", "Medium", "Big", "Very big"][
      parseInt(cita.pet.height) - 1
    ];
    const animalText = ["Dog", "Cat", "Rabbit", "Bird", "Reptile", "Other"][
      parseInt(cita.pet.animal) - 1
    ];
    const status = cita.done ? "Completed" : "Pending";

    router.push({
      pathname: "/appointmentDetails",
      params: {
        owner: `${cita.user.firstName} ${cita.user.lastName}`,
        petImg: cita.pet.img,
        petname: cita.pet.name,
        age: cita.pet.age,
        weight: cita.pet.weight,
        date: new Date(cita.date).toLocaleDateString(),
        hour: cita.hour.hour,
        day: cita.hour.day,
        status: status,
        isDone: cita.done,
        genderText,
        heightText,
        animalText,
      },
    });
  };

  // Función para marcar cita como completada
  const completarCita = async (appointmentId: number) => {
    try {
      await VeterinaryService.marcarCitaCompletada(appointmentId);
      Alert.alert("Cita marcada como completada");
      loadCitas();
    } catch (error) {
      Alert.alert("Error al marcar la cita como completada");
    }
  };

  // Función para cancelar la cita
  const cancelarCita = async (appointmentId: number) => {
    try {
      await VeterinaryService.cancelarCita(appointmentId);
      Alert.alert("Cita cancelada");
      loadCitas();
    } catch (error) {
      Alert.alert("Error al cancelar la cita");
    }
  };

  const renderCita = ({ item }: { item: any }) => {
    const statusColor = item.done ? "green" : "red";
    return (
      <View padding-10>
        <ListItem
          activeBackgroundColor={Colors.grey70}
          onPress={() => visualizarCita(item)}
          style={{ borderRadius: 10, backgroundColor: ColorPalette.white }}
          height={120}
        >
          <ListItem.Part left>
            <AnimatedImage
              source={{ uri: item.pet.img }}
              style={styles.petImage}
            />
          </ListItem.Part>
          <ListItem.Part middle column containerStyle={{ paddingRight: 20 }}>
            <ListItem.Part>
              <Text bold>{item.pet.name}</Text>
            </ListItem.Part>
            <ListItem.Part>
              <Text dark10 text80>
                {new Date(item.date).toLocaleDateString()}
              </Text>
            </ListItem.Part>
            <ListItem.Part>
              <Text dark10 text80>
                Hora: {item.hour.hour}
              </Text>
            </ListItem.Part>
            <ListItem.Part>
              <Text>Día: {item.hour.day}</Text>
            </ListItem.Part>
          </ListItem.Part>
          <ListItem.Part right containerStyle={{ paddingRight: 20 }}>
            <Text color={statusColor}>
              {item.done ? "Completed" : "Pending"}
            </Text>
          </ListItem.Part>
        </ListItem>
      </View>
    );
  };

  return (
    <View useSafeArea flex>
      {loading ? (
        <View flex center>
          <LottieView
            source={require("@/assets/lottie/LoadingCat.json")}
            autoPlay
            loop
            style={{ width: 100, height: 100 }}
          />
          <Text medium>Loading...</Text>
        </View>
      ) : (
        <View flex>
          <Text style={styles.sectionTitle}>Citas Completadas</Text>
          <FlatList
            data={citas?.completadas}
            renderItem={renderCita}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={<Text>No hay citas completadas.</Text>}
          />
        </View>
      )}
    </View>
  );
};

export default AppointmentHistory;

const styles = StyleSheet.create({
  labelStyle: {
    fontSize: 14,
    color: Colors.grey10,
  },
  selectedLabelStyle: {
    fontSize: 16,
    color: Colors.blue10,
  },
  sectionTitle: {
    fontSize: 28,
    paddingHorizontal: 20,
    fontFamily: Fonts.PoppinsBold,
    textAlign: "center",
    marginVertical: 40,
  },
  petImage: {
    marginHorizontal: 10,
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
  },
});
