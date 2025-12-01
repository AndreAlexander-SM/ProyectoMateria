import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import { TransaccionController } from "../controllers/TransaccionController";
import { UsuarioController } from "../controllers/UsuarioController";

export default function Transacciones({ onNext, onEdit, navigation }) {
  const [activeTab, setActiveTab] = useState("fecha");
  const [listaTransacciones, setListaTransacciones] = useState([]);

  const transCtrl = new TransaccionController();
  const userCtrl = new UsuarioController();

  useFocusEffect(
    useCallback(() => {
      const user = userCtrl.getUsuarioActivo();
      if (user) {
        transCtrl.obtenerTodas(user.id).then((data) => setListaTransacciones(data));
      }
    }, [])
  );

  // Categorías únicas
  const uniqueCategories = [
    ...new Set(listaTransacciones.map((item) => item.categoria)),
  ];

  const renderCard = (item, index) => (
    <View key={item.id || index} style={styles.card}>
      <TouchableOpacity style={styles.iconContainer}>
        <MaterialIcons
          name={item.tipo === "ingreso" ? "attach-money" : "money-off"}
          size={30}
          color={item.tipo === "ingreso" ? "#00dcb4" : "#ff3b30"}
        />
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <Text
          style={[
            styles.montoText,
            item.tipo === "gasto" ? styles.textRed : styles.textBlack,
          ]}
        >
          ${item.monto.toFixed(2)}
        </Text>
        <Text style={styles.conceptoText}>{item.categoria}</Text>
        <Text style={styles.fechaDetailText}>{item.fecha}</Text>

        {item.descripcion ? (
          <Text style={{ fontSize: 10, color: "#888" }}>
            {item.descripcion}
          </Text>
        ) : null}
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.btnEditar} onPress={() => onEdit(item)}>
          <Text style={styles.btnTextSmall}>Editar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Image
              style={styles.backIcon}
              source={require("../assets/regresar.png")}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Transacciones</Text>

          <TouchableOpacity onPress={onNext}>
            <Image
              style={styles.plusIconHeader}
              source={require("../assets/mas.png")}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bodyContainer}>
        <Text style={styles.subHeaderTitle}>Vistas</Text>

        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[
              styles.tabItem,
              activeTab === "fecha" && styles.activeTabBorder,
            ]}
            onPress={() => setActiveTab("fecha")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "fecha" && styles.activeTabText,
              ]}
            >
              Fecha
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabItem,
              activeTab === "categoria" && styles.activeTabBorder,
            ]}
            onPress={() => setActiveTab("categoria")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "categoria" && styles.activeTabText,
              ]}
            >
              Categoría
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 60 }}
        >
          {activeTab === "categoria"
            ? uniqueCategories.map((cat, idx) => {
                const items = listaTransacciones.filter(
                  (t) => t.categoria === cat
                );

                return (
                  <View key={idx}>
                    <View style={styles.categoryPill}>
                      <Text style={styles.categoryPillText}>{cat}</Text>
                    </View>

                    {items.map((item) => renderCard(item))}
                  </View>
                );
              })
            : listaTransacciones.map((item, index) =>
                renderCard(item, index)
              )}
        </ScrollView>

        <LinearGradient
          colors={["transparent", "white"]}
          style={styles.gradientFade}
          pointerEvents="none"
        />
      </View>
    </SafeAreaView>
  );
}

// (Mantén tus estilos, solo asegúrate de que headerIcon y plusIconHeader tengan estilos)
const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "white" },

  headerContainer: {
    backgroundColor: "#46607C",
    paddingTop: 50,
    paddingBottom: 20,
    height: 120,
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  headerTitle: { fontSize: 25, fontWeight: "bold", color: "white" },

  backIcon: {
    width: 30,
    height: 30,
    tintColor: "#fff",
    resizeMode: "contain",
  },

  plusIconHeader: {
    width: 30,
    height: 30,
    tintColor: "#fff",
    resizeMode: "contain",
  },

  bodyContainer: { flex: 1, paddingHorizontal: 20, marginTop: 10 },

  subHeaderTitle: {
    textAlign: "center",
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
  },

  tabRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },

  tabItem: { paddingBottom: 5, minWidth: 80, alignItems: "center" },

  activeTabBorder: {
    borderBottomWidth: 3,
    borderBottomColor: "#46607C",
  },

  tabText: { fontSize: 16, color: "#666" },

  activeTabText: { color: "#000", fontWeight: "600" },

  scrollView: { width: "100%" },

  categoryPill: {
    backgroundColor: "#46617A",
    paddingVertical: 5,
    paddingHorizontal: 25,
    borderRadius: 20,
    alignSelf: "center",
    marginVertical: 10,
  },

  categoryPillText: { color: "white", fontWeight: "bold", fontSize: 14 },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eaf4f8",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#bdc3c7",
    padding: 15,
    marginBottom: 10,
  },

  iconContainer: { marginRight: 10 },

  infoContainer: { flex: 1 },

  montoText: { fontSize: 18, fontWeight: "bold" },

  textRed: { color: "#ff3b30" },

  textBlack: { color: "#333" },

  conceptoText: { fontSize: 13, color: "#333", fontWeight: "500" },

  fechaDetailText: { fontSize: 10, color: "#666", marginTop: 2 },

  actionsContainer: { flexDirection: "row", gap: 8 },

  btnEditar: {
    backgroundColor: "#ffab00",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },

  btnTextSmall: { color: "white", fontSize: 10, fontWeight: "bold" },

  gradientFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 50,
  },
});
