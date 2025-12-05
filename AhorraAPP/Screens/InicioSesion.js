import React, { useState } from "react";
import { Text, StyleSheet, View, TextInput, Alert, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { UsuarioController } from "../controllers/UsuarioController";

export default function InicioSesion({ navigation }) {
  const controller = new UsuarioController();
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [verPassword, setVerPassword] = useState(false);

  const manejarInicioSesion = async () => {
    if (!email || !contraseña) return Alert.alert("Error", "Ingresa tus datos");

    const usuario = await controller.validarLogin(email, contraseña);

    if (usuario) {
      navigation.replace("MainApp");
    } else {
      Alert.alert("Error", "Credenciales incorrectas");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AHORRA+</Text>

      <View style={styles.loginBox}>
        <View style={styles.toggleButtons}>
          <TouchableOpacity
            style={styles.smallButton}
            onPress={() => navigation.navigate("Registro")}
          >
            <Text style={styles.longButtonText}>REGÍSTRATE</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder="EMAIL"
            placeholderTextColor="gray"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={contraseña}
            onChangeText={setContraseña}
            secureTextEntry={!verPassword}
            placeholder="CONTRASEÑA"
            placeholderTextColor="gray"
          />
          <TouchableOpacity
            onPress={() => setVerPassword(!verPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={verPassword ? "eye-off" : "eye"}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={manejarInicioSesion}
        >
          <Text style={styles.loginButtonText}>INICIAR SESIÓN</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Recuperar")}>
          <Text style={styles.recoverText}>Recuperar contraseña</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#2C3E50",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 50,
  },
  loginBox: {
    backgroundColor: "#46617A",
    borderRadius: 20,
    padding: 25,
    width: "85%",
    alignItems: "center",
  },
  toggleButtons: {
    flexDirection: "row",
    marginBottom: 20,
  },
  smallButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "#A8C7E5",
    borderRadius: 20,
    marginHorizontal: 5,
    alignItems: "center",
  },
  longButtonText: {
    color: "#2C3E50",
    fontWeight: "bold",
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    paddingHorizontal: 20,
    marginBottom: 15,
    height: 45,
    width: "100%",
  },
  input: {
    flex: 1,
    color: "#000000",
    height: "100%",
  },
  eyeIcon: {
    paddingLeft: 10,
  },
  loginButton: {
    backgroundColor: "#A8C7E5",
    paddingVertical: 12,
    borderRadius: 30,
    marginTop: 10,
    width: "100%",
  },
  loginButtonText: {
    textAlign: "center",
    color: "#2C3E50",
    fontWeight: "bold",
  },
  recoverText: {
    color: "#D6E3F3",
    marginTop: 15,
    fontSize: 12,
  },
});
