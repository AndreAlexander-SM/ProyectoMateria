import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function Agregar({ onNext }) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Agregar Transacción</Text>

      <TextInput placeholder="Monto" style={styles.input} keyboardType="numeric" />
      <TextInput placeholder="Categoría" style={styles.input} />
      <TextInput placeholder="Fecha" style={styles.input} />
      <TextInput
        placeholder="Descripción"
        style={[styles.input, styles.textArea]}
        multiline
      />

      <View style={styles.row}>
        <TouchableOpacity style={[styles.boton, styles.cancel]}>
          <Text style={[styles.textoBoton, { color: "#070707ff" }]}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.boton, styles.guardar]} onPress={onNext}>
          <Text style={[styles.textoBoton, { color: "#070707ff"}]}>Guardar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "white" },
  titulo: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
  textArea: { height: 100, textAlignVertical: "top" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  boton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  cancel: {
    backgroundColor: "#e0e0e0",
    marginRight: 10,
  },
  guardar: {
    backgroundColor: "#e0e0e0",
    marginLeft: 10,
  },
  textoBoton: { color: "white", textAlign: "center", fontWeight: "600" },
});