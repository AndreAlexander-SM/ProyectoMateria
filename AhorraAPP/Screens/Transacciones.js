import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Transacciones({ onNext, onBack }) {
  return (
    <View style={styles.container}> 
      <Text style={styles.titulo}>Transacciones</Text>
      <TextInput placeholder="Búsqueda" style={styles.input} />

      <View style={styles.filtros}>
        <TouchableOpacity style={styles.filtro}>
          <Text>Fecha</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filtro}>
          <Text>Categoría</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.card}>
          <MaterialCommunityIcons name="food" size={24} color="green" />
          <Text style={styles.monto}>$60.00</Text>
          <Text>Comida</Text>
        </View>

        <View style={[styles.card, styles.gasto]}>
          <MaterialCommunityIcons name="bus" size={24} color="red" />
          <Text style={styles.montoNegativo}>-$160.00</Text>
          <Text>Transporte</Text>
        </View>

        <View style={styles.card}>
          <MaterialCommunityIcons name="store" size={24} color="green" />
          <Text style={styles.monto}>$200.00</Text>
          <Text>Tienda</Text>
        </View>

        <View style={[styles.card, styles.gasto]}>
          <MaterialCommunityIcons name="cart" size={24} color="red" />
          <Text style={styles.montoNegativo}>-$70.00</Text>
          <Text>Compras</Text>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.botonFlotante} onPress={onNext}>
        <Text style={styles.textoBoton}>+</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botonVolver} onPress={onBack}>
        <Text style={styles.textoVolver}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", padding: 15 },
  titulo: { fontWeight: "bold", fontSize: 18, textAlign: "center", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 20, padding: 8, marginBottom: 10 },
  filtros: { flexDirection: "row", justifyContent: "space-around", marginBottom: 10 },
  filtro: { backgroundColor: "#d7eaf2", padding: 10, borderRadius: 10 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#e3f0f8",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  gasto: { borderLeftWidth: 4, borderLeftColor: "red" },
  monto: { fontSize: 18, fontWeight: "bold" },
  montoNegativo: { fontSize: 18, fontWeight: "bold", color: "red" },
  botonFlotante: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#3b3b98",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  textoBoton: { color: "white", fontSize: 30 },
  botonVolver: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "#ccc",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  textoVolver: { color: "black", fontSize: 12 },
});