import React, { useState } from "react";
import { Text, StyleSheet, View, TextInput, TouchableOpacity, Image } from "react-native";
import Apartados from "./PresupuestosMensuales";
import ConfirmarApartado from "./ConfirmarA";

export default function CrearApartado() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [screen, setScreen] = useState("crear");

  switch (screen) {
    case "apartados":
      return <Apartados setScreen={setScreen} />;

    case "confirmar":
      return <ConfirmarApartado setScreen={setScreen} />;

    case "crear":
    default:
      return (
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.headerBtn}
              onPress={() => setScreen("apartados")}
            >
              <Image
                style={styles.headerIcon}
                source={require("../assets/regresar.png")}
              />
            </TouchableOpacity>

            <Text style={styles.title}>Crea tu apartado</Text>

            <TouchableOpacity style={styles.headerBtn}>
              <Image
                style={styles.headerIcon}
                source={require("../assets/perfil.png")}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.line2} />

          <View style={styles.card}>
            <Text style={styles.label}>
              ¿Cual es el nombre de este apartado?
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Ingresa un nombre"
              value={nombre}
              onChangeText={setNombre}
            />

            <Text style={styles.label}>Descripción</Text>

            <TextInput
              style={styles.input}
              placeholder="Opcional"
              value={descripcion}
              onChangeText={setDescripcion}
            />

            <TextInput
              style={[styles.cantidad, { textAlign: "center" }]}
              placeholder="$0.00"
              keyboardType="number-pad"
            />

            <TouchableOpacity style={styles.totalBtn}>
              <Text style={styles.totalBtnText}>Total disponible</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.apartarBtn}
              onPress={() => setScreen("confirmar")}
            >
              <Text style={styles.apartarBtnText}>Apartar</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 35,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 15,
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

  card: {
    width: "90%",
    backgroundColor: "#E6F0F6",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },

  label: {
    width: "100%",
    fontSize: 15,
    marginTop: 10,
    marginBottom: 3,
  },

  input: {
    width: "100%",
    backgroundColor: "#ffffffff",
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 8,
  },

  cantidad: {
    fontSize: 40,
    fontWeight: "bold",
    marginVertical: 20,
    color: "#000000ff",
  },

  totalBtn: {
    backgroundColor: "#d1d5d7ff",
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
  },

  totalBtnText: {
    fontSize: 13,
    fontWeight: "600",
  },

  apartarBtn: {
    backgroundColor: "#d1d5d7ff",
    width: "60%",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 5,
  },

  apartarBtnText: {
    fontSize: 16,
    fontWeight: "600",
  },

  line2: {
    borderBottomWidth: 2,
    borderColor: "#31356E",
    width: "100%",
    marginBottom: 20,
  },
});