import React, { useState } from 'react';
import { 
    Text, StyleSheet, View, TouchableOpacity, SafeAreaView, Image, 
    ScrollView, StatusBar, Platform 
} from 'react-native';

export default function Graficas({ navigation }) {
    const [graficaActiva, setGraficaActiva] = useState('pastel'); // 'pastel' o 'barras'

  
    const datosEjemplo = {
        totalGastos: 4850,
        totalIngresos: 9500,
        balance: 4650,
        gastosPorCategoria: {
            'Compras': 1500,
            'Comida': 1250,
            'Servicios': 1200,
            'Entretenimiento': 600,
            'Otros': 300
        }
    };

    const coloresCategorias = {
        'Compras': '#71e3ebff',
        'Comida': '#4698c1ff',
        'Servicios': 'rgba(73, 116, 185, 0.98)',
        'Entretenimiento': '#255490ff',
        'Otros': '#3a4a81ff'
    };

    const getMensajeBalance = () => {
        const { balance } = datosEjemplo;
        if (balance > 0) {
            return `Tus ingresos superan tus gastos en $${balance.toFixed(2)} este mes, ¡Sigue así!`;
        } else if (balance < 0) {
            return `Tus gastos superan tus ingresos en $${Math.abs(balance).toFixed(2)} este mes.`;
        } else {
            return 'Tus ingresos y gastos están equilibrados este mes.';
        }
    };

  
    const calcularPorcentajes = () => {
        const total = datosEjemplo.totalGastos;
        if (total === 0) return null;

        return Object.entries(datosEjemplo.gastosPorCategoria).map(([categoria, monto]) => ({
            categoria,
            monto,
            porcentaje: total > 0 ? (monto / total) * 100 : 0
        }));
    };

    const renderGraficaPastel = () => {
        const porcentajes = calcularPorcentajes();

        return (
            <View style={styles.graficaContainer}>
                <Text style={styles.tituloGrafica}>Distribución de Gastos</Text>
                
                <View style={styles.contenidoGrafica}>
                    <View style={styles.imagenPastel}>
                        <Image
                            source={require('../assets/pastel.png')}
                            style={styles.pastel}
                            resizeMode="contain"
                        />
                        <View style={styles.infoPastel}>
                            <Text style={styles.totalGastos}>
                                ${datosEjemplo.totalGastos.toFixed(2)}
                            </Text>
                            <Text style={styles.labelTotal}>Total Gastado</Text>
                        </View>
                    </View>

                    <View style={styles.categorias}>
                        {porcentajes && porcentajes.map((item) => (
                            <View key={item.categoria} style={styles.itemCategoria}>
                                <View style={[styles.colorBox, { backgroundColor: coloresCategorias[item.categoria] }]} />
                                <View style={styles.infoCategoria}>
                                    <Text style={styles.nombreCategoria}>{item.categoria}</Text>
                                    <Text style={styles.montoCategoria}>
                                        ${item.monto.toFixed(2)} ({item.porcentaje.toFixed(1)}%)
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
               </View>
        );
       };

    
    const renderGraficaBarras = () => {
        return (
            <View style={styles.graficaContainer}>
                <Text style={styles.tituloGrafica}>Ingresos vs Gastos</Text>
                
                <View style={styles.contenidoGrafica}>
                    <View style={styles.imagenBarras}>
                        <Image
                            source={require('../assets/barras.png')}
                            style={styles.barras}
                            resizeMode="contain"
                        />
                    </View>

                    <View style={styles.datosBarras}>
                        <View style={styles.datoItem}>
                            <View style={[styles.datoColor, { backgroundColor: '#4CAF50' }]} />
                            <View style={styles.datoInfo}>
                                <Text style={styles.datoLabel}>Ingresos Totales</Text>
                                <Text style={styles.datoValor}>
                                    ${datosEjemplo.totalIngresos.toFixed(2)}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.datoItem}>
                            <View style={[styles.datoColor, { backgroundColor: '#F44336' }]} />
                            <View style={styles.datoInfo}>
                                <Text style={styles.datoLabel}>Gastos Totales</Text>
                                <Text style={styles.datoValor}>
                                    ${datosEjemplo.totalGastos.toFixed(2)}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.datoItem}>
                            <View style={[styles.datoColor, { 
                                backgroundColor: datosEjemplo.balance >= 0 ? '#4CAF50' : '#F44336' 
                            }]} />
                            <View style={styles.datoInfo}>
                                <Text style={styles.datoLabel}>Balance Final</Text>
                                <Text style={[styles.datoValor, { 
                                    color: datosEjemplo.balance >= 0 ? '#4CAF50' : '#F44336' 
                                }]}>
                                    ${datosEjemplo.balance.toFixed(2)}
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
            
            {}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Inicio')}>
                    <Image style={styles.backIcon} source={require('../assets/regresar.png')} />
                </TouchableOpacity>

                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>Gráficas</Text>
                    <Text style={styles.titleText}>Financieras</Text>
                </View>
            </View>

            {}

            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
                {/* Selector de Tipo de Gráfica */}
                <View style={styles.selectorGraficas}>
                    <TouchableOpacity 
                        style={[
                            styles.botonGrafica,
                            graficaActiva === 'pastel' && styles.botonGraficaActivo
                        ]}
                        onPress={() => setGraficaActiva('pastel')}
                    >
                        <Text style={[
                            styles.textoBotonGrafica,
                            graficaActiva === 'pastel' && styles.textoBotonGraficaActivo
                        ]}>
                            Gráfico Pastel
                        </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[
                            styles.botonGrafica,
                            graficaActiva === 'barras' && styles.botonGraficaActivo
                        ]}
                        onPress={() => setGraficaActiva('barras')}
                    >
                        <Text style={[
                            styles.textoBotonGrafica,
                            graficaActiva === 'barras' && styles.textoBotonGraficaActivo
                        ]}>
                            Gráfico Barras
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Gráfica Activa */}
                {graficaActiva === 'pastel' ? renderGraficaPastel() : renderGraficaBarras()}

                {/* Resumen Financiero */}
                <View style={styles.resumenContainer}>
                    <Text style={styles.tituloResumen}>Resumen Financiero</Text>
                    
                    <View style={styles.listaInfo}>
                        <View style={styles.itemColor}>
                            <View style={[styles.colorBox, { backgroundColor: '#495cb1ff' }]} />
                            <Text style={styles.nombreColor}>Gastos Totales</Text>
                            <Text style={styles.monto}>${datosEjemplo.totalGastos.toFixed(2)}</Text>
                        </View>

                        <View style={styles.itemColor}>
                            <View style={[styles.colorBox, { backgroundColor: '#cfccc9ff' }]} />
                            <Text style={styles.nombreColor}>Ingresos Totales</Text>
                            <Text style={styles.monto}>${datosEjemplo.totalIngresos.toFixed(2)}</Text>
                        </View>

                        <View style={styles.itemColor}>
                            <View style={[styles.colorBox, { 
                                backgroundColor: datosEjemplo.balance >= 0 ? '#4CAF50' : '#F44336' 
                            }]} />
                            <Text style={styles.nombreColor}>Balance Final</Text>
                            <Text style={[styles.monto, { 
                                color: datosEjemplo.balance >= 0 ? '#4CAF50' : '#F44336' 
                            }]}>
                                ${datosEjemplo.balance.toFixed(2)}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.linea} />

                <Text style={styles.textoFinal}>
                    {getMensajeBalance()}
                </Text>

                {/* Botones de acción */}
                <View style={styles.botonesAccion}>
                    <TouchableOpacity 
                        style={styles.botonAccion}
                        onPress={() => navigation.navigate('AgregarGasto')}
                    >
                        <Text style={styles.textoBotonAccion}>+ Agregar Gasto</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.botonAccion, styles.botonIngreso]}
                        onPress={() => navigation.navigate('AgregarIngreso')}
                    >
                        <Text style={styles.textoBotonAccion}>+ Agregar Ingreso</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
    },
   
    header: {
        width: '100%',
        backgroundColor: '#46607C', 
        height: 157,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: Platform.OS === 'android' ? 20 : 0, 
        marginBottom: 20,
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        left: 20,
        top: 55, 
        padding: 5,
        zIndex: 10,
    },
    backIcon: {
        width: 30,
        height: 30,
        tintColor: '#fff', 
    },
    titleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    titleText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff', 
        textAlign: 'center',
        lineHeight: 28,
    },
  
    
    selectorGraficas: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginHorizontal: 20,
        marginBottom: 20,
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        padding: 5,
    },
    botonGrafica: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 8,
        marginHorizontal: 5,
    },
    botonGraficaActivo: {
        backgroundColor: '#31356E',
    },
    textoBotonGrafica: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    textoBotonGraficaActivo: {
        color: 'white',
    },
    graficaContainer: {
        backgroundColor: '#f8f8f8',
        marginHorizontal: 20,
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
    },
    tituloGrafica: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#31356E',
        textAlign: 'center',
        marginBottom: 15,
    },
    contenidoGrafica: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    imagenPastel: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        position: 'relative',
    },
    pastel: {
        width: 150,
        height: 150,
    },
    infoPastel: {
        position: 'absolute',
        alignItems: 'center',
    },
    totalGastos: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#31356E',
    },
    labelTotal: {
        fontSize: 12,
        color: '#666',
    },
    categorias: {
        flex: 1,
        marginLeft: 10,
    },
    itemCategoria: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6,
    },
    infoCategoria: {
        flex: 1,
    },
    nombreCategoria: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    montoCategoria: {
        fontSize: 12,
        color: '#666',
    },
    imagenBarras: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    barras: {
        width: 180,
        height: 120,
    },
    datosBarras: {
        flex: 1,
        marginLeft: 10,
    },
    datoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    datoColor: {
        width: 16,
        height: 16,
        borderRadius: 4,
        marginRight: 10,
    },
    datoInfo: {
        flex: 1,
    },
    datoLabel: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    datoValor: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#31356E',
    },
    resumenContainer: {
        marginHorizontal: 20,
        marginBottom: 20,
    },
    tituloResumen: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#31356E',
        marginBottom: 15,
        textAlign: 'center',
    },
    listaInfo: {
        backgroundColor: '#f8f8f8',
        borderRadius: 12,
        padding: 15,
    },
    itemColor: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 8,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    nombreColor: {
        flex: 1,
        fontSize: 16,
        color: '#171616ff',
        fontWeight: 'bold',
        marginLeft: 8,
    },
    monto: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#31356E',
    },
    colorBox: {
        width: 16,
        height: 16,
        borderRadius: 4,
    },
    linea: {
        height: 2,
        backgroundColor: '#393737ff',
        marginVertical: 20,
        marginHorizontal: 20,
    },
    textoFinal: {
        color: 'gray',
        fontSize: 16,
        marginTop: 10,
        marginBottom: 20,
        marginHorizontal: 25,
        textAlign: 'center',
        lineHeight: 22,
    },
    botonesAccion: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    botonAccion: {
        backgroundColor: '#31356E',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    botonIngreso: {
        backgroundColor: '#4CAF50',
    },
    textoBotonAccion: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
});