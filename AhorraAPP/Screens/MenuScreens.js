import React, { useState, useCallback } from "react";
import { Text, StyleSheet, View, TouchableOpacity, ScrollView, Image, StatusBar } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { UsuarioController } from "../controllers/UsuarioController";
import { TransaccionController } from "../controllers/TransaccionController";
import { ApartadoController } from "../controllers/ApartadoController";

const BalanceCard = ({ icon, label, amount, color, onPress }) => (
  <TouchableOpacity style={[styles.card, { backgroundColor: color }]} onPress={onPress}>
    <View style={styles.cardContent}>
      <Text style={styles.cardIcon}>{icon}</Text>
      <View>
        <Text style={styles.cardLabel}>{label}</Text>
        <Text style={styles.cardAmount}>{amount}</Text>
      </View>
    </View>
    <Text style={styles.cardArrow}>&gt;</Text>
  </TouchableOpacity>
);

export default function Menu({ navigation }) {
  const userCtrl = new UsuarioController();
  const transCtrl = new TransaccionController();
  const apartadoCtrl = new ApartadoController();

  const [nombre, setNombre] = useState("Usuario");
  const [finanzas, setFinanzas] = useState({
    ingresos: 0,
    gastos: 0,
    ahorros: 0,
    disponible: 0,
  });

  useFocusEffect(
    useCallback(() => {
      const user = userCtrl.getUsuarioActivo();

      if (user) {
        setNombre(user.nombre);
        cargarDatosFinancieros(user.id);
      } else {
        navigation.replace("InicioSesion");
      }
    }, [])
  );

  const cargarDatosFinancieros = async (id) => {
    const balanceTrans = await transCtrl.obtenerBalance(id);
    const totalAhorrado = await apartadoCtrl.obtenerTotalAhorrado(id);
    const dineroNeto = balanceTrans.total - totalAhorrado;

    setFinanzas({
      ingresos: balanceTrans.ingresos,
      gastos: balanceTrans.gastos,
      ahorros: totalAhorrado,
      disponible: dineroNeto,
    });
  };

  const formatoMoneda = (num) => {
    return "$" + num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#46617A" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => {
            userCtrl.cerrarSesion();
            navigation.replace("InicioSesion");
          }}
        >
          <Image
            style={styles.headerIconImage}
            source={require("../assets/cerrarSesion.png")}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text style={styles.Text}>Ahorra+ APP</Text>

        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.navigate("Perfil")}>
          <Ionicons name="person-circle-outline" size={32} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.accountSelector}>
        <TouchableOpacity style={styles.accountTabActiveCentered}>
          <Text style={styles.accountTabTextActive}>Hola {nombre.split(" ")[0]}!</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.subTabsCentered}>
          <Text style={styles.subTabActiveCenteredText}>Resumen Global</Text>
        </View>

        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Dinero Disponible (Libre)</Text>

          <View style={styles.balanceRow}>
            <Text
              style={[
                styles.balanceAmount,
                { color: finanzas.disponible >= 0 ? "#222" : "#FF3B30" },
              ]}
            >
              {formatoMoneda(finanzas.disponible)}
            </Text>

            <TouchableOpacity
              style={styles.balanceAddButton}
              onPress={() => navigation.navigate("Transacciones")}
            >
              <Text style={styles.balanceAddText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <BalanceCard
          icon="💲"
          label="Ingresos Totales"
          amount={formatoMoneda(finanzas.ingresos)}
          color="#e0fff1"
          onPress={() => navigation.navigate("Transacciones")}
        />

        <BalanceCard
          icon="⬇️⬆️"
          label="Gastos Totales"
          amount={formatoMoneda(finanzas.gastos)}
          color="#ffe0e0"
          onPress={() => navigation.navigate("Transacciones")}
        />

        <BalanceCard
          icon="🪙"
          label="Ahorros (Apartados)"
          amount={formatoMoneda(finanzas.ahorros)}
          color="#fffde0"
          onPress={() => navigation.navigate("Presupuestos")}
        />

        <Text style={styles.budgetsTitle}>Acciones Rápidas</Text>

        <TouchableOpacity
          style={styles.budgetsAddButton}
          onPress={() => navigation.navigate("Presupuestos")}
        >
          <Text style={styles.budgetsAddText}>Ver mis Apartados</Text>
          <Text style={styles.budgetsAddIcon}>→</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 20 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#46607C",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
  },

  headerIconImage: { width: 24, height: 24, tintColor: "#fff" },
  headerBtn: { padding: 5 },
  Text: { fontSize: 20, color: "#fff", fontWeight: "bold" },

  accountSelector: {
    backgroundColor: "#46607C",
    paddingBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  accountTabActiveCentered: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 30,
  },

  accountTabTextActive: {
    color: "#31356E",
    fontWeight: "bold",
    fontSize: 16,
  },

  subTabsCentered: {
    alignItems: "center",
    marginVertical: 20,
  },

  subTabActiveCenteredText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
    borderBottomWidth: 3,
    borderColor: "#31356E",
    paddingBottom: 5,
  },

  balanceContainer: { marginBottom: 20 },
  balanceLabel: { fontSize: 14, color: "#888", marginBottom: 5 },
  balanceRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  balanceAmount: { fontSize: 36, fontWeight: "bold", color: "#222" },

  balanceAddButton: {
    backgroundColor: "#31356E",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  balanceAddText: { color: "#fff", fontSize: 24 },

  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
    marginVertical: 8,
  },

  cardContent: { flexDirection: "row", alignItems: "center" },
  cardIcon: { fontSize: 24, marginRight: 15 },
  cardLabel: { fontSize: 16, color: "#555", fontWeight: "600" },
  cardAmount: { fontSize: 24, fontWeight: "bold" },
  cardArrow: { fontSize: 20, color: "#999" },

  budgetsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
    marginVertical: 15,
  },

  budgetsAddButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },

  budgetsAddText: { fontSize: 16, color: "#222" },
  budgetsAddIcon: {
    backgroundColor: "#31356E",
    width: 30,
    height: 30,
    borderRadius: 15,
    textAlign: "center",
    lineHeight: 30,
    color: "#fff",
    fontSize: 20,
  },
});
