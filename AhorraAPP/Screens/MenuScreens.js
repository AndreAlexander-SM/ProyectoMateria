import React from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";

export default function Menu({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menú Principal</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Transacciones")}
      >
        <Text style={styles.buttonText}>GESTIÓN DE TRANSACCIONES</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Graficas")}
      >
        <Text style={styles.buttonText}>GRÁFICOS</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Presupuestos")}
      >
        <Text style={styles.buttonText}>PRESUPUESTOS MENSUALES</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.replace("LoginScreen")}
      >
        <Text style={styles.buttonText}>CERRAR SESIÓN</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#cceeff",
    padding: 30,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 30,
    textAlign: "center",
  },

  button: {
    backgroundColor: "#2196f3",
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 6,
    marginVertical: 8,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },

  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 0.5,
  },
});
