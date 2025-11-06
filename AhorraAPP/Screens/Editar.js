import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function Editar({ onNext }) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Editar Transacción</Text>
      <TextInput placeholder="Monto Nuevo" style={styles.input} />
      <TextInput placeholder="Categoría Nueva" style={styles.input} />

      <TouchableOpacity style={styles.boton} onPress={onNext}>
        <Text style={styles.textoBoton}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "white" },
  titulo: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 10, marginBottom: 10 },
  boton: { backgroundColor: "#3b3b98", padding: 10, borderRadius: 10 },
  textoBoton: { color: "white", textAlign: "center" },
});