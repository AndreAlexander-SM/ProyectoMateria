import React, { useState, useCallback } from "react";
import {Text,StyleSheet,View,TouchableOpacity,Image,ScrollView,StatusBar,Platform,Dimensions,} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { TransaccionController } from "../controllers/TransaccionController";
import { UsuarioController } from "../controllers/UsuarioController";

const { width: screenWidth } = Dimensions.get("window");

export default function Graficas({ navigation }) {
  const [graficaActiva, setGraficaActiva] = useState("pastel");
  const [datos, setDatos] = useState({
    totalGastos: 0,
    totalIngresos: 0,
    balance: 0,
    gastosPorCategoria: {},
  });
  const [loading, setLoading] = useState(true);

  const transCtrl = new TransaccionController();
  const userCtrl = new UsuarioController();

  useFocusEffect(
    useCallback(() => {
      const cargarDatos = async () => {
        try {
          setLoading(true);

          const usuario = userCtrl.getUsuarioActivo
            ? userCtrl.getUsuarioActivo()
            : { id: 1 };
          const usuarioId = usuario.id || 1;

          const balanceData = await transCtrl.obtenerBalance(usuarioId);
          const gastosData = await transCtrl.obtenerDatosGrafica(usuarioId);

          setDatos({
            totalGastos: balanceData.gastos || 0,
            totalIngresos: balanceData.ingresos || 0,
            balance: balanceData.total || 0,
            gastosPorCategoria: gastosData || {},
          });
        } catch (error) {
          setDatos({
            totalGastos: 0,
            totalIngresos: 0,
            balance: 0,
            gastosPorCategoria: {},
          });
        } finally {
          setLoading(false);
        }
      };

      cargarDatos();
    }, [])
  );

  const coloresBase = [
    "#FF6B6B",
    "#FF9E6B",
    "#FFC46B",
    "#FFE66B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#F78FB3",
    "#574B90",
    "#3DC7BE",
    "#F8A5C2",
    "#778BEB",
    "#E77F67",
    "#CF6A87",
    "#00B894",
    "#55E6C1",
  ];

  const getColor = (index) =>
    coloresBase[index % coloresBase.length];

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
    const { gastosPorCategoria, totalGastos } = datos;
    if (totalGastos === 0) return [];

    return Object.entries(gastosPorCategoria)
      .map(([categoria, monto]) => ({
        categoria,
        monto,
        porcentaje: totalGastos > 0 ? (monto / totalGastos) * 100 : 0,
      }))
      .sort((a, b) => b.monto - a.monto);
  };

  const renderGraficaBarras = () => {
    const porcentajes = calcularPorcentajes();

    if (loading) {
      return (
        <View style={styles.graficaContainer}>
          <Text style={styles.tituloGrafica}>Gastos por Categoría</Text>
          <Text style={styles.cargando}>Cargando datos...</Text>
        </View>
      );
    }

    if (porcentajes.length === 0) {
      return (
        <View style={styles.graficaContainer}>
          <Text style={styles.tituloGrafica}>Gastos por Categoría</Text>
          <Text style={styles.sinDatos}>
            No hay gastos registrados aún
          </Text>
        </View>
      );
    }

    const topCategorias = porcentajes.slice(0, 6);
    const maxMonto = Math.max(
      ...topCategorias.map((item) => item.monto),
      1
    );
    const alturaMaxima = 120;

    return (
      <View style={styles.graficaContainer}>
        <Text style={styles.tituloGrafica}>
          Gastos por Categoría (Top 6)
        </Text>

        <View style={styles.contenidoBarras}>
          <View style={styles.barrasVisualContainer}>
            {topCategorias.map((item, index) => {
              const altura =
                (item.monto / maxMonto) * alturaMaxima;

              return (
                <View
                  key={item.categoria}
                  style={styles.barraGrupo}
                >
                  <View style={styles.barraContainer}>
                    <View
                      style={[
                        styles.barra,
                        {
                          height: altura,
                          backgroundColor: getColor(index),
                          borderTopLeftRadius: 4,
                          borderTopRightRadius: 4,
                        },
                      ]}
                    />
                    <Text style={styles.montoBarra}>
                      ${item.monto.toFixed(0)}
                    </Text>
                  </View>
                  <Text
                    style={styles.labelBarra}
                    numberOfLines={1}
                  >
                    {item.categoria.length > 8
                      ? item.categoria.substring(0, 8) + "..."
                      : item.categoria}
                  </Text>
                  <Text style={styles.porcentajeBarra}>
                    {item.porcentaje.toFixed(0)}%
                  </Text>
                </View>
              );
            })}
          </View>

          <View style={styles.resumenBarras}>
            <View style={styles.resumenItem}>
              <Text style={styles.resumenLabel}>Total Gastado:</Text>
              <Text style={styles.resumenValue}>
                ${datos.totalGastos.toFixed(2)}
              </Text>
            </View>
            <View style={styles.resumenItem}>
              <Text style={styles.resumenLabel}>Categorías:</Text>
              <Text style={styles.resumenValue}>
                {topCategorias.length}
              </Text>
            </View>
            <View style={styles.resumenItem}>
              <Text style={styles.resumenLabel}>Mayor gasto:</Text>
              <Text style={styles.resumenValue}>
                ${topCategorias[0]?.monto.toFixed(2) || "0"}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderGraficaPastelSimple = () => {
    const porcentajes = calcularPorcentajes();

    if (loading) {
      return (
        <View style={styles.graficaContainer}>
          <Text style={styles.tituloGrafica}>
            Distribución de Gastos
          </Text>
          <Text style={styles.cargando}>Cargando datos...</Text>
        </View>
      );
    }

    if (porcentajes.length === 0) {
      return (
        <View style={styles.graficaContainer}>
          <Text style={styles.tituloGrafica}>
            Distribución de Gastos por Categoría
          </Text>
          <Text style={styles.sinDatos}>
            No hay gastos registrados aún
          </Text>
        </View>
      );
    }

    const topCategorias = porcentajes.slice(0, 6);

    return (
      <View style={styles.graficaContainer}>
        <Text style={styles.tituloGrafica}>
          Distribución de Gastos por Categoría
        </Text>

        <View style={styles.contenidoPastelSimple}>
          <View style={styles.pastelSimpleVisual}>
            <View style={styles.circuloAnillos}>
              {topCategorias.map((item, index) => {
                const tamaño = 140 - index * 20;
                return (
                  <View
                    key={item.categoria}
                    style={[
                      styles.anilloPastel,
                      {
                        width: tamaño,
                        height: tamaño,
                        borderRadius: tamaño / 2,
                        borderWidth: 12,
                        borderColor: getColor(index),
                        opacity: 0.8 - index * 0.1,
                      },
                    ]}
                  />
                );
              })}

              <View style={styles.centroPastelSimple}>
                <Text style={styles.totalPastelSimple}>
                  ${datos.totalGastos.toFixed(0)}
                </Text>
                <Text style={styles.labelPastelSimple}>Total</Text>
              </View>
            </View>
          </View>

          <View style={styles.leyendaDetallada}>
            {topCategorias.map((item, index) => (
              <View
                key={item.categoria}
                style={styles.filaLeyenda}
              >
                <View
                  style={[
                    styles.marcadorColor,
                    { backgroundColor: getColor(index) },
                  ]}
                />
                <View style={styles.infoLeyenda}>
                  <Text style={styles.nombreCategoria}>
                    {item.categoria}
                  </Text>
                  <Text style={styles.datosCategoria}>
                    ${item.monto.toFixed(2)} •{" "}
                    {item.porcentaje.toFixed(1)}%
                  </Text>
                </View>
                <View
                  style={styles.barraPorcentajeContainer}
                >
                  <View
                    style={[
                      styles.barraPorcentaje,
                      {
                        width: `${Math.min(
                          item.porcentaje,
                          100
                        )}%`,
                        backgroundColor: getColor(index),
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#46607C"
      />

      <View style={styles.header}>
        <View style={styles.headerContent}>
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
            <Text style={styles.headerTitle}>Análisis</Text>
            <Text style={styles.headerTitle}>Financiero</Text>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <View style={styles.selectorGraficas}>
          <TouchableOpacity
            style={[
              styles.botonGrafica,
              graficaActiva === "pastel" &&
                styles.botonGraficaActivo,
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
              Pastel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.botonGrafica,
              graficaActiva === "barras" &&
                styles.botonGraficaActivo,
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
              Barras
            </Text>
          </TouchableOpacity>
        </View>

        {graficaActiva === "pastel"
          ? renderGraficaPastelSimple()
          : renderGraficaBarras()}

        <View style={styles.resumenContainer}>
          <Text style={styles.tituloResumen}>Estado de Cuenta</Text>

          <View style={styles.listaInfo}>
            <View style={styles.itemResumen}>
              <Text style={styles.nombreItem}>
                Total Ingresado
              </Text>
              <Text
                style={[
                  styles.montoItem,
                  { color: "#00B894" },
                ]}
              >
                +${datos.totalIngresos.toFixed(2)}
              </Text>
            </View>

            <View style={styles.itemResumen}>
              <Text style={styles.nombreItem}>
                Total Gastado
              </Text>
              <Text
                style={[
                  styles.montoItem,
                  { color: "#FF6B6B" },
                ]}
              >
                -${datos.totalGastos.toFixed(2)}
              </Text>
            </View>

            <View style={styles.itemResumen}>
              <Text style={styles.nombreItem}>
                Balance Final
              </Text>
              <Text
                style={[
                  styles.montoItem,
                  {
                    color:
                      datos.balance >= 0
                        ? "#00B894"
                        : "#FF6B6B",
                  },
                ]}
              >
                ${datos.balance.toFixed(2)}
              </Text>
            </View>

            <View style={styles.linea} />

            <Text style={styles.textoFinal}>
              {getMensajeBalance()}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: "#46607C",
    width: "100%",
    height: 157,
    justifyContent: "center",
    paddingTop: Platform.OS === "android" ? 20 : 0,
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  backButton: {
    padding: 5,
    marginRight: 10,
    position: "absolute",
    left: 20,
    top: 0,
    zIndex: 10,
  },
  backIcon: {
    width: 30,
    height: 30,
    tintColor: "#fff",
    resizeMode: "contain",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
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
  botonGraficaActivo: {
    backgroundColor: "#31356E",
  },
  textoBotonGrafica: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  textoBotonGraficaActivo: {
    color: "white",
  },
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
  cargando: {
    textAlign: "center",
    color: "#666",
    fontStyle: "italic",
    marginVertical: 20,
  },
  sinDatos: {
    fontStyle: "italic",
    color: "#999",
    textAlign: "center",
    marginVertical: 20,
  },
  contenidoPastelSimple: {
    alignItems: "center",
  },
  pastelSimpleVisual: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  circuloAnillos: {
    position: "relative",
    width: 150,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
  },
  anilloPastel: {
    position: "absolute",
    borderStyle: "solid",
  },
  centroPastelSimple: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    width: 60,
    height: 60,
    borderRadius: 30,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  totalPastelSimple: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#31356E",
  },
  labelPastelSimple: {
    fontSize: 10,
    color: "#666",
    marginTop: 2,
  },
  leyendaDetallada: {
    width: "100%",
  },
  filaLeyenda: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  marcadorColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  infoLeyenda: {
    flex: 1,
  },
  nombreCategoria: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  datosCategoria: {
    fontSize: 12,
    color: "#666",
  },
  barraPorcentajeContainer: {
    flex: 1,
    height: 6,
    backgroundColor: "#e0e0e0",
    borderRadius: 3,
    overflow: "hidden",
    marginLeft: 10,
  },
  barraPorcentaje: {
    height: "100%",
    borderRadius: 3,
  },
  contenidoBarras: {
    alignItems: "center",
  },
  barrasVisualContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 150,
    width: "100%",
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  barraGrupo: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
  },
  barraContainer: {
    alignItems: "center",
    height: 120,
    justifyContent: "flex-end",
  },
  barra: {
    width: 25,
    minHeight: 4,
  },
  montoBarra: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#31356E",
    marginTop: 4,
  },
  labelBarra: {
    fontSize: 10,
    color: "#333",
    marginTop: 6,
    textAlign: "center",
    maxWidth: 50,
  },
  porcentajeBarra: {
    fontSize: 9,
    color: "#666",
    marginTop: 2,
  },
  resumenBarras: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  resumenItem: {
    alignItems: "center",
  },
  resumenLabel: {
    fontSize: 10,
    color: "#666",
    marginBottom: 2,
    textAlign: "center",
  },
  resumenValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#31356E",
  },
  resumenContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  tituloResumen: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#31356E",
    marginBottom: 15,
    textAlign: "center",
  },
  listaInfo: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 15,
  },
  itemResumen: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  nombreItem: {
    flex: 1,
    fontSize: 16,
    color: "#171616",
    fontWeight: "bold",
  },
  montoItem: {
    fontSize: 16,
    fontWeight: "bold",
  },
  linea: {
    height: 2,
    backgroundColor: "#393737",
    marginVertical: 15,
    marginHorizontal: 20,
  },
  textoFinal: {
    color: "gray",
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    textAlign: "center",
    lineHeight: 22,
  },
});
