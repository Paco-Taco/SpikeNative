import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView, ScrollView, Animated, TouchableWithoutFeedback, Dimensions } from "react-native";
import { View, Text, Image, Colors, LoaderScreen } from "react-native-ui-lib";
import { axiosInstanceSpikeCore } from "@/controllers/SpikeApiCore";
import { useLoginStore } from "@/stores/login.store";
import LoadingCat from "@/components/shared/LoadingCat";
import AbsoluteBackArrow from "@/components/shared/AbsoluteBackArrow";

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
                const response = await axiosInstanceSpikeCore.get(`/deathpets/${ownerId}`);
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
            duration: 3000, // 3 segundos para desaparecer
            useNativeDriver: true,
        }).start(() => {
            // Eliminar corazón después de que termine la animación
            setHearts((prevHearts) => prevHearts.filter((heart) => heart.id !== heartId));
        });
    };

    const renderHearts = () => {
        return hearts.map((heart) => {
            const heartPositionY = heart.animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -300], // Suben 300px desde su posición inicial
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
            <SafeAreaView style={{ padding: 16, flex: 1, justifyContent: "center", alignItems: "center" }}>
                 <AbsoluteBackArrow color={Colors.grey30} />
                <Image
                    source={{ uri: "https://cdn-icons-png.flaticon.com/512/194/194279.png" }}
                    style={{ width: 150, height: 150, marginBottom: 20, borderRadius: 75 }}
                />
                <Text center text50 color={Colors.black} marginB-10 bold>
                    Conmemoraciones
                </Text>
                <Text center text70 color={Colors.grey30} marginB-20>
                    Este espacio está dedicado a recordar a nuestras queridas mascotas que ya no están con nosotros.
                </Text>
                <Text center text80 color={Colors.grey40}>
                    Aquí puedes rendirles homenaje y recordar los momentos especiales que viviste junto a ellas.
                </Text>
            </SafeAreaView>
        );
    }


    return (
        <SafeAreaView>
            <AbsoluteBackArrow color={Colors.grey30} />
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <Text center text50 color={Colors.black} marginB-20 marginT-30 bold>
                    Conmemoraciones
                </Text>
                <Text center text70 color={Colors.grey30} marginB-30 italic>
                    "Aunque sus patas ya no corran en la tierra, sus huellas quedarán para siempre en nuestros corazones."
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
                                    {pet.dateOfDeath}
                                </Text>
                            </View>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                ))}
                {renderHearts()}
            </ScrollView>
        </SafeAreaView>
    );
};

export default Conmemoraciones;
