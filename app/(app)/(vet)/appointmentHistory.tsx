import NewPetModal from "@/components/user/NewPetModal";
import { ColorPalette } from "@/constants/Colors";
import { VeterinaryService } from "@/services/vetServices";
import { useLoginStore } from "@/stores/login.store";
import { CitasVet } from "@/types/vetTypes.types";
import LottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet } from "react-native";
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
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [formattedAppointmentDetails, setformattedAppointmentDetails] =
    useState({});

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
    const genderText = cita.pet.gender === "0" ? "Masculino" : "Femenino";
    const heightText = ["Pequeño", "Mediano", "Grande", "Gigante"][
      parseInt(cita.pet.height) - 1
    ];
    const animalText = ["Perro", "Gato", "Conejo", "Aves", "Reptiles", "Otros"][
      parseInt(cita.pet.animal) - 1
    ];

    // Alert.alert(
    //   "Detalles de la Cita",
    //   `Dueño: ${cita.user.firstName} ${cita.user.lastName}
    //     \nMascota: ${cita.pet.name}
    //     \nEdad: ${cita.pet.age}
    //     \nGénero: ${genderText}
    //     \nAnimal: ${animalText}
    //     \nPeso: ${cita.pet.weight} kg
    //     \nAltura: ${heightText}
    //     \nFecha: ${new Date(cita.date).toLocaleDateString()}
    //     \nHora: ${cita.hour.hour} - Día: ${cita.hour.day}
    //     \nEstado: ${cita.done ? "Completada" : "Pendiente"}`
    // );
    setformattedAppointmentDetails({
      ...cita,
      genderText,
      heightText,
      animalText,
    });
    setDetailsModalVisible(true);
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
      // <View style={styles.citaContainer}>
      //   <Text style={styles.boldText}>Mascota: {item.pet.name}</Text>
      //   <Text>Fecha: {new Date(item.date).toLocaleDateString()}</Text>
      //   <Text>
      //     Hora: {item.hour.hour} - Día: {item.hour.day}
      //   </Text>
      //   <Text>Estado: {item.done ? "Completada" : "Pendiente"}</Text>

      //   {/* Imagen de la mascota */}
      //   <Image source={{ uri: item.pet.img }} style={styles.petImage} />

      //   <Button label="Ver detalles" onPress={() => visualizarCita(item)} />

      //   {/* Botón para marcar como completada */}
      //   {!item.done && (
      //     <Button
      //       label="Marcar como Completada"
      //       onPress={() => completarCita(item.id)}
      //     />
      //   )}

      //   {/* Mostrar botón de Cancelar solo si la cita está pendiente */}
      //   {!item.done && (
      //     <Button label="Cancelar Cita" onPress={() => cancelarCita(item.id)} />
      //   )}
      // </View>
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
              {item.done ? "Completada" : "Pendiente"}
            </Text>
          </ListItem.Part>
        </ListItem>
      </View>
    );
  };

  return (
    <View useSafeArea flex>
      {/* <TabController
        asCarousel
        initialIndex={0}
        items={[{ label: "Citas Pendientes", }, { label: "Citas Completadas" }]}
        useSafeArea
      >
        <TabController.TabBar
          spreadItems
          enableShadow
          labelStyle={styles.labelStyle}
          selectedLabelStyle={styles.selectedLabelStyle}
          activeBackgroundColor={Colors.blue30}
        />
        <TabController.PageCarousel>
          <TabController.TabPage index={0}>
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
                <Text style={styles.sectionTitle}>Citas Pendientes:</Text>
                <FlatList
                  data={citas?.pendientes}
                  renderItem={renderCita}
                  keyExtractor={(item) => item.id.toString()}
                  ListEmptyComponent={<Text>No hay citas pendientes.</Text>}
                />
              </View>
            )}
          </TabController.TabPage>
          <TabController.TabPage index={1}>
            <View flex>
              <Text style={styles.sectionTitle}>Citas Completadas:</Text>
              <FlatList
                data={citas?.completadas}
                renderItem={renderCita}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={<Text>No hay citas completadas.</Text>}
              />
            </View>
          </TabController.TabPage>
        </TabController.PageCarousel>
      </TabController> */}

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
          <Text style={styles.sectionTitle}>Citas Completadas:</Text>
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
  pageText: {
    fontSize: 18,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  citaContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  boldText: {
    fontWeight: "bold",
  },
  petImage: {
    marginHorizontal: 10,
    width: 100,
    height: 100,
    borderRadius: 10,
  },
});
