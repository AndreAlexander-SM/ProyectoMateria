import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
} from "react-native";

export default function RecuperarContraseña({ navigation }) {
  const [email, setEmail] = useState("");

  const enviarRecuperacion = () => {
    Alert.alert("Recuperación enviada", "Revisa tu correo");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AHORRA+</Text>

      <View style={styles.loginBox}>
        <Text style={styles.label}>CORREO ELECTRÓNICO</Text>

        <TextInput
          style={styles.input}
          placeholder="Ej. nombre@gmail.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TouchableOpacity
          style={styles.loginButton}
          onPress={enviarRecuperacion}
        >
          <Text style={styles.loginButtonText}>ENVIAR</Text>
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
    marginBottom: 5,
  },

  input: {
    borderBottomColor: "#ffffffff",
    borderBottomWidth: 1,
    color: "#e7e6e6ff",
    width: "100%",
    marginBottom: 20,
    paddingVertical: 5,
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
