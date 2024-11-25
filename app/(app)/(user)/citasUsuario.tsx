import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Button,
  Alert,
} from "react-native";
import { axiosInstanceSpikeCore } from "@/controllers/SpikeApiCore";
import { useLoginStore } from "@/stores/login.store";
import { useRouter } from "expo-router";
import {
  Colors,
  View,
  Text,
  ListItem,
  AnimatedImage,
} from "react-native-ui-lib";
import { Fonts } from "@/constants/Fonts";
import LottieView from "lottie-react-native";
import { ColorPalette } from "@/constants/Colors";
import AbsoluteBackArrow from "@/components/shared/AbsoluteBackArrow";

const UserAppointments = () => {
  const { dataLogin } = useLoginStore((state) => state);
  const { user } = dataLogin || {};
  const router = useRouter();
  const [appointments, setAppointments] = useState({
    pendientes: [],
    completadas: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // console.log(appointments.pendientes)

  // Fetch appointments for the current user
  const fetchAppointments = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data } = await axiosInstanceSpikeCore.post("/citasUsuario", {
        ownerId: user.id,
      });

      if (data?.pendientes && data?.completadas) {
        setAppointments({
          pendientes: data.pendientes,
          completadas: data.completadas,
        });
      } else {
        console.error("Unexpected response structure:", data);
        setAppointments({ pendientes: [], completadas: [] });
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAppointments();
  };

  const formatToLocalDate = (date) => {
    const utcDate = new Date(date); // Crea el objeto de fecha en UTC
    const localDate = new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000); // Corrige a local
    return localDate.toLocaleDateString("en-GB"); // Formatea en formato DD/MM/YYYY
  };
  

  // Función para visualizar detalles de la cita
  const visualizarCita = (cita: any) => {
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
        vetCategory: cita.veterinary.category,
        appointmentId: cita.id,
        vetName: cita.veterinary.veterinarieName,
        vetAddress: `${cita.veterinary.street} ${cita.veterinary.number_int}, ${cita.veterinary.cologne}, ${cita.veterinary.city}`,
        vetImg: cita.veterinary.img,
        vetPhone: cita.veterinary.phone,
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

  const renderCita = ({ item }: { item: any }) => {
    const statusColor = item.done ? "green" : Colors.grey30;
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
              {formatToLocalDate(item.date)}

              </Text>
            </ListItem.Part>
            <ListItem.Part>
              <Text dark10 text80>
                Hour: {item.hour.hour}
              </Text>
            </ListItem.Part>
            <ListItem.Part>
              <Text>Day: {item.hour.day}</Text>
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
      <AbsoluteBackArrow color={Colors.grey30} />
      {loading ? (
        <View flex center>
          <LottieView
            source={require("@/assets/lottie/LoadingCat.json")}
            autoPlay
            loop
            style={{ width: 100, height: 100 }}
          />
          <Text medium>Cargando...</Text>
        </View>
      ) : (
        <View flex>
          <Text style={styles.sectionTitle}>Appointments</Text>
          <FlatList
            data={[...appointments.pendientes, ...appointments.completadas]}
            renderItem={renderCita}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={<Text>No hay citas completadas.</Text>}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </View>
      )}
    </View>
  );
};

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
    marginVertical: 50,
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

export default UserAppointments;
