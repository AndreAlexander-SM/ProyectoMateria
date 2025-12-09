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

  // --- AYUDANTES ---
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
    
    // CORRECCIÓN 1: Se agregaron las comillas invertidas (backticks)
    return `${meses[mesIndex].substring(0, 3)} ${year}`;
  };

  const procesarTransaccionesMensuales = (transacciones) => {
    const transaccionesPorMes = {};
    
    transacciones.forEach((t) => {
      try {
        if (!t || typeof t !== 'object') return;
        let fechaTransaccion = t.fecha || new Date().toISOString().split('T')[0];
        const fechaStr = String(fechaTransaccion).trim();
        let year, month;
        
        const match1 = fechaStr.match(/(\d{4})[-\/](\d{1,2})/);
        if (match1) { year = match1[1]; month = match1[2]; }
        else if (fechaStr.includes('/')) {
          const parts = fechaStr.split('/');
          if (parts.length >= 3) { year = parts[2]; month = parts[1]; }
        }
        
        if (!year || !month) {
          const now = new Date();
          year = now.getFullYear().toString();
          month = (now.getMonth() + 1).toString();
        }
        
        const mesFormateado = month.padStart(2, '0');
        
        // CORRECCIÓN 2: Se agregaron backticks
        const mesKey = `${year}-${mesFormateado}`;
        
        if (!transaccionesPorMes[mesKey]) {
          transaccionesPorMes[mesKey] = { gastos: 0, ingresos: 0, balance: 0 };
        }
        
        const monto = Math.abs(parseFloat(t.monto)) || 0;
        if (t.tipo === "gasto") transaccionesPorMes[mesKey].gastos += monto;
        else if (t.tipo === "ingreso") transaccionesPorMes[mesKey].ingresos += monto;
        
        transaccionesPorMes[mesKey].balance = transaccionesPorMes[mesKey].ingresos - transaccionesPorMes[mesKey].gastos;
      } catch (error) { console.error("Error procesando mes:", error); }
    });
    
    return Object.entries(transaccionesPorMes)
      .map(([mes, datos]) => ({ mes, ...datos }))
      .sort((a, b) => a.mes.localeCompare(b.mes)) // Orden cronológico
      .slice(-6); // Últimos 6 meses
  };

  useFocusEffect(
    useCallback(() => {
      const cargarDatos = async () => {
        try {
          setLoading(true);
          const usuario = await userCtrl.getUsuarioActivo();
          const usuarioId = usuario ? usuario.id : 1;

          const transacciones = await transCtrl.obtenerTodas(usuarioId);
          
          const gastosPorCat = {};
          const ingresosPorCat = {};
          let tGastos = 0;
          let tIngresos = 0;

          transacciones.forEach(t => {
            const valor = Math.abs(parseFloat(t.monto)) || 0;
            const cat = t.categoria || "Sin categoría";
            if (t.tipo === "gasto") {
              tGastos += valor;
              gastosPorCat[cat] = (gastosPorCat[cat] || 0) + valor;
            } else if (t.tipo === "ingreso") {
              tIngresos += valor;
              ingresosPorCat[cat] = (ingresosPorCat[cat] || 0) + valor;
            }
          });

          setDatos({
            totalGastos: tGastos,
            totalIngresos: tIngresos,
            balance: tIngresos - tGastos,
            gastosPorCategoria: gastosPorCat,
            ingresosPorCategoria: ingresosPorCat,
            transaccionesMensuales: procesarTransaccionesMensuales(transacciones)
          });
        } catch (error) {
          console.error("Error cargando datos:", error);
        } finally {
          setLoading(false);
        }
      };
      cargarDatos();
    }, [])
  );

  const coloresBase = ["#FF6B6B", "#4ECDC4", "#FFE66B", "#1A535C", "#FF9F1C", "#574B90", "#F78FB3"];
  const getColor = (index) => coloresBase[index % coloresBase.length];

  const getMensajeBalance = () => {
    const { balance } = datos;
    // CORRECCIÓN 3: Se agregaron backticks a los mensajes de retorno
    if (balance > 0) return `¡Excelente! Tienes un superávit de $${balance.toFixed(2)}.`;
    if (balance < 0) return `Cuidado, gastas más de lo que ingresas por $${Math.abs(balance).toFixed(2)}.`;
    return "Tus finanzas están perfectamente equilibradas.";
  };

  const calcularAlturaBarra = (valor, maxValor) => {
    if (!maxValor || maxValor === 0) return 0;
    const alturaMaxima = 120; 
    const altura = (valor / maxValor) * alturaMaxima;
    return Math.max(5, Math.min(altura, alturaMaxima));
  };

  // --- 1. GRÁFICA PASTEL ---
  const renderGraficaPastelSimple = () => {
    const categoriasIngresos = Object.entries(datos.ingresosPorCategoria).map(([k, v]) => ({
      categoria: k, monto: v, tipo: "ingreso", porcentaje: (v / datos.totalIngresos) * 100
    }));
    const categoriasGastos = Object.entries(datos.gastosPorCategoria).map(([k, v]) => ({
      categoria: k, monto: v, tipo: "gasto", porcentaje: (v / datos.totalGastos) * 100
    }));
    
    const todasCategorias = [...categoriasIngresos, ...categoriasGastos]
      .sort((a, b) => b.monto - a.monto)
      .slice(0, 5);

    if (loading) return <View style={styles.card}><Text style={styles.cargando}>Cargando...</Text></View>;
    if (todasCategorias.length === 0) return <View style={styles.card}><Text style={styles.sinDatos}>Sin datos</Text></View>;

    const totalTransacciones = datos.totalGastos + datos.totalIngresos;

    return (
      <View style={styles.card}>
        <Text style={styles.tituloGrafica}>Distribución (Top 5)</Text>
        <View style={styles.contenidoPastel}>
          {/* Visualización de Anillos */}
          <View style={styles.circuloAnillos}>
            {todasCategorias.map((item, index) => {
              const size = 160 - (index * 25); 
              return (
                <View key={item.categoria + index} style={[styles.anilloPastel, {
                  width: size, height: size, borderRadius: size / 2,
                  borderColor: getColor(index), zIndex: 10 - index
                }]} />
              );
            })}
            <View style={styles.centroPastelSimple}>
              <Text style={styles.totalPastelSimple}>${totalTransacciones.toFixed(0)}</Text>
              <Text style={styles.labelPastelSimple}>Total</Text>
            </View>
          </View>

          {/* Leyenda */}
          <View style={styles.leyendaContainer}>
            {todasCategorias.map((item, index) => (
              <View key={index} style={styles.filaLeyenda}>
                <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
                  <View style={[styles.marcadorColor, { backgroundColor: getColor(index) }]} />
                  <Text style={styles.nombreCategoria} numberOfLines={1}>{item.categoria}</Text>
                </View>
                <View style={{alignItems: 'flex-end'}}>
                  <Text style={[styles.montoLeyenda, { color: item.tipo === 'ingreso' ? '#00B894' : '#FF6B6B' }]}>
                    {item.tipo === 'ingreso' ? '+' : '-'}${item.monto.toFixed(0)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  // --- 2. GRÁFICA BARRAS ---
  const renderGraficaBarras = () => {
    const catIng = Object.entries(datos.ingresosPorCategoria).map(([k, v]) => ({ categoria: k, monto: v, tipo: "ingreso" }));
    const catGas = Object.entries(datos.gastosPorCategoria).map(([k, v]) => ({ categoria: k, monto: v, tipo: "gasto" }));
    
    const todas = [...catIng.sort((a,b)=>b.monto-a.monto).slice(0,3), ...catGas.sort((a,b)=>b.monto-a.monto).slice(0,3)];
    
    if (loading) return <View style={styles.card}><Text style={styles.cargando}>Cargando...</Text></View>;
    if (todas.length === 0) return <View style={styles.card}><Text style={styles.sinDatos}>Sin datos</Text></View>;

    const maxMonto = Math.max(...todas.map(i => i.monto), 1);

    return (
      <View style={styles.card}>
        <Text style={styles.tituloGrafica}>Top Categorías</Text>
        <View style={styles.contenedorBarras}>
          {todas.map((item, index) => {
            const altura = calcularAlturaBarra(item.monto, maxMonto);
            return (
              <View key={index} style={styles.columnaBarra}>
                {/* CORRECCIÓN 4: Se arregló el template literal dentro del JSX para mostrar 'k' */}
                <Text style={styles.valorBarra}>
                    ${item.monto > 999 ? `${(item.monto/1000).toFixed(1)}k` : item.monto.toFixed(0)}
                </Text>
                <View style={[styles.barra, { height: altura, backgroundColor: item.tipo === 'ingreso' ? '#00B894' : '#FF6B6B' }]} />
                <Text style={styles.etiquetaBarra} numberOfLines={1}>{item.categoria}</Text>
              </View>
            );
          })}
        </View>
        
        <View style={styles.resumenBarras}>
          <View style={styles.itemResumen}>
            <View style={[styles.dot, {backgroundColor: '#00B894'}]} />
            <Text style={styles.txtResumen}>Ingresos</Text>
          </View>
          <View style={styles.itemResumen}>
            <View style={[styles.dot, {backgroundColor: '#FF6B6B'}]} />
            <Text style={styles.txtResumen}>Gastos</Text>
          </View>
        </View>
      </View>
    );
  };

  // --- 3. COMPARATIVA (Ingresos vs Egresos) ---
  const renderGraficaIngresosVsEgresos = () => {
    const { gastosPorCategoria, ingresosPorCategoria } = datos;
    const todasCats = new Set([...Object.keys(gastosPorCategoria), ...Object.keys(ingresosPorCategoria)]);
    
    if (todasCats.size === 0) return <View style={styles.card}><Text style={styles.sinDatos}>Sin datos</Text></View>;

    const datosGrafica = Array.from(todasCats).map(cat => ({
      categoria: cat,
      ingresos: ingresosPorCategoria[cat] || 0,
      gastos: gastosPorCategoria[cat] || 0,
    })).sort((a,b) => (b.ingresos+b.gastos) - (a.ingresos+a.gastos)).slice(0, 5);

    const maxValor = Math.max(...datosGrafica.map(d => Math.max(d.ingresos, d.gastos)), 1);

    return (
      <View style={styles.card}>
        <Text style={styles.tituloGrafica}>Ingresos vs Egresos</Text>
        <View style={styles.contenedorComparativa}>
          {datosGrafica.map((item, index) => {
            const hIng = calcularAlturaBarra(item.ingresos, maxValor);
            const hGas = calcularAlturaBarra(item.gastos, maxValor);
            
            return (
              <View key={index} style={styles.grupoComparativo}>
                <View style={styles.barrasPar}>
                  {item.ingresos > 0 && (
                    <View style={[styles.barraComparativa, { height: hIng, backgroundColor: '#00B894', marginRight: 2 }]} />
                  )}
                  {item.gastos > 0 && (
                    <View style={[styles.barraComparativa, { height: hGas, backgroundColor: '#FF6B6B' }]} />
                  )}
                </View>
                <Text style={styles.etiquetaBarra} numberOfLines={1}>{item.categoria}</Text>
              </View>
            );
          })}
        </View>
        <View style={styles.leyendaSimple}>
           <Text style={{color:'#00B894', fontWeight:'bold'}}>Verde: Ingreso</Text>
           <Text style={{color:'#FF6B6B', fontWeight:'bold', marginLeft: 15}}>Rojo: Gasto</Text>
        </View>
      </View>
    );
  };

  // --- 4. MENSUAL ---
  const renderGraficaComparativaMensual = () => {
    const { transaccionesMensuales } = datos;
    if (transaccionesMensuales.length === 0) return <View style={styles.card}><Text style={styles.sinDatos}>Sin historial mensual</Text></View>;

    const maxValor = Math.max(...transaccionesMensuales.map(m => Math.max(m.ingresos, m.gastos)), 1);

    return (
      <View style={styles.card}>
        <Text style={styles.tituloGrafica}>Historial Mensual</Text>
        <View style={styles.contenedorComparativa}>
          {transaccionesMensuales.map((item, index) => {
            const hIng = calcularAlturaBarra(item.ingresos, maxValor);
            const hGas = calcularAlturaBarra(item.gastos, maxValor);
            
            return (
              <View key={index} style={styles.grupoComparativo}>
                <View style={styles.barrasPar}>
                  <View style={[styles.barraComparativa, { height: hIng, backgroundColor: '#00B894', marginRight: 2 }]} />
                  <View style={[styles.barraComparativa, { height: hGas, backgroundColor: '#FF6B6B' }]} />
                </View>
                <Text style={styles.etiquetaBarra}>{obtenerNombreMes(item.mes)}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#46607C" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.btnBack} onPress={() => navigation.goBack()}>
          <Image source={require("../assets/regresar.png")} style={styles.iconBack} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Estadísticas</Text>
        <View style={{width: 30}} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal: 15}}>
          {[
            {id: 'pastel', label: 'General'},
            {id: 'barras', label: 'Categorías'},
            {id: 'ingresosVsEgresos', label: 'Vs'},
            {id: 'comparativaMensual', label: 'Mensual'}
          ].map((tab) => (
            <TouchableOpacity 
              key={tab.id} 
              style={[styles.tabBtn, graficaActiva === tab.id && styles.tabBtnActive]}
              onPress={() => setGraficaActiva(tab.id)}
            >
              <Text style={[styles.tabTxt, graficaActiva === tab.id && styles.tabTxtActive]}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Renderizado Condicional */}
        {graficaActiva === 'pastel' && renderGraficaPastelSimple()}
        {graficaActiva === 'barras' && renderGraficaBarras()}
        {graficaActiva === 'ingresosVsEgresos' && renderGraficaIngresosVsEgresos()}
        {graficaActiva === 'comparativaMensual' && renderGraficaComparativaMensual()}

        {/* Resumen Final (Siempre visible) */}
        <View style={styles.card}>
          <Text style={styles.tituloGrafica}>Resumen Total</Text>
          <View style={styles.filaResumen}>
            <Text style={styles.lblResumen}>Ingresos</Text>
            <Text style={[styles.valResumen, {color: '#00B894'}]}>+${datos.totalIngresos.toFixed(2)}</Text>
          </View>
          <View style={styles.filaResumen}>
            <Text style={styles.lblResumen}>Gastos</Text>
            <Text style={[styles.valResumen, {color: '#FF6B6B'}]}>-${datos.totalGastos.toFixed(2)}</Text>
          </View>
          <View style={styles.separador} />
          <View style={styles.filaResumen}>
            <Text style={[styles.lblResumen, {fontWeight: 'bold'}]}>Balance</Text>
            <Text style={[styles.valResumen, {fontWeight: 'bold', color: datos.balance >= 0 ? '#31356E' : '#FF6B6B'}]}>
              ${datos.balance.toFixed(2)}
            </Text>
          </View>
          <Text style={styles.msgBalance}>{getMensajeBalance()}</Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F4F7", 
  },
  header: {
    backgroundColor: "#46607C",
    paddingTop: Platform.OS === "android" ? 40 : 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  btnBack: { padding: 5 },
  iconBack: { width: 25, height: 25, tintColor: '#fff' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },

  tabsContainer: {
    marginTop: 15,
    marginBottom: 5,
    height: 50,
  },
  tabBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 10,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  tabBtnActive: { backgroundColor: '#31356E', borderColor: '#31356E' },
  tabTxt: { color: '#666', fontWeight: '600' },
  tabTxtActive: { color: '#fff' },

  scrollContent: {
    padding: 15,
    paddingBottom: 40,
  },

  // --- ESTILOS DE TARJETA (CARD) ---
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    // Sombras suaves
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  tituloGrafica: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#31356E',
    marginBottom: 20,
    textAlign: 'center',
  },
  cargando: { textAlign: 'center', marginVertical: 20, color: '#888' },
  sinDatos: { textAlign: 'center', marginVertical: 20, color: '#AAA', fontStyle: 'italic' },

  // --- PASTEL ---
  contenidoPastel: { alignItems: 'center' },
  circuloAnillos: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  anilloPastel: {
    position: 'absolute',
    borderWidth: 10, // Anillos más visibles
  },
  centroPastelSimple: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    width: 70, height: 70, borderRadius: 35,
    elevation: 5, shadowColor: '#000', shadowOpacity: 0.1,
  },
  totalPastelSimple: { fontWeight: 'bold', color: '#31356E', fontSize: 14 },
  labelPastelSimple: { fontSize: 10, color: '#888' },
  
  leyendaContainer: { width: '100%' },
  filaLeyenda: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  marcadorColor: { width: 12, height: 12, borderRadius: 6, marginRight: 10 },
  nombreCategoria: { fontSize: 14, color: '#333', fontWeight: '500' },
  montoLeyenda: { fontSize: 14, fontWeight: '600' },

  // --- BARRAS ---
  contenedorBarras: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 180, // Altura fija suficiente
    paddingBottom: 10,
  },
  columnaBarra: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  valorBarra: { fontSize: 10, color: '#666', marginBottom: 4 },
  barra: {
    width: 20, // Ancho fijo
    borderRadius: 4,
    minHeight: 4,
  },
  etiquetaBarra: {
    fontSize: 10,
    color: '#333',
    marginTop: 6,
    textAlign: 'center',
    width: 50, // Limitar ancho texto
  },
  
  resumenBarras: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
    gap: 20,
  },
  itemResumen: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 5 },
  txtResumen: { fontSize: 12, color: '#555' },

  // --- COMPARATIVAS ---
  contenedorComparativa: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 180,
  },
  grupoComparativo: {
    alignItems: 'center',
    flex: 1,
  },
  barrasPar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  barraComparativa: {
    width: 14, 
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    minHeight: 4,
  },
  leyendaSimple: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },

  // --- RESUMEN FINAL ---
  filaResumen: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  lblResumen: { fontSize: 16, color: '#555' },
  valResumen: { fontSize: 16, fontWeight: '500' },
  separador: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 10 },
  msgBalance: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
  },
});