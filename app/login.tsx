import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useAuth } from "./context/AuthContext";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ColorPalette } from "@/constants/Colors";
import { useLoginStore } from "@/stores/login.store";
import { Roles } from "@/constants/Roles";

const Login = () => {
  const { onLogin, authState } = useAuth();
  const { dataLogin } = useLoginStore((state) => state);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  useEffect(() => {
    const loadSession = () => {
      const role = dataLogin?.user.role;

      if (authState?.authenticated !== null && authState?.authenticated && authState?.token) {
        if (role === Roles.user) {
          router.replace("/(app)/(user)/");
        } else if (role === Roles.veterinary) {
          router.replace("/(app)/(vet)/");
        }
      }
    };
    loadSession();
  }, [authState?.authenticated, dataLogin]);

  const login = async () => {
    const result = await onLogin!({ email, password });
    if (result && result.error) {
      alert(result.msg);
    } else {
      const role = dataLogin?.user.role;
      if (role === Roles.user) {
        router.replace("/(app)/(user)/");
      } else if (role === Roles.veterinary) {
        router.replace("/(app)/(vet)/");
      }
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.logo}
        />
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor={ColorPalette.medium}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Contraseña"
            placeholderTextColor={ColorPalette.medium}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={togglePasswordVisibility}
          >
            <MaterialCommunityIcons
              name={passwordVisible ? "eye-off" : "eye"}
              size={24}
              color={ColorPalette.medium}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={login}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.linkText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorPalette.darkGrayPalette,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: ColorPalette.graphitePalette,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: ColorPalette.lightGrey,
  },
  input: {
    height: 50,
    borderColor: ColorPalette.lightGraphite,
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: ColorPalette.lightGraphite,
    color: ColorPalette.lightGrey,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  inputPassword: {
    flex: 1,
    height: 50,
    borderColor: ColorPalette.lightGraphite,
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: ColorPalette.lightGraphite,
    color: ColorPalette.lightGrey,
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
  },
  buttonContainer: {
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  button: {
    backgroundColor: ColorPalette.bluePalette,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: ColorPalette.lightGrey,
    fontSize: 16,
    fontWeight: "bold",
  },
  linkText: {
    color: ColorPalette.medium,
    fontSize: 14,
    textAlign: "center",
  },
});

export default Login;
