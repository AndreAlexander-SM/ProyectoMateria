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
  Dimensions,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { TransaccionController } from "../controllers/TransaccionController";
import { UsuarioController } from "../controllers/UsuarioController";

const { width: screenWidth } = Dimensions.get("window");

export default function Graficas({ navigation }) {
  const [graficaActiva, setGraficaActiva] = useState("ingresosVsEgresos");
  const [datos, setDatos] = useState({
    totalGastos: 0,
    totalIngresos: 0,
    balance: 0,
    gastosPorCategoria: {},
    ingresosPorCategoria: {},
    transaccionesMensuales: [],
  });
  const [loading, setLoading] = useState(true);

  const transCtrl = new TransaccionController();
  const userCtrl = new UsuarioController();

  const obtenerNombreMes = (fechaISO) => {
    if (!fechaISO) return "Sin fecha";
    
    const partes = fechaISO.split("-");
    if (partes.length < 2) return fechaISO;
    
    const year = partes[0];
    const month = partes[1];
    
    const meses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    
    const mesIndex = parseInt(month, 10) - 1;
    if (mesIndex < 0 || mesIndex > 11) return fechaISO;
    
    return `${meses[mesIndex]} ${year}`;
  };

  const procesarTransaccionesMensuales = (transacciones) => {
    console.log("=== INICIANDO PROCESAMIENTO MENSUAL ===");
    console.log("Total transacciones:", transacciones.length);
    
    const transaccionesPorMes = {};
    let transaccionesProcesadas = 0;
    let transaccionesConError = 0;
    
    transacciones.forEach((t, index) => {
      try {
        // Verificar que la transacción tenga datos básicos
        if (!t || typeof t !== 'object') {
          transaccionesConError++;
          return;
        }
        
        // Obtener fecha - manejar diferentes casos
        let fechaTransaccion = t.fecha;
        
        // Si no hay fecha, usar fecha actual
        if (!fechaTransaccion) {
          fechaTransaccion = new Date().toISOString().split('T')[0];
        }
        
        // Convertir a string
        const fechaStr = String(fechaTransaccion).trim();
        
        // Extraer año y mes
        let year, month;
        
        // Buscar patrón YYYY-MM-DD o YYYY-MM
        const match1 = fechaStr.match(/(\d{4})[-\/](\d{1,2})/);
        if (match1) {
          year = match1[1];
          month = match1[2];
        }
        // Buscar patrón DD/MM/YYYY
        else if (fechaStr.includes('/')) {
          const parts = fechaStr.split('/');
          if (parts.length >= 3) {
            year = parts[2];
            month = parts[1];
          }
        }
        
        // Si no se pudo extraer, usar fecha actual
        if (!year || !month) {
          const now = new Date();
          year = now.getFullYear().toString();
          month = (now.getMonth() + 1).toString();
        }
        
        // Formatear mes a 2 dígitos
        const mesFormateado = month.padStart(2, '0');
        const mesKey = `${year}-${mesFormateado}`;
        
        // Inicializar mes si no existe
        if (!transaccionesPorMes[mesKey]) {
          transaccionesPorMes[mesKey] = {
            gastos: 0,
            ingresos: 0,
            balance: 0
          };
        }
        
        // Obtener monto
        const monto = Math.abs(parseFloat(t.monto)) || 0;
        
        // Sumar según tipo
        if (t.tipo === "gasto") {
          transaccionesPorMes[mesKey].gastos += monto;
        } else if (t.tipo === "ingreso") {
          transaccionesPorMes[mesKey].ingresos += monto;
        }
        
        // Calcular balance
        transaccionesPorMes[mesKey].balance = 
          transaccionesPorMes[mesKey].ingresos - transaccionesPorMes[mesKey].gastos;
        
        transaccionesProcesadas++;
        
      } catch (error) {
        console.error(`Error en transacción ${index}:`, error);
        transaccionesConError++;
      }
    });
    
    console.log("Transacciones procesadas:", transaccionesProcesadas);
    console.log("Transacciones con error:", transaccionesConError);
    console.log("Meses encontrados:", Object.keys(transaccionesPorMes));
    
    // Convertir a array y ordenar
    const resultado = Object.entries(transaccionesPorMes)
      .map(([mes, datos]) => ({ 
        mes, 
        gastos: datos.gastos || 0, 
        ingresos: datos.ingresos || 0, 
        balance: datos.balance || 0 
      }))
      .sort((a, b) => b.mes.localeCompare(a.mes))
      .slice(0, 6);
    
    console.log("Resultado final (primeros 3):", resultado.slice(0, 3));
    
    return resultado;
  };

  useFocusEffect(
    useCallback(() => {
      const cargarDatos = async () => {
        try {
          setLoading(true);

          const usuario = userCtrl.getUsuarioActivo
            ? userCtrl.getUsuarioActivo()
            : { id: 1 };
          const usuarioId = usuario.id || 1;

          // Obtener todas las transacciones
          const transacciones = await transCtrl.obtenerTodas(usuarioId);
          
          console.log("=== CARGANDO DATOS ===");
          console.log("Usuario ID:", usuarioId);
          console.log("Total transacciones BD:", transacciones.length);
          
          // Mostrar estructura de algunas transacciones
          if (transacciones.length > 0) {
            console.log("Ejemplo de transacciones:");
            transacciones.slice(0, 3).forEach((t, i) => {
              console.log(`${i + 1}. ID: ${t.id}, Tipo: ${t.tipo}, Monto: ${t.monto}, Fecha: ${t.fecha}, Categoría: ${t.categoria}`);
            });
          }
          
          // Procesar datos para gráficas
          const gastosPorCategoria = {};
          const ingresosPorCategoria = {};
          let totalGastos = 0;
          let totalIngresos = 0;

          transacciones.forEach(t => {
            const valor = Math.abs(parseFloat(t.monto)) || 0;
            
            if (t.tipo === "gasto") {
              totalGastos += valor;
              const categoria = t.categoria || "Sin categoría";
              gastosPorCategoria[categoria] = (gastosPorCategoria[categoria] || 0) + valor;
            } else if (t.tipo === "ingreso") {
              totalIngresos += valor;
              const categoria = t.categoria || "Sin categoría";
              ingresosPorCategoria[categoria] = (ingresosPorCategoria[categoria] || 0) + valor;
            }
          });

          const balance = totalIngresos - totalGastos;
          const transaccionesMensuales = procesarTransaccionesMensuales(transacciones);

          console.log("=== RESUMEN DATOS ===");
          console.log("Total Gastos:", totalGastos);
          console.log("Total Ingresos:", totalIngresos);
          console.log("Balance:", balance);
          console.log("Categorías gastos:", Object.keys(gastosPorCategoria).length);
          console.log("Categorías ingresos:", Object.keys(ingresosPorCategoria).length);
          console.log("Meses procesados:", transaccionesMensuales.length);

          setDatos({
            totalGastos,
            totalIngresos,
            balance,
            gastosPorCategoria,
            ingresosPorCategoria,
            transaccionesMensuales
          });
        } catch (error) {
          console.error("Error cargando datos:", error);
          setDatos({
            totalGastos: 0,
            totalIngresos: 0,
            balance: 0,
            gastosPorCategoria: {},
            ingresosPorCategoria: {},
            transaccionesMensuales: []
          });
        } finally {
          setLoading(false);
        }
      };

      cargarDatos();
    }, [])
  );

  const coloresBase = [
    "#FF6B6B", "#FF9E6B", "#FFC46B", "#FFE66B", "#4ECDC4", "#45B7D1",
    "#96CEB4", "#F78FB3", "#574B90", "#3DC7BE", "#F8A5C2", "#778BEB",
    "#E77F67", "#CF6A87", "#00B894", "#55E6C1", "#6366F1", "#8B5CF6"
  ];

  const getColor = (index) => coloresBase[index % coloresBase.length];

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

  // 1. Gráfica de Ingresos vs Egresos por Categoría
  const renderGraficaIngresosVsEgresos = () => {
    const { gastosPorCategoria, ingresosPorCategoria } = datos;

    if (loading) {
      return (
        <View style={styles.graficaContainer}>
          <Text style={styles.tituloGrafica}>Ingresos vs Egresos por Categoría</Text>
          <Text style={styles.cargando}>Cargando datos...</Text>
        </View>
      );
    }

    // Combinar todas las categorías de ingresos y egresos
    const todasCategorias = new Set([
      ...Object.keys(gastosPorCategoria),
      ...Object.keys(ingresosPorCategoria)
    ]);

    if (todasCategorias.size === 0) {
      return (
        <View style={styles.graficaContainer}>
          <Text style={styles.tituloGrafica}>Ingresos vs Egresos por Categoría</Text>
          <Text style={styles.sinDatos}>No hay transacciones registradas aún</Text>
          <Text style={styles.infoAyuda}>
            Agrega transacciones desde la pestaña "Transacciones"
          </Text>
        </View>
      );
    }

    const datosGrafica = Array.from(todasCategorias).map((categoria, index) => ({
      categoria: categoria || "Sin categoría",
      ingresos: ingresosPorCategoria[categoria] || 0,
      gastos: gastosPorCategoria[categoria] || 0,
      color: getColor(index)
    })).sort((a, b) => (b.ingresos + b.gastos) - (a.ingresos + a.gastos))
      .slice(0, 8); // Mostrar solo las 8 categorías principales

    const maxValor = Math.max(
      ...datosGrafica.map(d => Math.max(d.ingresos, d.gastos)),
      1
    );
    const alturaMaxima = 120;

    return (
      <View style={styles.graficaContainer}>
        <Text style={styles.tituloGrafica}>Ingresos vs Egresos por Categoría</Text>
        
        <View style={styles.leyendaComparativa}>
          <View style={styles.itemLeyenda}>
            <View style={[styles.cuadradoLeyenda, { backgroundColor: '#00B894' }]} />
            <Text style={styles.textoLeyenda}>Ingresos</Text>
          </View>
          <View style={styles.itemLeyenda}>
            <View style={[styles.cuadradoLeyenda, { backgroundColor: '#FF6B6B' }]} />
            <Text style={styles.textoLeyenda}>Egresos</Text>
          </View>
        </View>

        <View style={styles.contenidoComparativa}>
          {datosGrafica.map((item, index) => {
            const alturaIngresos = (item.ingresos / maxValor) * alturaMaxima;
            const alturaGastos = (item.gastos / maxValor) * alturaMaxima;

            return (
              <View key={`${item.categoria}-${index}`} style={styles.grupoBarrasComparativas}>
                <View style={styles.barrasContainer}>
                  {/* Barra de ingresos */}
                  <View style={styles.barraWrapper}>
                    <View style={[styles.barraIngreso, { 
                      height: Math.max(alturaIngresos, 2) 
                    }]} />
                    <Text style={styles.valorBarra}>
                      {item.ingresos > 0 ? `$${item.ingresos.toFixed(0)}` : ''}
                    </Text>
                  </View>
                  
                  {/* Barra de gastos */}
                  <View style={styles.barraWrapper}>
                    <View style={[styles.barraGasto, { 
                      height: Math.max(alturaGastos, 2) 
                    }]} />
                    <Text style={styles.valorBarra}>
                      {item.gastos > 0 ? `$${item.gastos.toFixed(0)}` : ''}
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.labelCategoria} numberOfLines={2}>
                  {item.categoria.length > 10 
                    ? item.categoria.substring(0, 10) + '...' 
                    : item.categoria}
                </Text>
                
                <View style={styles.totalesCategoria}>
                  <Text style={styles.totalIngreso}>
                    {item.ingresos > 0 ? `+$${item.ingresos.toFixed(0)}` : ''}
                  </Text>
                  <Text style={styles.totalGasto}>
                    {item.gastos > 0 ? `-$${item.gastos.toFixed(0)}` : ''}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
        
        <View style={styles.resumenComparativa}>
          <View style={styles.resumenItem}>
            <Text style={styles.resumenLabel}>Total Ingresos:</Text>
            <Text style={[styles.resumenValue, { color: '#00B894' }]}>
              ${datos.totalIngresos.toFixed(2)}
            </Text>
          </View>
          <View style={styles.resumenItem}>
            <Text style={styles.resumenLabel}>Total Gastos:</Text>
            <Text style={[styles.resumenValue, { color: '#FF6B6B' }]}>
              ${datos.totalGastos.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // 2. Gráfica Comparativa Mensual (Gastos vs Ingresos por mes)
  const renderGraficaComparativaMensual = () => {
    const { transaccionesMensuales, totalGastos, totalIngresos } = datos;

    console.log("=== RENDERIZANDO GRÁFICA MENSUAL ===");
    console.log("transaccionesMensuales:", transaccionesMensuales);
    console.log("loading:", loading);

    if (loading) {
      return (
        <View style={styles.graficaContainer}>
          <Text style={styles.tituloGrafica}>Comparativa Mensual</Text>
          <Text style={styles.cargando}>Cargando datos...</Text>
        </View>
      );
    }

    // Si no hay datos mensuales pero sí hay transacciones
    if (transaccionesMensuales.length === 0) {
      const tieneTransacciones = totalGastos > 0 || totalIngresos > 0;
      
      return (
        <View style={styles.graficaContainer}>
          <Text style={styles.tituloGrafica}>Comparativa Mensual</Text>
          
          {tieneTransacciones ? (
            <>
              <Text style={styles.sinDatos}>
                No se encontraron datos agrupados por mes
              </Text>
              <Text style={styles.infoAyuda}>
                Asegúrate de que tus transacciones tengan fechas válidas
              </Text>
              <Text style={styles.infoDetalle}>
                Total transacciones: {totalGastos + totalIngresos > 0 ? "Sí hay datos" : "0"}
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.sinDatos}>
                No hay transacciones registradas
              </Text>
              <Text style={styles.infoAyuda}>
                Agrega transacciones desde la pestaña "Transacciones"
              </Text>
            </>
          )}
        </View>
      );
    }

    const maxValor = Math.max(
      ...transaccionesMensuales.map(m => Math.max(m.ingresos, m.gastos)),
      1
    );
    const alturaMaxima = 120;

    return (
      <View style={styles.graficaContainer}>
        <Text style={styles.tituloGrafica}>Comparativa Mensual (Últimos 6 meses)</Text>
        
        <View style={styles.leyendaComparativa}>
          <View style={styles.itemLeyenda}>
            <View style={[styles.cuadradoLeyenda, { backgroundColor: '#00B894' }]} />
            <Text style={styles.textoLeyenda}>Ingresos</Text>
          </View>
          <View style={styles.itemLeyenda}>
            <View style={[styles.cuadradoLeyenda, { backgroundColor: '#FF6B6B' }]} />
            <Text style={styles.textoLeyenda}>Gastos</Text>
          </View>
        </View>

        <View style={styles.contenidoMensual}>
          {transaccionesMensuales.map((mesData, index) => {
            const alturaIngresos = (mesData.ingresos / maxValor) * alturaMaxima;
            const alturaGastos = (mesData.gastos / maxValor) * alturaMaxima;
            const nombreMes = obtenerNombreMes(mesData.mes);
            const nombreMesCorto = nombreMes.split(' ')[0].substring(0, 3);
            const anio = mesData.mes ? mesData.mes.split('-')[0] : '';

            return (
              <View key={`${mesData.mes}-${index}`} style={styles.grupoMes}>
                <View style={styles.barrasMensualesContainer}>
                  <View style={styles.barraMensualWrapper}>
                    <View style={[styles.barraIngreso, { 
                      height: Math.max(alturaIngresos, 2) 
                    }]} />
                    <Text style={styles.valorBarraMensual}>
                      {mesData.ingresos > 0 ? `$${mesData.ingresos.toFixed(0)}` : ''}
                    </Text>
                  </View>
                  
                  <View style={styles.barraMensualWrapper}>
                    <View style={[styles.barraGasto, { 
                      height: Math.max(alturaGastos, 2) 
                    }]} />
                    <Text style={styles.valorBarraMensual}>
                      {mesData.gastos > 0 ? `$${mesData.gastos.toFixed(0)}` : ''}
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.labelMes}>
                  {nombreMesCorto}
                </Text>
                <Text style={styles.anioMes}>
                  {anio}
                </Text>
                
                <View style={styles.balanceMes}>
                  <Text style={[
                    styles.textoBalance,
                    { color: mesData.balance >= 0 ? '#00B894' : '#FF6B6B' }
                  ]}>
                    {mesData.balance >= 0 ? '+' : '-'}${Math.abs(mesData.balance).toFixed(0)}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.resumenMensual}>
          <View style={styles.resumenMensualItem}>
            <Text style={styles.resumenMensualLabel}>Período analizado:</Text>
            <Text style={styles.resumenMensualValue}>
              {transaccionesMensuales.length} {transaccionesMensuales.length === 1 ? 'mes' : 'meses'}
            </Text>
          </View>
          
          {transaccionesMensuales.length > 0 && (
            <>
              <View style={styles.resumenMensualItem}>
                <Text style={styles.resumenMensualLabel}>Total ingresos período:</Text>
                <Text style={[styles.resumenMensualValue, { color: '#00B894' }]}>
                  ${transaccionesMensuales.reduce((sum, mes) => sum + mes.ingresos, 0).toFixed(2)}
                </Text>
              </View>
              <View style={styles.resumenMensualItem}>
                <Text style={styles.resumenMensualLabel}>Total gastos período:</Text>
                <Text style={[styles.resumenMensualValue, { color: '#FF6B6B' }]}>
                  ${transaccionesMensuales.reduce((sum, mes) => sum + mes.gastos, 0).toFixed(2)}
                </Text>
              </View>
            </>
          )}
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
              graficaActiva === "ingresosVsEgresos" &&
                styles.botonGraficaActivo,
            ]}
            onPress={() => setGraficaActiva("ingresosVsEgresos")}
          >
            <Text
              style={[
                styles.textoBotonGrafica,
                graficaActiva === "ingresosVsEgresos" &&
                  styles.textoBotonGraficaActivo,
              ]}
            >
              Ingresos vs Egresos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.botonGrafica,
              graficaActiva === "comparativaMensual" &&
                styles.botonGraficaActivo,
            ]}
            onPress={() => setGraficaActiva("comparativaMensual")}
          >
            <Text
              style={[
                styles.textoBotonGrafica,
                graficaActiva === "comparativaMensual" &&
                  styles.textoBotonGraficaActivo,
              ]}
            >
              Comparativa Mensual
            </Text>
          </TouchableOpacity>
        </View>

        {graficaActiva === "ingresosVsEgresos"
          ? renderGraficaIngresosVsEgresos()
          : renderGraficaComparativaMensual()}

        <View style={styles.resumenContainer}>
          <Text style={styles.tituloResumen}>Resumen General</Text>

          <View style={styles.listaInfo}>
            <View style={styles.itemResumen}>
              <Text style={styles.nombreItem}>
                Total Ingresos
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
                Total Gastos
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
                Balance Total
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
    textAlign: "center",
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
    marginVertical: 10,
  },
  infoAyuda: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
    fontStyle: "italic",
  },
  infoDetalle: {
    fontSize: 11,
    color: "#888",
    textAlign: "center",
    marginTop: 3,
  },
  // Estilos para gráfica de Ingresos vs Egresos
  leyendaComparativa: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
    gap: 20,
  },
  itemLeyenda: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cuadradoLeyenda: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  textoLeyenda: {
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
  },
  contenidoComparativa: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 160,
    marginBottom: 15,
  },
  grupoBarrasComparativas: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 4,
  },
  barrasContainer: {
    height: 120,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 5,
  },
  barraWrapper: {
    alignItems: "center",
    marginVertical: 2,
  },
  barraIngreso: {
    width: 14,
    backgroundColor: "#00B894",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    minHeight: 2,
  },
  barraGasto: {
    width: 14,
    backgroundColor: "#FF6B6B",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    minHeight: 2,
  },
  valorBarra: {
    fontSize: 9,
    fontWeight: "600",
    marginTop: 2,
    color: "#333",
  },
  labelCategoria: {
    fontSize: 10,
    color: "#333",
    textAlign: "center",
    marginTop: 8,
    height: 28,
    maxWidth: 50,
  },
  totalesCategoria: {
    marginTop: 4,
    alignItems: "center",
  },
  totalIngreso: {
    fontSize: 9,
    color: "#00B894",
    fontWeight: "600",
  },
  totalGasto: {
    fontSize: 9,
    color: "#FF6B6B",
    fontWeight: "600",
  },
  resumenComparativa: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  // Estilos para gráfica Comparativa Mensual
  contenidoMensual: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 180,
    marginBottom: 15,
  },
  grupoMes: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 4,
  },
  barrasMensualesContainer: {
    height: 120,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 5,
  },
  barraMensualWrapper: {
    alignItems: "center",
    marginVertical: 2,
  },
  valorBarraMensual: {
    fontSize: 9,
    fontWeight: "600",
    marginTop: 2,
    color: "#333",
  },
  labelMes: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#31356E",
    marginTop: 8,
  },
  anioMes: {
    fontSize: 9,
    color: "#666",
    marginTop: 2,
  },
  balanceMes: {
    marginTop: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
  },
  textoBalance: {
    fontSize: 10,
    fontWeight: "bold",
  },
  resumenMensual: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
  },
  resumenMensualItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 4,
  },
  resumenMensualLabel: {
    fontSize: 12,
    color: "#666",
  },
  resumenMensualValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#31356E",
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