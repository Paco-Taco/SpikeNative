import React, { useEffect, useState } from "react";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Card, Text, Button, Image } from "react-native-ui-lib";
import { FlatList } from "react-native";
import { ColorPalette } from "@/constants/Colors";
import { useUserStore } from "@/stores/user.store";
import { Veterinary } from "@/types/userTypes.types";
import CardVeterinary from "@/components/CardVeterinary";

const Index = () => {
  const { getVets } = useUserStore((state) => state);
  const [veterinaryClinics, setVeterinaryClinics] = useState<Veterinary[]>([]);

  const renderItem = ({ item }: { item: Veterinary }) => (
    <CardVeterinary item={item} />
  );

  useEffect(() => {
    const fetchVets = async () => {
      const result = await getVets();
      setVeterinaryClinics(result ? result.veterinaries : []);
    };
    fetchVets();
  }, []);

  return (
    <View
      flex
      marginT-100
      backgroundColor={ColorPalette.graphitePalette}
      // useSafeArea
    >
      <View paddingH-20>
        <FlatList
          data={veterinaryClinics}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
        {/* <Link href={"/petRegister"} asChild>
        <Button label="Pet register" />
      </Link> */}
      </View>
    </View>
  );
};

export default Index;
