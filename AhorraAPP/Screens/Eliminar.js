import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function Eliminar({ onBack }) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.titulo}>Eliminar Transacción</Text>
        <Text style={styles.texto}>¿Seguro que deseas eliminar esta transacción?</Text>

        <View style={styles.row}>
          <TouchableOpacity style={[styles.boton, styles.cancel]}>
            <Text style={[styles.textoBoton, { color: "#333" }]}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.boton, styles.delete]}>
            <Text style={styles.textoBoton}>Aceptar</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.boton, styles.menu]} onPress={onBack}>
          <Text style={styles.textoBoton}>Volver al menú</Text>
        </TouchableOpacity>
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
  menu: {
    backgroundColor: "#330ce2ff", 
    width: "100%",
    marginTop: 15,
    paddingVertical: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, 
  },
  textoBoton: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});