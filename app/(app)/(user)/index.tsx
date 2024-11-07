import React, { useEffect } from "react";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Card, Text, Button } from "react-native-ui-lib";
import { FlatList } from "react-native";
import { ColorPalette } from "@/constants/Colors";
import { useUserStore } from "@/stores/user.store";

const veterinaryClinics = [
  {
    id: "1",
    name: "Veterinaria San Paws",
    address: "123 Calle Feliz",
    contact: "555-1234",
  },
  {
    id: "2",
    name: "Clínica Animalia",
    address: "456 Avenida Verde",
    contact: "555-5678",
  },
  {
    id: "3",
    name: "Pets Care Center",
    address: "789 Camino Salud",
    contact: "555-9876",
  },
  {
    id: "4",
    name: "Amigos Peludos",
    address: "101 Parque Norte",
    contact: "555-3456",
  },
  {
    id: "5",
    name: "Huellas Felices",
    address: "202 Zona Central",
    contact: "555-6543",
  },
];

const Index = () => {
  const {getVets} = useUserStore(state => state)

  const renderItem = ({ item }) => (
    <Card
      marginV-10
      padding-20
      borderRadius={10}
      backgroundColor={ColorPalette.lightGraphite}
    >
      <Text text50 color={ColorPalette.grey}>
        {item.name}
      </Text>
      <Text text70 color={ColorPalette.grey}>
        {item.address}
      </Text>
      <Text text80 color={ColorPalette.grey}>
        {item.contact}
      </Text>
      {/* <Link href={`/veterinaryDetails/${item.id}`} asChild> */}
      <Button
        label="Ver detalles"
        marginT-10
        backgroundColor={ColorPalette.bluePalette}
      />
      {/* </Link> */}
    </Card>
  );

  useEffect(() => {
    const fetchVets = async () => {
      const result = await getVets()
      console.log('Resultado useEffect: ',result)
    }
    fetchVets()
  }, [])

  return (
    <View
      flex
      useSafeArea
      paddingT-120
      paddingH-20
      backgroundColor={ColorPalette.graphitePalette}
    >
      {/* <Text text40 marginB-20>
        Veterinarias
      </Text> */}
      <FlatList
        data={veterinaryClinics}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      <Link href={"/petRegister"} asChild>
        <Button label="Pet register" />
      </Link>
    </View>
  );
};

export default Index;
