import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

export default function Eliminar({ onBack }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={onBack}>
          <Image
            style={styles.headerIcon}
            source={require("../assets/regresar.png")}
          />
        </TouchableOpacity>

        <Text style={styles.title}>Eliminar Transacción</Text>

        <View style={{ width: 30 }} />
      </View>

      <View style={styles.line2} />

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.tituloCard}>
            ¿Seguro que deseas eliminar esta transacción?
          </Text>

          <Text style={styles.texto}>Esta acción es irreversible.</Text>

          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.boton, styles.cancel]}
              onPress={onBack}
            >
              <Text style={styles.textoBoton}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.boton, styles.delete]}>
              <Text style={[styles.textoBoton, { color: "white" }]}>
                Aceptar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  card: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
    elevation: 4,
  },

  tituloCard: {
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
    color: "#333",
    fontWeight: "bold",
    fontSize: 16,
  },
});