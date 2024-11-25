import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  ScrollView,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import { View, Text, Image, Colors, LoaderScreen } from "react-native-ui-lib";
import { axiosInstanceSpikeCore } from "@/controllers/SpikeApiCore";
import { useLoginStore } from "@/stores/login.store";
import LoadingCat from "@/components/shared/LoadingCat";
import AbsoluteBackArrow from "@/components/shared/AbsoluteBackArrow";
import { Fonts } from "@/constants/Fonts";
import FontSize from "@/constants/FontSize";

const { width: screenWidth } = Dimensions.get("window");

const Conmemoraciones = () => {
  const { dataLogin } = useLoginStore((state) => state);
  const [deathPets, setDeathPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current; // Animación para las tarjetas
  const [hearts, setHearts] = useState([]); // Array para manejar corazones activos

  useEffect(() => {
    const fetchDeathPets = async () => {
      try {
        setLoading(true);
        const ownerId = dataLogin?.user?.id;
        const response = await axiosInstanceSpikeCore.get(
          `/deathpets/${ownerId}`
        );
        setDeathPets(response.data);
        fadeIn(); // Iniciar animación
      } catch (err) {
        console.error("Error fetching death pets:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (dataLogin?.user?.id) {
      fetchDeathPets();
    }
  }, [dataLogin?.user?.id]);

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const addHeart = () => {
    const heartId = Math.random().toString(); // Generar un ID único
    const startX = Math.random() * screenWidth; // Posición aleatoria en el ancho de la pantalla
    const animationValue = new Animated.Value(0);

    const newHeart = {
      id: heartId,
      x: startX,
      animation: animationValue,
    };

    setHearts((prevHearts) => [...prevHearts, newHeart]);

    Animated.timing(animationValue, {
      toValue: 1,
      duration: 7000, // 3 segundos para desaparecer
      useNativeDriver: true,
    }).start(() => {
      // Eliminar corazón después de que termine la animación
      setHearts((prevHearts) =>
        prevHearts.filter((heart) => heart.id !== heartId)
      );
    });
  };

  const renderHearts = () => {
    return hearts.map((heart) => {
      const heartPositionY = heart.animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -10000], // Suben 300px desde su posición inicial
      });

      const heartOpacity = heart.animation.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0], // Se desvanecen al subir
      });

      return (
        <Animated.View
          key={heart.id}
          style={{
            position: "absolute",
            left: heart.x, // Posición horizontal aleatoria
            bottom: 50, // Inicia desde la parte inferior
            transform: [{ translateY: heartPositionY }],
            opacity: heartOpacity,
          }}
        >
          <Text style={{ fontSize: 40, color: Colors.red30 }}>❤️</Text>
        </Animated.View>
      );
    });
  };

  if (loading) {
    return <LoadingCat />;
  }

  if (error) {
    return (
      <SafeAreaView
        style={{
          padding: 26,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <AbsoluteBackArrow color={Colors.grey30} />
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/194/194279.png",
          }}
          style={{
            width: 150,
            height: 150,
            marginBottom: 20,
            borderRadius: 75,
          }}
        />
        <Text
          center
          color={Colors.black}
          marginB-10
          style={{ fontSize: FontSize.xLarge, fontFamily: Fonts.PoppinsBold }}
        >
          Memorials
        </Text>
        <Text
          center
          style={{ fontSize: FontSize.medium, fontFamily: Fonts.PoppinsMedium }}
          color={Colors.grey30}
          marginB-20
        >
          This space is focused on remembering our beloved pets who are no
          longer with us.
        </Text>
        <Text
          center
          style={{ fontSize: FontSize.small, fontFamily: Fonts.PoppinsMedium }}
          color={Colors.grey40}
        >
          Here, you can pay tribute and remember the special moments you shared
          with them.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AbsoluteBackArrow color={Colors.grey30} />
      {/* Contenedor principal */}
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Text center text50 color={Colors.black} marginB-20 marginT-30 bold>
            Memorialss
          </Text>
          <Text center text70 color={Colors.grey30} marginB-30 italic>
            "Even though their paws no longer run on the ground, their
            footprints will remain forever in our hearts."
          </Text>
          {deathPets.map((pet) => (
            <TouchableWithoutFeedback key={pet.id} onPress={addHeart}>
              <Animated.View
                style={{
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                  marginBottom: 16,
                }}
              >
                <View
                  style={{
                    backgroundColor: Colors.white,
                    borderRadius: 16,
                    padding: 16,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    elevation: 4,
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={{ uri: pet.img }}
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: 60, // Redonda
                      marginBottom: 12,
                    }}
                  />
                  <Text text60 color={Colors.blue50} center bold>
                    ❤️ {pet.name} ❤️
                  </Text>
                  <Text text80 color={Colors.grey40} center marginT-4>
                    🕊️{pet.dateOfDeath}🕊️
                  </Text>
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          ))}
        </ScrollView>
        {/* Renderizar corazones animados en toda la pantalla */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: "none", // Permitir que otros elementos sean interactivos
          }}
        >
          {renderHearts()}
        </View>
      </View>
    </SafeAreaView>
  );
};
export default Conmemoraciones;
