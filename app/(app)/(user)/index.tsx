import React, { useEffect, useState } from "react";
import { Link } from "expo-router";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Card, Text, Button, Image, Dialog } from "react-native-ui-lib";
import { FlatList } from "react-native";
import { ColorPalette } from "@/constants/Colors";
import { useUserStore } from "@/stores/user.store";
import { axiosInstanceSpikeCore } from "@/controllers/SpikeApiCore";
import { useLoginStore } from "@/stores/login.store";
import { Veterinary } from "@/types/userTypes.types";
import CardVeterinary from "@/components/CardVeterinary";

const Index = () => {
  const { getVets } = useUserStore((state) => state);
  const { dataLogin } = useLoginStore((state) => state);
  const idOwner = dataLogin?.user.id;
  
  const [veterinaryClinics, setVeterinaryClinics] = useState<Veterinary[]>([]);
  const [pets, setPets] = useState([]); 
  const [showModal, setShowModal] = useState(false);

  const renderItem = ({ item }: { item: Veterinary }) => (
    <CardVeterinary item={item} />
  );

  useEffect(() => {
    const fetchVets = async () => {
      const result = await getVets();
      setVeterinaryClinics(result ? result.veterinaries : []);
    };

    const fetchPets = async () => {
      try {
        const response = await axiosInstanceSpikeCore.get(`/getpets/${idOwner}`);
        const petsData = response.data || [];
        setPets(petsData);
        
        if (petsData.length === 0) {
          setShowModal(true);
        }
      } catch (error) {
        console.error("Error al obtener mascotas:", error);
      }
    };

    fetchVets();
    fetchPets();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: ColorPalette.graphitePalette, paddingTop: 100 }}>
      <View paddingH-20 flex>
        <FlatList
          data={veterinaryClinics}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>

      {/* Modal para registrar la primera mascota */}
      <Dialog
        visible={showModal}
        onDismiss={() => setShowModal(false)}
        style={{
          backgroundColor: ColorPalette.medium, 
          padding: 20,
          borderRadius: 8,
          opacity: 1, 
        }}
        overlayBackgroundColor="rgba(0, 0, 0, 0.7)" 
      >
        <Text text60 marginB-20 color={ColorPalette.light}>
          Registra tu primer mascota
        </Text>
        <Text marginB-20 color={ColorPalette.lightGrey}>
          Aún no tienes mascotas registradas. Registra tu primera mascota para empezar.
        </Text>
        <View row spread marginT-10>
          <Button
            label="Omitir"
            onPress={() => setShowModal(false)}
            backgroundColor={ColorPalette.grey}
          />
          <Button
            label="Registrar Mascota"
            onPress={() => {
              setShowModal(false);
              router.push("/petRegister");
            }}
            backgroundColor={ColorPalette.lightGrey}
          />
        </View>
      </Dialog>
    </SafeAreaView>
  );
};

export default Index;
