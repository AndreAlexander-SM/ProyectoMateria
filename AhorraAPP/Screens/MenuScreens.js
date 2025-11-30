import React from "react";
import { Text, StyleSheet, View, TouchableOpacity, ScrollView, Image } from "react-native";

const BalanceCard = ({ icon, label, amount, color, onPress }) => (
  <TouchableOpacity
    style={[styles.card, { backgroundColor: color }]}
    onPress={onPress}
  >
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
  const handleTabPress = (tab) => {
    console.log(`Pestaña ${tab} presionada. La navegación real estaría fuera de este componente.`);
  };

  return (
    <View style={styles.container}>
      {/* HEADER con Pestañas y Configuración */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBtn}
          // MODIFICACIÓN: Usa 'replace' para simular un cierre de sesión y volver a InicioSesion.
          onPress={() => navigation.replace("InicioSesion")}
        >
          <Image
            style={styles.headerIconImage} // Cambié el estilo para que tenga tamaño
            source={require("../assets/cerrarSesion.png")}
            resizeMode="contain" // Ayuda a que la imagen se ajuste bien
          />
        </TouchableOpacity>


        <TouchableOpacity style={styles.monthContainer}>
          <Text style={styles.Text}>Ahorra+ APP</Text>
        </TouchableOpacity>
        {}
        <View style={{ width: 24 }} /> 
      </View>

      {/* Selector de Cuentas (Hola Usuario!) - CENTRADO */}
      <View style={styles.accountSelector}>
        <TouchableOpacity
          style={styles.accountTabActiveCentered}
          onPress={() => handleTabPress("Personal")}
        >
          <Text style={styles.accountTabTextActive}>Hola Usuario!</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Sub-Pestañas (Mis Gastos) - CENTRADO */}
        <View style={styles.subTabsCentered}>
          <Text style={styles.subTabActiveCenteredText}>Resumen</Text>
        </View>

        {/* Balance Acumulado */}
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Dinero Disponible</Text>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceAmount}>$0,00</Text>
            <TouchableOpacity style={styles.balanceAddButton}>
              <Text style={styles.balanceAddText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>


        <BalanceCard
          icon="💲"
          label="Ingresos"
          amount="$0,00"
          color="#e0fff1"
          onPress={() => navigation.navigate("Transacciones")}
        />
        <BalanceCard
          icon="⬇️⬆️"
          label="Gastos"
          amount="$0,00"
          color="#ffe0e0"
          onPress={() => navigation.navigate("Transacciones")}
        />
        <BalanceCard
          icon="🪙"
          label="Ahorros"
          amount="$0,00"
          color="#fffde0"
          onPress={() => navigation.navigate("Presupuestos")}
        />

        {/* Mis Presupuestos */}
        <Text style={styles.budgetsTitle}>Mis Presupuestos</Text>
        <TouchableOpacity
          style={styles.budgetsAddButton}
          onPress={() => navigation.navigate("Presupuestos")}
        >
          <Text style={styles.budgetsAddText}>Agregá un presupuesto</Text>
          <Text style={styles.budgetsAddIcon}>+</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderRadius: 20,
  },

  // --- Estilos del Header ---
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#46617A",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
  },
  // CORRECCIÓN DE ESTILO: Las imágenes necesitan ancho y alto explícito
  headerIconImage: {
    width: 24,
    height: 24, 
    tintColor: "#fff", // Esto pinta el PNG de blanco si es un icono transparente
  },
  headerBtn: {
    // Asegúrate de que el área de toque sea lo suficientemente grande
    padding: 5, 
  },
  monthContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  Text: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },

  // --- Estilos del Selector de Cuentas ---
  accountSelector: {
    backgroundColor: "#46617A",
    paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountTabActiveCentered: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 30,
    minWidth: 150,
    alignSelf: 'center',
  },
  accountTabTextActive: {
    color: "#31356E",
    fontWeight: "bold",
    textAlign: 'center',
    fontSize: 16,
  },

  // --- Estilos de Sub-Pestañas ---
  subTabsCentered: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
    marginBottom: 20,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  subTabActiveCenteredText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
    borderBottomWidth: 3,
    borderColor: "#31356E",
    paddingBottom: 5,
    textAlign: 'center',
  },

  // --- Estilos de Balance ---
  balanceContainer: {
    marginBottom: 20,
    paddingHorizontal: 0,
  },
  balanceLabel: {
    fontSize: 14,
    color: "#888",
    marginBottom: 5,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#222",
  },
  balanceAddButton: {
    backgroundColor: "#31356E",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  balanceAddText: {
    color: "#fff",
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "300",
  },

  // --- Estilos de las Tarjetas ---
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
    marginVertical: 8,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardIcon: {
    fontSize: 24,
    marginRight: 15,
    width: 30,
    textAlign: "center",
  },
  cardLabel: {
    fontSize: 16,
    color: "#555",
    fontWeight: "600",
  },
  cardAmount: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 2,
  },
  cardArrow: {
    fontSize: 20,
    color: "#999",
    fontWeight: "300",
  },

  // --- Estilos de Presupuestos ---
  budgetsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 20,
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
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  budgetsAddText: {
    fontSize: 16,
    color: "#222",
  },
  budgetsAddIcon: {
    backgroundColor: "#31356E",
    width: 30,
    height: 30,
    borderRadius: 15,
    textAlign: "center",
    lineHeight: 30,
    color: "#fff",
    fontSize: 20,
    fontWeight: "300",
  },
});