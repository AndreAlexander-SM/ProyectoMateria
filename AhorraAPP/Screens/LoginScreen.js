import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AHORRA+</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("InicioSesion")}
      >
        <Text style={styles.buttonText}>INICIAR SESIÓN</Text>
      </TouchableOpacity>

      <Text style={styles.text}>¿No tienes cuenta todavía?</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Registro")}
      >
        <Text style={styles.buttonText}>REGISTRATE AQUÍ</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2C3E50",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 120,
  },

  button: {
    backgroundColor: "#A8C7E5",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginBottom: 15,
  },

  buttonText: {
    color: "#2C3E50",
    fontWeight: "bold",
    fontSize: 14,
  },

  text: {
    color: "#E0E0E0",
    fontSize: 13,
  },
});
