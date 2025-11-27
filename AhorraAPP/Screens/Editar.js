import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";

export default function Editar({ onBack, onNext }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={onBack}>
          <Image
            style={styles.headerIcon}
            source={require("../assets/regresar.png")}
          />
        </TouchableOpacity>

        <Text style={styles.title}>Editar Transacción</Text>

        <View style={{ width: 30 }} />
      </View>

      <View style={styles.line2} />

      <View style={styles.content}>
        <TextInput
          placeholder="Monto Nuevo"
          style={styles.input}
          keyboardType="numeric"
        />

        <TextInput placeholder="Categoría Nueva" style={styles.input} />

        <TextInput placeholder="Fecha Nueva" style={styles.input} />

        <TextInput
          placeholder="Descripción Nueva"
          style={[styles.input, styles.textArea]}
          multiline
        />

        <View style={styles.row}>
          <TouchableOpacity style={[styles.boton, styles.cancel]}>
            <Text style={styles.textoBoton}>Actualizar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.boton, styles.delete]}
            onPress={onNext}
          >
            <Text style={[styles.textoBoton, { color: "white" }]}>
              Eliminar
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
    backgroundColor: "white",
    paddingTop: 50,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },

  headerBtn: {
    padding: 3,
  },

  headerIcon: {
    width: 30,
    height: 30,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1B1B1B",
  },

  line2: {
    borderBottomWidth: 2,
    borderColor: "#31356E",
    width: "100%",
    marginBottom: 20,
  },

  content: {
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },

  textArea: {
    height: 100,
    textAlignVertical: "top",
  },

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

  delete: {
    backgroundColor: "#d63031",
    marginLeft: 10,
  },

  textoBoton: {
    color: "black",
    textAlign: "center",
    fontWeight: "600",
  },
});