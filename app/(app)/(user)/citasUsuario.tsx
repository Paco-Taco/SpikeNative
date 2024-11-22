import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, Button, Alert } from 'react-native';
import { axiosInstanceSpikeCore } from '@/controllers/SpikeApiCore';
import { useLoginStore } from "@/stores/login.store";
import { useRouter } from "expo-router";


const UserAppointments = () => {
  const { dataLogin } = useLoginStore((state) => state);
  const { user } = dataLogin || {};
  const router = useRouter();
  const [appointments, setAppointments] = useState({ pendientes: [], completadas: [] });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch appointments for the current user
  const fetchAppointments = async () => {
    if (!user?.id) return;

    try {
        setLoading(true);
        const { data } = await axiosInstanceSpikeCore.post('/citasUsuario', { ownerId: user.id });

        if (data?.pendientes && data?.completadas) {
            setAppointments({
                pendientes: data.pendientes,
                completadas: data.completadas
            });
        } else {
            console.error('Unexpected response structure:', data);
            setAppointments({ pendientes: [], completadas: [] });
        }
    } catch (error) {
        console.error('Error fetching appointments:', error);
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

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const response = await axiosInstanceSpikeCore.post('/cancelarCita', {
        appointmentId: appointmentId,
      });
  
      Alert.alert("Éxito", "Cita cancelada correctamente", [
        { text: "OK", onPress: () => router.push("/(app)/(user)/") }
      ]);
    } catch (error) {
      console.error("Error al cancelar cita", error);
      Alert.alert("Error", error.response?.data?.error || "La cita solo se puede cancelar con al menos 3 días de anticipación");
    }
  };

  const renderAppointment = ({ item }) => (
    <View style={styles.appointmentCard}>
      <Text style={styles.appointmentText}>Mascota: {item.pet?.name || "Desconocido"}</Text>
      <Text style={styles.appointmentText}>
        Fecha: {item.date ? new Date(item.date).toLocaleDateString() : "Sin fecha"}
      </Text>
      <Text style={styles.appointmentText}>Hora: {item.hour?.hour || "Sin hora"}</Text>
      <Text style={styles.appointmentText}>
        Veterinaria: {item.veterinary?.veterinarieName || "Sin información"}
      </Text>
      <View style={styles.buttonsContainer}>
      <Button 
        title="Cancelar cita" 
        onPress={() => handleCancelAppointment(item.id)}
        color="red"
      />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <FlatList
          data={appointments.pendientes}
          renderItem={renderAppointment}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListHeaderComponent={<Text style={styles.header}>Citas Pendientes</Text>}
          ListFooterComponent={
            appointments.completadas.length > 0 && (
              <>
                <Text style={styles.header}>Citas Completadas</Text>
                {appointments.completadas.map((cita) => (
                  <View key={cita.id} style={styles.appointmentCard}>
                    <Text style={styles.appointmentText}>
                      Mascota: {cita.pet?.name || "Desconocido"}
                    </Text>
                    <Text style={styles.appointmentText}>
                      Fecha: {cita.date ? new Date(cita.date).toLocaleDateString() : "Sin fecha"}
                    </Text>
                    <Text style={styles.appointmentText}>Hora: {cita.hour?.hour || "Sin hora"}</Text>
                    <Text style={styles.appointmentText}>
                      Veterinaria: {cita.veterinary?.veterinarieName || "Sin información"}
                    </Text>
                  </View>
                ))}
              </>
            )
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    padding: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  appointmentCard: {
    backgroundColor: '#FFF',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  appointmentText: {
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default UserAppointments;
