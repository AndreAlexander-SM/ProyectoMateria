import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function ConfirmarApartado({ setScreen }) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.titulo}>Confirmar Apartado</Text>

        <Text style={styles.texto}>
          ¿Quiere continuar con la confirmación de este Apartado Mensual?
        </Text>

        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.boton, styles.cancel]}
            onPress={() => setScreen("apartados")}
          >
            <Text style={[styles.textoBoton, { color: "#333" }]}>
              Cancelar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.boton, styles.delete]}
            onPress={() => setScreen("apartados")}
          >
            <Text style={[styles.textoBoton, { color: "white" }]}>
              Aceptar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    padding: 20,
  },

  card: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 25,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
    alignItems: "center",
  },

  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
    textAlign: "center",
  },

  texto: {
    marginBottom: 25,
    textAlign: "center",
    fontSize: 16,
    color: "#555",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 25,
  },

  boton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  cancel: {
    backgroundColor: "#e0e0e0",
    marginRight: 10,
  },

  delete: {
    backgroundColor: "#d63031",
    marginLeft: 10,
  },

  textoBoton: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});