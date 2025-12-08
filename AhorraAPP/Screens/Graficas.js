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
  const [graficaActiva, setGraficaActiva] = useState("pastel");
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
    const transaccionesPorMes = {};
    
    transacciones.forEach((t) => {
      try {
        if (!t || typeof t !== 'object') return;
        
        let fechaTransaccion = t.fecha;
        
        if (!fechaTransaccion) {
          fechaTransaccion = new Date().toISOString().split('T')[0];
        }
        
        const fechaStr = String(fechaTransaccion).trim();
        
        let year, month;
        
        const match1 = fechaStr.match(/(\d{4})[-\/](\d{1,2})/);
        if (match1) {
          year = match1[1];
          month = match1[2];
        } else if (fechaStr.includes('/')) {
          const parts = fechaStr.split('/');
          if (parts.length >= 3) {
            year = parts[2];
            month = parts[1];
          }
        }
        
        if (!year || !month) {
          const now = new Date();
          year = now.getFullYear().toString();
          month = (now.getMonth() + 1).toString();
        }
        
        const mesFormateado = month.padStart(2, '0');
        const mesKey = `${year}-${mesFormateado}`;
        
        if (!transaccionesPorMes[mesKey]) {
          transaccionesPorMes[mesKey] = {
            gastos: 0,
            ingresos: 0,
            balance: 0
          };
        }
        
        const monto = Math.abs(parseFloat(t.monto)) || 0;
        
        if (t.tipo === "gasto") {
          transaccionesPorMes[mesKey].gastos += monto;
        } else if (t.tipo === "ingreso") {
          transaccionesPorMes[mesKey].ingresos += monto;
        }
        
        transaccionesPorMes[mesKey].balance = 
          transaccionesPorMes[mesKey].ingresos - transaccionesPorMes[mesKey].gastos;
        
      } catch (error) {
        console.error("Error procesando transacción:", error);
      }
    });
    
    return Object.entries(transaccionesPorMes)
      .map(([mes, datos]) => ({ 
        mes, 
        gastos: datos.gastos || 0, 
        ingresos: datos.ingresos || 0, 
        balance: datos.balance || 0 
      }))
      .sort((a, b) => b.mes.localeCompare(a.mes))
      .slice(0, 6);
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

          const transacciones = await transCtrl.obtenerTodas(usuarioId);
          
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

          // DEBUG: Ver qué datos tenemos
          console.log("=== DATOS CARGADOS PARA GRÁFICAS ===");
          console.log("Total ingresos:", totalIngresos);
          console.log("Total gastos:", totalGastos);
          console.log("Categorías de ingresos:", Object.keys(ingresosPorCategoria));
          console.log("Categorías de gastos:", Object.keys(gastosPorCategoria));
          console.log("Detalle ingresos por categoría:", ingresosPorCategoria);
          console.log("Detalle gastos por categoría:", gastosPorCategoria);

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

  // MODIFICADA: Función que SOLO obtiene categorías con INGRESOS
  const obtenerCategoriasConIngresos = () => {
    const { ingresosPorCategoria } = datos;
    
    console.log("=== OBTENIENDO CATEGORÍAS CON INGRESOS ===");
    console.log("Ingresos por categoría:", ingresosPorCategoria);
    
    if (Object.keys(ingresosPorCategoria).length === 0) {
      console.log("No hay categorías con ingresos");
      return [];
    }

    const categorias = Object.entries(ingresosPorCategoria)
      .map(([categoria, monto]) => ({
        categoria: categoria || "Sin categoría",
        monto,
        porcentaje: datos.totalIngresos > 0 ? (monto / datos.totalIngresos) * 100 : 0,
        tipo: "ingreso"
      }))
      .sort((a, b) => b.monto - a.monto);
    
    console.log("Categorías con ingresos procesadas:", categorias);
    
    return categorias;
  };

  // MODIFICADA: Función que SOLO obtiene categorías con GASTOS
  const obtenerCategoriasConGastos = () => {
    const { gastosPorCategoria } = datos;
    
    if (Object.keys(gastosPorCategoria).length === 0) {
      return [];
    }

    const categorias = Object.entries(gastosPorCategoria)
      .map(([categoria, monto]) => ({
        categoria: categoria || "Sin categoría",
        monto,
        porcentaje: datos.totalGastos > 0 ? (monto / datos.totalGastos) * 100 : 0,
        tipo: "gasto"
      }))
      .sort((a, b) => b.monto - a.monto);
    
    return categorias;
  };

  // NUEVA: Función para gráfica de barras que muestra INGRESOS y GASTOS por separado
  const obtenerDatosParaGraficaBarras = () => {
    const categoriasIngresos = obtenerCategoriasConIngresos();
    const categoriasGastos = obtenerCategoriasConGastos();
    
    // Tomar las top 3 de cada tipo
    const topIngresos = categoriasIngresos.slice(0, 3);
    const topGastos = categoriasGastos.slice(0, 3);
    
    // Combinar y ordenar por monto total
    const todasCategorias = [...topIngresos, ...topGastos]
      .sort((a, b) => b.monto - a.monto)
      .slice(0, 6); // Mostrar máximo 6 categorías
    
    console.log("=== DATOS PARA GRÁFICA BARRAS ===");
    console.log("Top ingresos:", topIngresos);
    console.log("Top gastos:", topGastos);
    console.log("Todas categorías combinadas:", todasCategorias);
    
    return todasCategorias;
  };

  // FUNCIÓN MEJORADA: Calcula altura con límite máximo
  const calcularAlturaBarra = (valor, maxValor) => {
    const alturaMaxima = 80;
    
    // Si el valor es muy grande, usar escala logarítmica
    if (valor > 1000) {
      return Math.log10(valor + 1) * 25;
    } else {
      return (valor / maxValor) * alturaMaxima;
    }
  };

  // 1. GRÁFICA PASTEL MODIFICADA: Ingresos y Egresos combinados
  const renderGraficaPastelSimple = () => {
    const categoriasIngresos = obtenerCategoriasConIngresos();
    const categoriasGastos = obtenerCategoriasConGastos();
    
    // Combinar y tomar top 6
    const todasCategorias = [...categoriasIngresos, ...categoriasGastos]
      .sort((a, b) => b.monto - a.monto)
      .slice(0, 6);

    if (loading) {
      return (
        <View style={styles.graficaContainer}>
          <Text style={styles.tituloGrafica}>
            Distribución de Transacciones
          </Text>
          <Text style={styles.cargando}>Cargando datos...</Text>
        </View>
      );
    }

    if (todasCategorias.length === 0) {
      return (
        <View style={styles.graficaContainer}>
          <Text style={styles.tituloGrafica}>
            Distribución de Transacciones por Categoría
          </Text>
          <Text style={styles.sinDatos}>
            No hay transacciones registradas aún
          </Text>
        </View>
      );
    }

    const totalTransacciones = datos.totalGastos + datos.totalIngresos;

    return (
      <View style={styles.graficaContainer}>
        <Text style={styles.tituloGrafica}>
          Distribución de Transacciones por Categoría
        </Text>

        <View style={styles.contenidoPastelSimple}>
          <View style={styles.pastelSimpleVisual}>
            <View style={styles.circuloAnillos}>
              {todasCategorias.map((item, index) => {
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
                  ${totalTransacciones.toFixed(0)}
                </Text>
                <Text style={styles.labelPastelSimple}>Total Transacciones</Text>
              </View>
            </View>
          </View>

          <View style={styles.leyendaDetallada}>
            {todasCategorias.map((item, index) => (
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
                    {item.tipo === "ingreso" ? (
                      <Text style={{color: '#00B894'}}>Ingreso: +${item.monto.toFixed(2)}</Text>
                    ) : (
                      <Text style={{color: '#FF6B6B'}}>Gasto: -${item.monto.toFixed(2)}</Text>
                    )}
                    {" "}• {item.porcentaje.toFixed(1)}%
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
        
        <View style={styles.resumenPastel}>
          <View style={styles.resumenItem}>
            <Text style={styles.resumenLabel}>Ingresos totales:</Text>
            <Text style={[styles.resumenValue, { color: '#00B894' }]}>
              ${datos.totalIngresos.toFixed(2)}
            </Text>
          </View>
          <View style={styles.resumenItem}>
            <Text style={styles.resumenLabel}>Gastos totales:</Text>
            <Text style={[styles.resumenValue, { color: '#FF6B6B' }]}>
              ${datos.totalGastos.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // 2. GRÁFICA BARRAS MODIFICADA: Corregida para mostrar INGRESOS Y GASTOS correctamente
  const renderGraficaBarras = () => {
    const datosGrafica = obtenerDatosParaGraficaBarras();

    console.log("=== RENDERIZANDO GRÁFICA BARRAS ===");
    console.log("Datos para gráfica:", datosGrafica);

    if (loading) {
      return (
        <View style={styles.graficaContainer}>
          <Text style={styles.tituloGrafica}>Transacciones por Categoría</Text>
          <Text style={styles.cargando}>Cargando datos...</Text>
        </View>
      );
    }

    if (datosGrafica.length === 0) {
      return (
        <View style={styles.graficaContainer}>
          <Text style={styles.tituloGrafica}>Transacciones por Categoría</Text>
          <Text style={styles.sinDatos}>
            No hay transacciones registradas aún
          </Text>
        </View>
      );
    }

    const maxMonto = Math.max(
      ...datosGrafica.map((item) => item.monto),
      1
    );

    return (
      <View style={styles.graficaContainer}>
        <Text style={styles.tituloGrafica}>
          Transacciones por Categoría (Top {Math.min(6, datosGrafica.length)})
        </Text>

        <View style={styles.contenidoBarras}>
          <View style={styles.barrasVisualContainer}>
            {datosGrafica.map((item, index) => {
              const altura = calcularAlturaBarra(item.monto, maxMonto);
              const color = item.tipo === "ingreso" ? "#00B894" : "#FF6B6B";

              console.log(`Barra ${index}:`, {
                categoria: item.categoria,
                monto: item.monto,
                tipo: item.tipo,
                altura: altura,
                color: color
              });

              return (
                <View
                  key={`${item.categoria}-${index}`}
                  style={styles.barraGrupo}
                >
                  <View style={styles.barraContainer}>
                    <View
                      style={[
                        styles.barra,
                        {
                          height: Math.min(Math.max(altura, 4), 80),
                          backgroundColor: color,
                          borderTopLeftRadius: 4,
                          borderTopRightRadius: 4,
                        },
                      ]}
                    />
                    <Text style={styles.montoBarra}>
                      ${item.monto > 999 ? `${(item.monto/1000).toFixed(1)}k` : item.monto.toFixed(0)}
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
                  <Text style={[
                    styles.tipoCategoria,
                    { color: item.tipo === "ingreso" ? "#00B894" : "#FF6B6B" }
                  ]}>
                    {item.tipo === "ingreso" ? "Ingreso" : "Gasto"}
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
            <View style={styles.resumenItem}>
              <Text style={styles.resumenLabel}>Categorías:</Text>
              <Text style={styles.resumenValue}>
                {datosGrafica.length}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  // 3. GRÁFICA INGRESOS VS EGRESOS - Funciona bien
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

    const todasCategorias = new Set([
      ...Object.keys(gastosPorCategoria),
      ...Object.keys(ingresosPorCategoria)
    ]);

    if (todasCategorias.size === 0) {
      return (
        <View style={styles.graficaContainer}>
          <Text style={styles.tituloGrafica}>Ingresos vs Egresos por Categoría</Text>
          <Text style={styles.sinDatos}>No hay transacciones registradas aún</Text>
        </View>
      );
    }

    const datosGrafica = Array.from(todasCategorias).map((categoria, index) => ({
      categoria: categoria || "Sin categoría",
      ingresos: ingresosPorCategoria[categoria] || 0,
      gastos: gastosPorCategoria[categoria] || 0,
      color: getColor(index)
    })).sort((a, b) => (b.ingresos + b.gastos) - (a.ingresos + a.gastos))
      .slice(0, 8);

    const maxValor = Math.max(
      ...datosGrafica.map(d => Math.max(d.ingresos, d.gastos)),
      1
    );

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
            const alturaIngresos = calcularAlturaBarra(item.ingresos, maxValor);
            const alturaGastos = calcularAlturaBarra(item.gastos, maxValor);

            return (
              <View key={`${item.categoria}-${index}`} style={styles.grupoBarrasComparativas}>
                <View style={styles.barrasContainer}>
                  <View style={styles.barraWrapper}>
                    <View style={[styles.barraIngreso, { 
                      height: Math.min(Math.max(alturaIngresos, 2), 80)
                    }]} />
                    <Text style={styles.valorBarra}>
                      {item.ingresos > 0 ? `$${item.ingresos > 999 ? `${(item.ingresos/1000).toFixed(1)}k` : item.ingresos.toFixed(0)}` : ''}
                    </Text>
                  </View>
                  
                  <View style={styles.barraWrapper}>
                    <View style={[styles.barraGasto, { 
                      height: Math.min(Math.max(alturaGastos, 2), 80)
                    }]} />
                    <Text style={styles.valorBarra}>
                      {item.gastos > 0 ? `$${item.gastos > 999 ? `${(item.gastos/1000).toFixed(1)}k` : item.gastos.toFixed(0)}` : ''}
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
                    {item.ingresos > 0 ? `+$${item.ingresos > 999 ? `${(item.ingresos/1000).toFixed(1)}k` : item.ingresos.toFixed(0)}` : ''}
                  </Text>
                  <Text style={styles.totalGasto}>
                    {item.gastos > 0 ? `-$${item.gastos > 999 ? `${(item.gastos/1000).toFixed(1)}k` : item.gastos.toFixed(0)}` : ''}
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

  // 4. GRÁFICA COMPARATIVA MENSUAL
  const renderGraficaComparativaMensual = () => {
    const { transaccionesMensuales, totalGastos, totalIngresos } = datos;

    if (loading) {
      return (
        <View style={styles.graficaContainer}>
          <Text style={styles.tituloGrafica}>Comparativa Mensual</Text>
          <Text style={styles.cargando}>Cargando datos...</Text>
        </View>
      );
    }

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
            </>
          ) : (
            <Text style={styles.sinDatos}>
              No hay transacciones registradas
            </Text>
          )}
        </View>
      );
    }

    const maxValor = Math.max(
      ...transaccionesMensuales.map(m => Math.max(m.ingresos, m.gastos)),
      1
    );

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
            const alturaIngresos = calcularAlturaBarra(mesData.ingresos, maxValor);
            const alturaGastos = calcularAlturaBarra(mesData.gastos, maxValor);
            const nombreMes = obtenerNombreMes(mesData.mes);
            const nombreMesCorto = nombreMes.split(' ')[0].substring(0, 3);
            const anio = mesData.mes ? mesData.mes.split('-')[0] : '';

            return (
              <View key={`${mesData.mes}-${index}`} style={styles.grupoMes}>
                <View style={styles.barrasMensualesContainer}>
                  <View style={styles.barraMensualWrapper}>
                    <View style={[styles.barraIngreso, { 
                      height: Math.min(Math.max(alturaIngresos, 2), 80)
                    }]} />
                    <Text style={styles.valorBarraMensual}>
                      {mesData.ingresos > 0 ? `$${mesData.ingresos > 999 ? `${(mesData.ingresos/1000).toFixed(1)}k` : mesData.ingresos.toFixed(0)}` : ''}
                    </Text>
                  </View>
                  
                  <View style={styles.barraMensualWrapper}>
                    <View style={[styles.barraGasto, { 
                      height: Math.min(Math.max(alturaGastos, 2), 80)
                    }]} />
                    <Text style={styles.valorBarraMensual}>
                      {mesData.gastos > 0 ? `$${mesData.gastos > 999 ? `${(mesData.gastos/1000).toFixed(1)}k` : mesData.gastos.toFixed(0)}` : ''}
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
                    {mesData.balance >= 0 ? '+' : '-'}${Math.abs(mesData.balance) > 999 
                      ? `${(Math.abs(mesData.balance)/1000).toFixed(1)}k` 
                      : Math.abs(mesData.balance).toFixed(0)}
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
        contentContainerStyle={styles.scrollViewContent}
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
              Ing vs Eg
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
              Mensual
            </Text>
          </TouchableOpacity>
        </View>

        {graficaActiva === "pastel" && renderGraficaPastelSimple()}
        {graficaActiva === "barras" && renderGraficaBarras()}
        {graficaActiva === "ingresosVsEgresos" && renderGraficaIngresosVsEgresos()}
        {graficaActiva === "comparativaMensual" && renderGraficaComparativaMensual()}

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
  scrollViewContent: {
    paddingBottom: 20,
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
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 2,
    minHeight: 40,
  },
  botonGraficaActivo: {
    backgroundColor: "#31356E",
  },
  textoBotonGrafica: {
    fontSize: 12,
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
    minHeight: 300,
  },
  tituloGrafica: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#31356E",
    textAlign: "center",
    marginBottom: 15,
    paddingHorizontal: 10,
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
  infoAyuda: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
    fontStyle: "italic",
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
    maxHeight: 200,
  },
  filaLeyenda: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    minHeight: 40,
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
    fontSize: 13,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  datosCategoria: {
    fontSize: 11,
    color: "#666",
  },
  barraPorcentajeContainer: {
    flex: 1,
    height: 6,
    backgroundColor: "#e0e0e0",
    borderRadius: 3,
    overflow: "hidden",
    marginLeft: 10,
    maxWidth: 80,
  },
  barraPorcentaje: {
    height: "100%",
    borderRadius: 3,
  },
  resumenPastel: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
 
  contenidoBarras: {
    alignItems: "center",
    minHeight: 200,
  },
  barrasVisualContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 120,
    width: "100%",
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  barraGrupo: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: 3,
    maxWidth: 50,
  },
  barraContainer: {
    alignItems: "center",
    height: 100,
    justifyContent: "flex-end",
    width: '100%',
  },
  barra: {
    width: 20,
    minHeight: 4,
    maxHeight: 80,
  },
  montoBarra: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#31356E",
    marginTop: 4,
    textAlign: 'center',
  },
  labelBarra: {
    fontSize: 9,
    color: "#333",
    marginTop: 4,
    textAlign: "center",
    maxWidth: 45,
    height: 25,
  },
  tipoCategoria: {
    fontSize: 8,
    fontWeight: "600",
    marginTop: 2,
    textAlign: 'center',
  },
  porcentajeBarra: {
    fontSize: 8,
    color: "#666",
    marginTop: 2,
    textAlign: 'center',
  },
  resumenBarras: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 8,
    marginTop: 10,
  },
  
  leyendaComparativa: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
    gap: 15,
  },
  itemLeyenda: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  cuadradoLeyenda: {
    width: 10,
    height: 10,
    borderRadius: 3,
  },
  textoLeyenda: {
    fontSize: 11,
    color: "#333",
    fontWeight: "500",
  },
  contenidoComparativa: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 140,
    marginBottom: 10,
    minHeight: 120,
  },
  grupoBarrasComparativas: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 3,
    maxWidth: 45,
  },
  barrasContainer: {
    height: 100,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 5,
    width: '100%',
  },
  barraWrapper: {
    alignItems: "center",
    marginVertical: 2,
    width: '100%',
  },
  barraIngreso: {
    width: 12,
    backgroundColor: "#00B894",
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    minHeight: 2,
    maxHeight: 80, 
  },
  barraGasto: {
    width: 12,
    backgroundColor: "#FF6B6B",
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    minHeight: 2,
    maxHeight: 80, 
  },
  valorBarra: {
    fontSize: 8,
    fontWeight: "600",
    marginTop: 2,
    color: "#333",
    textAlign: 'center',
  },
  labelCategoria: {
    fontSize: 9,
    color: "#333",
    textAlign: "center",
    marginTop: 6,
    height: 25,
    maxWidth: 40,
  },
  totalesCategoria: {
    marginTop: 3,
    alignItems: "center",
  },
  totalIngreso: {
    fontSize: 8,
    color: "#00B894",
    fontWeight: "600",
    textAlign: 'center',
  },
  totalGasto: {
    fontSize: 8,
    color: "#FF6B6B",
    fontWeight: "600",
    textAlign: 'center',
  },
  resumenComparativa: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 8,
    marginTop: 10,
  },

  contenidoMensual: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 140,
    marginBottom: 10,
    minHeight: 130,
  },
  grupoMes: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 3,
    maxWidth: 45,
  },
  barrasMensualesContainer: {
    height: 100,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 5,
    width: '100%',
  },
  barraMensualWrapper: {
    alignItems: "center",
    marginVertical: 2,
    width: '100%',
  },
  valorBarraMensual: {
    fontSize: 8,
    fontWeight: "600",
    marginTop: 2,
    color: "#333",
    textAlign: 'center',
  },
  labelMes: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#31356E",
    marginTop: 6,
    textAlign: 'center',
  },
  anioMes: {
    fontSize: 8,
    color: "#666",
    marginTop: 2,
    textAlign: 'center',
  },
  balanceMes: {
    marginTop: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
    backgroundColor: "#f0f0f0",
    borderRadius: 3,
    minWidth: 40,
    alignItems: 'center',
  },
  textoBalance: {
    fontSize: 9,
    fontWeight: "bold",
    textAlign: 'center',
  },
  resumenMensual: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  resumenMensualItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 3,
  },
  resumenMensualLabel: {
    fontSize: 11,
    color: "#666",
  },
  resumenMensualValue: {
    fontSize: 11,
    fontWeight: "600",
    color: "#31356E",
  },
  resumenItem: {
    alignItems: "center",
    minWidth: 80,
  },
  resumenLabel: {
    fontSize: 9,
    color: "#666",
    marginBottom: 2,
    textAlign: "center",
  },
  resumenValue: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: 'center',
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