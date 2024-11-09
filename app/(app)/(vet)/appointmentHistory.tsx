import { View, Text, FlatList, ActivityIndicator, Button, Alert, StyleSheet, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useLoginStore } from "@/stores/login.store";
import { VeterinaryService } from "@/services/vetServices";

const Appointment = () => {
  const { dataLogin } = useLoginStore((state) => state);
  const [citas, setCitas] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadCitas = async () => {
    try {
      const vetId = dataLogin?.user.vetId;
      const response = await VeterinaryService.getCitasVet(vetId);
      setCitas(response);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar las citas:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCitas();
  }, []);

  // Función para visualizar detalles de la cita
  const visualizarCita = (cita: any) => {
    const genderText = cita.pet.gender === "0" ? "Masculino" : "Femenino";
    const heightText = ["Pequeño", "Mediano", "Grande", "Gigante"][parseInt(cita.pet.height) - 1];
    const animalText = ["Perro", "Gato", "Conejo", "Aves", "Reptiles", "Otros"][parseInt(cita.pet.animal) - 1];

    Alert.alert(
        "Detalles de la Cita",
        `Dueño: ${cita.pet.ownerId} 
        \nMascota: ${cita.pet.name}
        \nEdad: ${cita.pet.age}
        \nGénero: ${genderText}
        \nAnimal: ${animalText}
        \nPeso: ${cita.pet.weight} kg
        \nAltura: ${heightText}
        \nFecha: ${new Date(cita.date).toLocaleDateString()}
        \nHora: ${cita.hour.hour} - Día: ${cita.hour.day}
        \nEstado: ${cita.done ? "Completada" : "Pendiente"}`
    );
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

  const renderCita = ({ item }: { item: any }) => (
    <View style={styles.citaContainer}>
      <Text style={styles.boldText}>Mascota: {item.pet.name}</Text>
      <Text>Fecha: {new Date(item.date).toLocaleDateString()}</Text>
      <Text>Hora: {item.hour.hour} - Día: {item.hour.day}</Text>
      <Text>Estado: {item.done ? "Completada" : "Pendiente"}</Text>
  
      {/* Imagen de la mascota */}
      <Image source={{ uri: item.pet.img }} style={styles.petImage} />
  
      <Button title="Ver detalles" onPress={() => visualizarCita(item)} />
  
      {/* Botón para marcar como completada */}
      {!item.done && (
        <Button title="Marcar como Completada" onPress={() => completarCita(item.id)} />
      )}
  
      {/* Mostrar botón de Cancelar solo si la cita está pendiente */}
      {!item.done && (
        <Button title="Cancelar Cita" onPress={() => cancelarCita(item.id)} />
      )}
    </View>
  );
  

  return (
    <View style={styles.container}>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text style={styles.sectionTitle}>Citas Pendientes:</Text>
          <FlatList
            data={citas?.pendientes}
            renderItem={renderCita}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={<Text>No hay citas pendientes.</Text>}
          />

          <Text style={styles.sectionTitle}>Citas Completadas:</Text>
          <FlatList
            data={citas?.completadas}
            renderItem={renderCita}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={<Text>No hay citas completadas.</Text>}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
    width: 100,
    height: 100,
    marginVertical: 10,
  },
});

export default Appointment;
