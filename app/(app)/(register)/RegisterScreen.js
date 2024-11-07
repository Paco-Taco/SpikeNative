import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';

const RegisterVetModel  = () => {
    const [img, setImg] = useState(null);
    const [veterinarieName, setVeterinarieName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [street, setStreet] = useState("");
    const [role, setRole] = useState("");
    const [numberInt, setNumberInt] = useState("");
    const [locality, setLocality] = useState("");
    const [city, setCity] = useState("");
    const [cologne, setCologne] = useState("");
    const [cp, setCp] = useState("");
    const [rfc, setRfc] = useState("");
    const [category, setCategory] = useState("");
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFin, setHoraFin] = useState("");
    const [diasSemana, setDiasSemana] = useState([]);

    const isEmailValid = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    const isPasswordValid = (password) => {
        const passwordPattern = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%^&*]).{8,}$/;
        return passwordPattern.test(password);
    };

    const isPhoneValid = (phone) => {
        return phone.length === 10 && /^\d+$/.test(phone);
    };

    const validateFields = () => {
        if (!veterinarieName) {
            Alert.alert("Error", "El nombre de la veterinaria no puede estar vacío.");
            return false;
        }
        if (!email || !isEmailValid(email)) {
            Alert.alert("Error", "El email no es válido.");
            return false;
        }
        if (!password || !isPasswordValid(password)) {
            Alert.alert("Error", "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo.");
            return false;
        }
        if (!phone || !isPhoneValid(phone)) {
            Alert.alert("Error", "El número de teléfono debe tener 10 dígitos.");
            return false;
        }
        if (!street || !city || !category || !horaInicio || !horaFin || diasSemana.length === 0) {
            Alert.alert("Error", "Por favor complete todos los campos requeridos.");
            return false;
        }
        return true;
    };

    const registerVet = () => {
        if (!validateFields()) {
            return; // Detener el proceso si alguna validación falla
        }

        // Aquí iría la lógica para enviar los datos a la API.
        const formData = new FormData();
        formData.append('img', img);
        formData.append('veterinarieName', veterinarieName);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('phone', phone);
        formData.append('street', street);
        formData.append('role', role);
        formData.append('city', city);
        formData.append('locality', locality);
        formData.append('cologne', cologne);
        formData.append('numberInt', numberInt);
        formData.append('cp', cp);
        formData.append('rfc', rfc);
        formData.append('category', category);
        formData.append('horaInicio', horaInicio);
        formData.append('horaFin', horaFin);
        formData.append('diasSemana', diasSemana.join(","));

        // Aquí realizarías la solicitud a tu API
        console.log("Datos enviados:", formData);

        // Ejemplo de cómo enviar la solicitud
        fetch('URL_DE_TU_API', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            console.log('Registro exitoso:', data);
            Alert.alert("Registro exitoso", "Veterinaria registrada.");
        })
        .catch(error => {
            console.error('Error en el registro:', error);
            Alert.alert("Error", "Hubo un problema al registrar.");
        });
    };

    return (
        <View style={styles.container}>
            <TextInput style={styles.input} placeholder="Nombre de la veterinaria" value={veterinarieName} onChangeText={setVeterinarieName} />
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
            <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry value={password} onChangeText={setPassword} />
            <TextInput style={styles.input} placeholder="Teléfono" value={phone} onChangeText={setPhone} />
            <TextInput style={styles.input} placeholder="Calle" value={street} onChangeText={setStreet} />
            <TextInput style={styles.input} placeholder="Ciudad" value={city} onChangeText={setCity} />
            {/* Otros campos... */}
            <Button title="Registrar Veterinaria" onPress={registerVet} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
        justifyContent: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 10,
    },
});

export default RegisterVetModel;
