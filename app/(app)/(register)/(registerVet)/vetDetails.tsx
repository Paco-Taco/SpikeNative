import React, { useState } from 'react';
import { View, Text, Button, TextInput, Image, ScrollView, CheckBox, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker'; // Asegúrate de instalar expo-image-picker

const categories = ["CARE", "NUTRITION", "RECREATION"];

const VetDetailsScreen  = () => {
    const navigation = useNavigation();
    const [selectedImage, setSelectedImage] = useState(null);
    const [veterinarieName, setVeterinarieName] = useState('');
    const [email, setEmail] = useState('');
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFin, setHoraFin] = useState('');
    const [diasSemana, setDiasSemana] = useState([]);
    const [expandedCategories, setExpandedCategories] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("Select Specialty");

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    const toggleDay = (day) => {
        setDiasSemana(prevDays => 
            prevDays.includes(day) ? prevDays.filter(d => d !== day) : [...prevDays, day]
        );
    };

    const handleNext = () => {
        // Aquí recolectas todos los datos y navegas
        navigation.navigate("register_vet_address");
        console.log({ veterinarieName, email, horaInicio, horaFin, diasSemana, selectedCategory });
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#243748', padding: 16 }}>
            <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
                <Button title="Back" onPress={() => navigation.goBack()} color="#FFF" />
                <Text style={{ color: '#FFF', fontSize: 22, marginVertical: 16 }}>
                    Enter your personal information
                </Text>
                <Button title="Upload Image" onPress={pickImage} />
                {selectedImage && <Image source={{ uri: selectedImage }} style={{ width: 120, height: 100 }} />}
                <TextInput 
                    placeholder="Company name" 
                    value={veterinarieName} 
                    onChangeText={setVeterinarieName}
                    style={{ backgroundColor: '#FFF', marginVertical: 8, padding: 8, width: '100%' }} 
                />
                <TextInput 
                    placeholder="Email" 
                    value={email} 
                    onChangeText={setEmail}
                    style={{ backgroundColor: '#FFF', marginVertical: 8, padding: 8, width: '100%' }} 
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                    <TextInput 
                        placeholder="Opening Time" 
                        value={horaInicio} 
                        onChangeText={setHoraInicio}
                        style={{ backgroundColor: '#FFF', marginVertical: 8, padding: 8, flex: 1, marginRight: 8 }} 
                    />
                    <TextInput 
                        placeholder="Closing Time" 
                        value={horaFin} 
                        onChangeText={setHoraFin}
                        style={{ backgroundColor: '#FFF', marginVertical: 8, padding: 8, flex: 1 }} 
                    />
                </View>
                <Text style={{ color: '#FFF', fontSize: 16, marginVertical: 8 }}>Select Opening Days</Text>
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                    <View key={day} style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <CheckBox 
                            value={diasSemana.includes(day)} 
                            onValueChange={() => toggleDay(day)} 
                        />
                        <Text style={{ color: '#FFF' }}>{day}</Text>
                    </View>
                ))}
                <View style={{ width: '100%', marginTop: 16 }}>
                    <Button title={selectedCategory} onPress={() => setExpandedCategories(!expandedCategories)} color="#2224A5" />
                    {expandedCategories && (
                        <View style={{ backgroundColor: '#FFF', padding: 8, marginTop: 4 }}>
                            {categories.map(category => (
                                <Button 
                                    key={category} 
                                    title={category} 
                                    onPress={() => {
                                        setSelectedCategory(category);
                                        setExpandedCategories(false);
                                    }} 
                                />
                            ))}
                        </View>
                    )}
                </View>
                <Button title="Next" onPress={handleNext} color="#2224A5" />
            </ScrollView>
        </View>
    );
};

export default VetDetailsScreen;
