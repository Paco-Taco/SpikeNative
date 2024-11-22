import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Image, Text, View, Button } from 'react-native-ui-lib';
import { Ionicons } from '@expo/vector-icons';
import { ColorPalette } from '@/constants/Colors';
import { Pendiente } from '@/types/vetTypes.types';

interface CardAppointmentProps {
  item: Pendiente;
  onComplete: (id: number) => void;
  onCancel: (id: number) => void;
  onPressDetails: (appointment: Pendiente) => void;
}

const CardAppointment = ({ item, onComplete, onCancel, onPressDetails }: CardAppointmentProps) => {
  const formattedDate = new Date(item.date).toLocaleDateString();
  
  return (
    <Card
      marginV-10
      padding-20
      borderRadius={10}
      backgroundColor={'white'}
      style={styles.cardStyles}
      onPress={() => onPressDetails(item)}
    >
      <Image
        source={{ uri: item.pet.img }}
        style={{ height: 110, width: '30%', borderRadius: 10 }}
      />

      <View style={styles.infoAreaStyles}>
        <Text text60 marginB-5 color={ColorPalette.mediumDark}>
          {item.pet.name}
        </Text>

        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={14} color={ColorPalette.yellowPalette} />
          <Text text70 color={ColorPalette.medium} marginL-10>
            {formattedDate}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={14} color={ColorPalette.green} />
          <Text text80 color={ColorPalette.medium} marginL-10>
            {item.hour.hour} - {item.hour.day}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            label="Completar"
            size="small"
            backgroundColor={ColorPalette.green}
            onPress={() => onComplete(item.id)}
          />
          <Button
            label="Cancelar"
            size="small"
            backgroundColor={ColorPalette.redPalette}
            marginL-10
            onPress={() => onCancel(item.id)}
          />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  cardStyles: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoAreaStyles: {
    flex: 1,
    marginLeft: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
});

export default CardAppointment;