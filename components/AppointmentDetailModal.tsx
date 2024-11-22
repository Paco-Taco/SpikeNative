import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, Card, Button, Modal, Image } from 'react-native-ui-lib';
import { Ionicons } from '@expo/vector-icons';
import { ColorPalette } from '@/constants/Colors';
import { Pendiente } from '@/types/vetTypes.types';

interface AppointmentDetailModalProps {
  visible: boolean;
  appointment: Pendiente | null;
  onClose: () => void;
  onComplete: (id: number) => void;
  onCancel: (id: number) => void;
}

const AppointmentDetailModal = ({
  visible,
  appointment,
  onClose,
  onComplete,
  onCancel,
}: AppointmentDetailModalProps) => {
  if (!appointment) return null;

  const genderText = appointment.pet.gender === "0" ? "Masculino" : "Femenino";
  const heightText = ["Pequeño", "Mediano", "Grande", "Gigante"][
    parseInt(appointment.pet.height) - 1
  ];
  const animalText = ["Perro", "Gato", "Conejo", "Aves", "Reptiles", "Otros"][
    parseInt(appointment.pet.animal) - 1
  ];

  return (
    <Modal
      visible={visible}
      onBackgroundPress={onClose}
      animationType='fade'
      overlayBackgroundColor='rgba(0, 0, 0, 0.5)'
      transparent
    >
      <View flex center padding-20>
        <Card  width="100%" padding-20 borderRadius={10}>
          <View row spread>
            <Text text50 color={ColorPalette.mediumDark}>
              Detalles de la Cita
            </Text>
            <Button
              link
              iconSource={() => (
                <Ionicons name="close" size={24} color={ColorPalette.mediumDark} />
              )}
              onPress={onClose}
            />
          </View>

          <View row marginT-20>
            <Image
              source={{ uri: appointment.pet.img }}
              style={styles.petImage}
            />
            <View marginL-20 flex>
              <Text text60 color={ColorPalette.mediumDark}>
                {appointment.pet.name}
              </Text>
              <View row centerV marginT-5>
                <Ionicons name="calendar-outline" size={16} color={ColorPalette.yellowPalette} />
                <Text text70 color={ColorPalette.medium} marginL-5>
                  {new Date(appointment.date).toLocaleDateString()}
                </Text>
              </View>
              <View row centerV marginT-5>
                <Ionicons name="time-outline" size={16} color={ColorPalette.green} />
                <Text text70 color={ColorPalette.medium} marginL-5>
                  {appointment.hour.hour} - {appointment.hour.day}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.detailsContainer}>
            <DetailRow icon="paw-outline" label="Animal" value={animalText} />
            <DetailRow icon="male-female-outline" label="Género" value={genderText} />
            <DetailRow icon="calendar-outline" label="Edad" value={`${appointment.pet.age} años`} />
            <DetailRow icon="scale-outline" label="Peso" value={`${appointment.pet.weight} kg`} />
            <DetailRow icon="resize-outline" label="Tamaño" value={heightText} />
          </View>

          <View row spread marginT-20>
            <Button
              label="Cancelar Cita"
              backgroundColor={ColorPalette.redPalette}
              size={Button.sizes.medium}
              style={styles.button}
              onPress={() => {
                onCancel(appointment.id);
                onClose();
              }}
            />
            <Button
              label="Completar Cita"
              backgroundColor={ColorPalette.green}
              size={Button.sizes.medium}
              style={styles.button}
              onPress={() => {
                onComplete(appointment.id);
                onClose();
              }}
            />
          </View>
        </Card>
      </View>
    </Modal>
  );
};

const DetailRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <View row centerV marginB-10>
    <Ionicons name={icon} size={16} color={ColorPalette.mediumDark} />
    <Text text70 color={ColorPalette.medium} marginL-5 marginR-5>
      {label}:
    </Text>
    <Text text70 color={ColorPalette.mediumDark}>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  petImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  detailsContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: ColorPalette.offWhite,
    borderRadius: 10,
  },
  button: {
    flex: 0.48,
  },
});

export default AppointmentDetailModal;