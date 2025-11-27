import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Transacciones({ onNext, onEdit, navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.navigate("Inicio")}
        >
          <Image
            style={styles.headerIcon}
            source={require("../assets/regresar.png")}
          />
        </TouchableOpacity>

        <Text style={styles.title}>Transacciones</Text>

        <TouchableOpacity style={styles.headerBtn}>
          <Image
            style={styles.headerIcon}
            source={require("../assets/perfil.png")}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.line2} />

      <View style={styles.contentContainer}>
        <TextInput placeholder="Búsqueda" style={styles.input} />

        <View style={styles.filtros}>
          <TouchableOpacity style={styles.filtro}>
            <Text>Fecha</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.filtro}>
            <Text>Categoría</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={{ width: "100%" }}>
          <TouchableOpacity style={styles.card} onPress={onEdit}>
            <MaterialCommunityIcons name="food" size={24} color="green" />
            <View>
              <Text style={styles.monto}>$60.00</Text>
              <Text>Comida</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, styles.gasto]}
            onPress={onEdit}
          >
            <MaterialCommunityIcons name="bus" size={24} color="red" />
            <View>
              <Text style={styles.montoNegativo}>-$160.00</Text>
              <Text>Transporte</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <TouchableOpacity style={styles.botonFlotante} onPress={onNext}>
        <Text style={styles.textoBoton}>+</Text>
      </TouchableOpacity>
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
    width: "100%",
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
    marginBottom: 15,
  },

  contentContainer: {
    paddingHorizontal: 20,
    flex: 1,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    padding: 8,
    marginBottom: 10,
    width: "100%",
  },

  filtros: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },

  filtro: {
    backgroundColor: "#d7eaf2",
    padding: 10,
    borderRadius: 10,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#e3f0f8",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: "100%",
  },

  gasto: {
    borderLeftWidth: 4,
    borderLeftColor: "red",
  },

  monto: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
  },

  montoNegativo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "red",
    textAlign: "right",
  },

  botonFlotante: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#3b3b98",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

  textoBoton: {
    color: "white",
    fontSize: 30,
  },
});
