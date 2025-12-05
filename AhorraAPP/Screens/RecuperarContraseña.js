import React, { useState } from "react";
import { Text, StyleSheet, View, TextInput, Alert, TouchableOpacity } from "react-native";
import { UsuarioController } from "../controllers/UsuarioController";

export default function RecuperarContraseña({ navigation }) {
  const controller = new UsuarioController();
  const [email, setEmail] = useState("");

  const enviarRecuperacion = async () => {
    if (email.trim() === "") {
      Alert.alert("Error", "Escribe tu correo.");
      return;
    }

    const nuevaPassword = Math.random().toString(36).slice(-8);

    const actualizado = await controller.recuperarPassword(email, nuevaPassword);

    if (actualizado) {
      Alert.alert(
        "Contraseña Restablecida",
        `Tu nueva contraseña temporal es:\n\n${nuevaPassword}`,
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } else {
      Alert.alert("No encontrado", "Este correo no está registrado.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AHORRA+</Text>

      <View style={styles.loginBox}>
        <Text style={styles.label}>CORREO ELECTRÓNICO</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ej. nombre@gmail.com"
            placeholderTextColor="gray"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={enviarRecuperacion}>
          <Text style={styles.loginButtonText}>ENVIAR CONTRASEÑA</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.recoverText}>Volver al menú</Text>
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
  label: {
    color: "#fcf5f5ff",
    alignSelf: "flex-start",
    fontSize: 12,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
    height: 45,
    width: "100%",
  },
  input: {
    flex: 1,
    color: "#000",
    height: "100%",
  },
  loginButton: {
    backgroundColor: "#A8C7E5",
    paddingVertical: 12,
    borderRadius: 30,
    marginTop: 10,
    width: "80%",
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
