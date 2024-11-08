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
import { Svg, Polygon } from "react-native-svg";

const FiveSidedShape = () => {
  const points = "0,900 0,400 200,300 500,440 400,900"; 

  return (
    <Svg height="100%" width="100%">
      <Polygon points={points} fill="#4C526A" />
    </Svg>
  );
};

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
      console.log("Login result:", result);
      if (role === Roles.user) {
        router.replace("/(app)/(user)/");
      } else if (role === Roles.veterinary) {
        router.replace("/(app)/(vet)/");
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.shapeContainer}>
        <FiveSidedShape />
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Spike</Text>
        <Image
          source={require("../assets/images/catbox.png")}
          style={styles.catbox}
        />
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor={ColorPalette.medium}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
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
          </View>
          <View style={styles.signupContainer}>
            <View style={styles.divider} />
            <Text style={styles.signupText}>You don’t have an account?</Text>
            <View style={styles.divider} />
          </View>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => router.push("/signUp")}
          >
            <Text style={styles.registerButtonText}>Register</Text>
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
    justifyContent: "center",
    alignItems: "center",
  },
  shapeContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    position: "absolute",
    top: 100, 
    left: 100, 
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  catbox: {
    position: "absolute",
    top: "30%", 
    transform: [{ translateY: -60 }], 
    left: 90, 
    width: 200,
    height: 200,
    padding: 20,
    resizeMode: "contain",
  },
  formContainer: {
    position: "absolute",
    top: 400, 
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  title: {
    fontSize: 44,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: ColorPalette.lightGrey,
    position: "absolute",
    right: 90, 
    top: 125, 
  },
  inputContainer: {
    marginBottom: 15,
    width: '100%',
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
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 15,
  },
  buttonContainer: {
    justifyContent: "flex-end",
    marginBottom: 20,
    width: '100%',
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
  signupContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 30,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'lightgray',
    marginHorizontal: 10,
  },
  signupText: {
    color: ColorPalette.gray,
    fontSize: 14,
    paddingHorizontal: 8,
  },
  registerButton: {
    backgroundColor: "white",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
    width: '100%',
    paddingHorizontal: 26,
  },
  registerButtonText: {
    fontSize: 18,
    color: "#3E4357",
  },
});

export default Login;