import React, { useState, useCallback } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  Platform,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { TransaccionController } from "../controllers/TransaccionController";
import { UsuarioController } from "../controllers/UsuarioController";

export default function Graficas({ navigation }) {
  const [graficaActiva, setGraficaActiva] = useState("pastel");

  const transCtrl = new TransaccionController();
  const userCtrl = new UsuarioController();

  const [datos, setDatos] = useState({
    totalGastos: 0,
    totalIngresos: 0,
    balance: 0,
    gastosPorCategoria: {},
  });

  useFocusEffect(
    useCallback(() => {
      const user = userCtrl.getUsuarioActivo();
      if (user) {
        const cargarDatos = async () => {
          const balanceData = await transCtrl.obtenerBalance(user.id);
          const categoriasData = await transCtrl.obtenerDatosGrafica(user.id);
          setDatos({
            totalGastos: balanceData.gastos,
            totalIngresos: balanceData.ingresos,
            balance: balanceData.total,
            gastosPorCategoria: categoriasData,
          });
        };
        cargarDatos();
      }
    }, [])
  );

  const coloresBase = {
    Comida: "#4698c1ff",
    Servicios: "rgba(73, 116, 185, 0.98)",
    Entretenimiento: "#255490ff",
    Otros: "#3a4a81ff",
    Renta: "#FFAB00",
    Transporte: "#9C27B0",
    Ropa: "#E91E63",
    Salud: "#F44336",
    Educación: "#00BCD4",
    Supermercado: "#4CAF50",
  };

  const getColor = (cat) => coloresBase[cat] || "#607D8B";

  const getMensajeBalance = () => {
    const { balance } = datos;
    if (balance > 0)
      return `¡Excelente! Tienes un superávit de $${balance.toFixed(2)}.`;
    else if (balance < 0)
      return `Cuidado, tus gastos superan tus ingresos por $${Math.abs(
        balance
      ).toFixed(2)}.`;
    else return "Tus finanzas están perfectamente equilibradas.";
  };

  const calcularPorcentajes = () => {
    const total = datos.totalGastos;
    if (total === 0) return [];
    return Object.entries(datos.gastosPorCategoria).map(
      ([categoria, monto]) => ({
        categoria,
        monto,
        porcentaje: total > 0 ? (monto / total) * 100 : 0,
      })
    );
  };

  const renderGraficaPastel = () => {
    const porcentajes = calcularPorcentajes();

    return (
      <View style={styles.graficaContainer}>
        <Text style={styles.tituloGrafica}>Distribución de Gastos</Text>

        <View style={styles.contenidoGrafica}>
          <View style={styles.imagenPastel}>
            <Image
              source={require("../assets/pastel.png")}
              style={styles.pastel}
              resizeMode="contain"
            />
            <View style={styles.infoPastel}>
              <Text style={styles.totalGastos}>
                ${datos.totalGastos.toFixed(0)}
              </Text>
              <Text style={styles.labelTotal}>Total</Text>
            </View>
          </View>

          <View style={styles.categorias}>
            {porcentajes.length === 0 ? (
              <Text style={{ fontStyle: "italic", color: "#999" }}>
                Sin gastos aún
              </Text>
            ) : (
              porcentajes.map((item) => (
                <View key={item.categoria} style={styles.itemCategoria}>
                  <View
                    style={[
                      styles.colorBox,
                      { backgroundColor: getColor(item.categoria) },
                    ]}
                  />
                  <View style={styles.infoCategoria}>
                    <Text style={styles.nombreCategoria}>
                      {item.categoria}
                    </Text>
                    <Text style={styles.montoCategoria}>
                      ${item.monto.toFixed(2)} ({item.porcentaje.toFixed(1)}%)
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderGraficaBarras = () => {
    return (
      <View style={styles.graficaContainer}>
        <Text style={styles.tituloGrafica}>Balance General</Text>

        <View style={styles.contenidoGrafica}>
          <View style={styles.imagenBarras}>
            <Image
              source={require("../assets/barras.png")}
              style={styles.barras}
              resizeMode="contain"
            />
          </View>

          <View style={styles.datosBarras}>
            <View style={styles.datoItem}>
              <View
                style={[styles.datoColor, { backgroundColor: "#4CAF50" }]}
              />
              <View style={styles.datoInfo}>
                <Text style={styles.datoLabel}>Ingresos</Text>
                <Text style={styles.datoValor}>
                  ${datos.totalIngresos.toFixed(2)}
                </Text>
              </View>
            </View>

            <View style={styles.datoItem}>
              <View
                style={[styles.datoColor, { backgroundColor: "#F44336" }]}
              />
              <View style={styles.datoInfo}>
                <Text style={styles.datoLabel}>Gastos</Text>
                <Text style={styles.datoValor}>
                  ${datos.totalGastos.toFixed(2)}
                </Text>
              </View>
            </View>

            <View style={styles.datoItem}>
              <View
                style={[
                  styles.datoColor,
                  {
                    backgroundColor:
                      datos.balance >= 0 ? "#2196F3" : "#FF9800",
                  },
                ]}
              />
              <View style={styles.datoInfo}>
                <Text style={styles.datoLabel}>Balance</Text>
                <Text
                  style={[
                    styles.datoValor,
                    {
                      color:
                        datos.balance >= 0 ? "#2196F3" : "#FF9800",
                    },
                  ]}
                >
                  ${datos.balance.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#46607C" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Inicio")}
        >
          <Image
            style={styles.backIcon}
            source={require("../assets/regresar.png")}
          />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Análisis</Text>
          <Text style={styles.titleText}>Financiero</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.selectorGraficas}>
          <TouchableOpacity
            style={[
              styles.botonGrafica,
              graficaActiva === "pastel" && styles.botonGraficaActivo,
            ]}
            onPress={() => setGraficaActiva("pastel")}
          >
            <Text
              style={[
                styles.textoBotonGrafica,
                graficaActiva === "pastel" &&
                  styles.textoBotonGraficaActivo,
              ]}
            >
              Por Categoría
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.botonGrafica,
              graficaActiva === "barras" && styles.botonGraficaActivo,
            ]}
            onPress={() => setGraficaActiva("barras")}
          >
            <Text
              style={[
                styles.textoBotonGrafica,
                graficaActiva === "barras" &&
                  styles.textoBotonGraficaActivo,
              ]}
            >
              Balance
            </Text>
          </TouchableOpacity>
        </View>

        {graficaActiva === "pastel"
          ? renderGraficaPastel()
          : renderGraficaBarras()}

        <View style={styles.resumenContainer}>
          <Text style={styles.tituloResumen}>Estado de Cuenta</Text>

          <View style={styles.listaInfo}>
            <View style={styles.itemColor}>
              <Text style={styles.nombreColor}>Total Ingresado</Text>
              <Text style={[styles.monto, { color: "#4CAF50" }]}>
                +${datos.totalIngresos.toFixed(2)}
              </Text>
            </View>

            <View style={styles.itemColor}>
              <Text style={styles.nombreColor}>Total Gastado</Text>
              <Text style={[styles.monto, { color: "#F44336" }]}>
                -${datos.totalGastos.toFixed(2)}
              </Text>
            </View>

            <View style={styles.linea} />

            <Text style={styles.textoFinal}>{getMensajeBalance()}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollView: { flex: 1 },
  header: {
    width: "100%",
    backgroundColor: "#46607C",
    height: 157,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? 20 : 0,
    marginBottom: 20,
  },
  backButton: { position: "absolute", left: 20, top: 55, padding: 5, zIndex: 10 },
  backIcon: { width: 30, height: 30, tintColor: "#fff" },
  titleContainer: { alignItems: "center", justifyContent: "center", marginTop: 10 },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    lineHeight: 28,
  },
  selectorGraficas: {
    flexDirection: "row",
    justifyContent: "center",
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 5,
  },
  botonGrafica: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 5,
  },
  botonGraficaActivo: { backgroundColor: "#31356E" },
  textoBotonGrafica: { fontSize: 14, fontWeight: "600", color: "#666" },
  textoBotonGraficaActivo: { color: "white" },
  graficaContainer: {
    backgroundColor: "#f8f8f8",
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  tituloGrafica: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#31356E",
    textAlign: "center",
    marginBottom: 15,
  },
  contenidoGrafica: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  imagenPastel: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    position: "relative",
  },
  pastel: { width: 150, height: 150 },
  infoPastel: { position: "absolute", alignItems: "center" },
  totalGastos: { fontSize: 16, fontWeight: "bold", color: "#31356E" },
  labelTotal: { fontSize: 12, color: "#666" },
  categorias: { flex: 1, marginLeft: 10 },
  itemCategoria: { flexDirection: "row", alignItems: "center", marginVertical: 6 },
  infoCategoria: { flex: 1 },
  nombreCategoria: { fontSize: 14, color: "#333", fontWeight: "500" },
  montoCategoria: { fontSize: 12, color: "#666" },
  imagenBarras: { alignItems: "center", justifyContent: "center", flex: 1 },
  barras: { width: 180, height: 120 },
  datosBarras: { flex: 1, marginLeft: 10 },
  datoItem: { flexDirection: "row", alignItems: "center", marginVertical: 8 },
  datoColor: { width: 16, height: 16, borderRadius: 4, marginRight: 10 },
  datoInfo: { flex: 1 },
  datoLabel: { fontSize: 14, color: "#333", fontWeight: "500" },
  datoValor: { fontSize: 16, fontWeight: "bold", color: "#31356E" },
  resumenContainer: { marginHorizontal: 20, marginBottom: 20 },
  tituloResumen: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#31356E",
    marginBottom: 15,
    textAlign: "center",
  },
  listaInfo: { backgroundColor: "#f8f8f8", borderRadius: 12, padding: 15 },
  itemColor: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  nombreColor: {
    flex: 1,
    fontSize: 16,
    color: "#171616ff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  monto: { fontSize: 16, fontWeight: "bold", color: "#31356E" },
  colorBox: { width: 16, height: 16, borderRadius: 4 },
  linea: {
    height: 2,
    backgroundColor: "#393737ff",
    marginVertical: 20,
    marginHorizontal: 20,
  },
  textoFinal: {
    color: "gray",
    fontSize: 16,
    marginTop: 10,
    marginBottom: 20,
    marginHorizontal: 25,
    textAlign: "center",
    lineHeight: 22,
  },
});
