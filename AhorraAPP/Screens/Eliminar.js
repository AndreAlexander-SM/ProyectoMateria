import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function Eliminar({ onBack }) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Eliminar Transacción</Text>
      <Text style={styles.texto}>¿Deseas eliminar esta transacción?</Text>

      <TouchableOpacity style={styles.boton} onPress={onBack}>
        <Text style={styles.textoBoton}>Volver al menú</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white" },
  titulo: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  texto: { marginBottom: 20 },
  boton: { backgroundColor: "#3b3b98", padding: 10, borderRadius: 10 },
  textoBoton: { color: "white" },
});