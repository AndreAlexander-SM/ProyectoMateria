import { Text, StyleSheet, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import React, { useState } from 'react';
import CrearApartado from './CApartados';

import MenuScreens from './MenuScreens';

export default function Apartados() {
    const [screen, setScreen] = useState('apartados');



    const datos = [
        { nombre: 'Comida', monto: '$200.00' },
        { nombre: 'Gasolina', monto: '$200.00' },
        { nombre: 'Renta', monto: '$200.00' },
        { nombre: 'Vacaciones', monto: '$200.00' }
    ];

    switch (screen) {
        case 'crear':
            return <CrearApartado setScreen={setScreen} />;
        case 'eliminar':
            return <EliminarA setScreen={setScreen} />;
        case 'menu':
            return <MenuScreens setScreen={setScreen} />;
        case 'apartados':
        default:
            return (
                <View style={styles.container}>

                    <View style={styles.header}>
                        <TouchableOpacity style={styles.headerBtn} onPress={() => setScreen('menu')}>
                            <Image style={styles.headerIcon} source={require('../assets/regresar.png')} />
                        </TouchableOpacity>

                        <Text style={styles.title}>Apartados</Text>


                        <TouchableOpacity style={styles.headerBtn}>
                            <Image style={styles.headerIcon} source={require('../assets/perfil.png')} />
                        </TouchableOpacity>


                    </View>
                    <View style={styles.line2} />

                    <ScrollView showsVerticalScrollIndicator={false} style={{ width: '100%' }}>
                        {datos.map((item, index) => (
                            <View key={index} style={styles.card}>

                                <TouchableOpacity style={styles.iconLeft} onPress={() => setScreen('eliminar')}>
                                    <Image style={styles.categoryIcon} source={require('../assets/eliminar.png')} />
                                </TouchableOpacity>

                                <View style={styles.cardInfo}>
                                    <Text style={styles.cardTitle}>{item.nombre}</Text>
                                    <Text style={styles.cardAmount}>{item.monto}</Text>
                                    <View style={styles.line} />
                                </View>

                                <View style={styles.actions}>
                                    <TouchableOpacity style={styles.actionBtn}>
                                        <Image style={styles.actionIcon} source={require('../assets/retiroD.png')} />
                                        <Text style={styles.actionText}>Apartar</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.actionBtn}>
                                        <Image style={styles.actionIcon} source={require('../assets/ingreso.png')} />
                                        <Text style={styles.actionText}>Retirar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </ScrollView>

                    <TouchableOpacity style={styles.addBtn} onPress={() => setScreen('crear')}>
                        <Image style={styles.addIcon} source={require('../assets/mas.png')} />
                    </TouchableOpacity>

                </View>
            );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingTop: 40,
        justifyContent: 'flex-start',
        width: '100%',
    },

    header: {
        width: '100%',
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },

    headerBtn: {
        padding: 3
    },

    headerIcon: {
        width: 30,
        height: 30
    },

    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1B1B1B'
    },

    card: {
        width: '95%',
        backgroundColor: '#E6F0F6',
        borderRadius: 20,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        alignSelf: 'center',
    },

    iconLeft: {
        marginRight: 10,
        padding: 3
    },

    categoryIcon: {
        width: 35,
        height: 35
    },

    cardInfo: {
        flex: 1
    },

    cardTitle: {
        fontSize: 17,
        fontWeight: '600'
    },

    cardAmount: {
        fontSize: 18,
        fontWeight: '700',
        marginTop: 4
    },

    line: {
        borderBottomWidth: 3,
        borderColor: '#fff',
        marginTop: 5,
        width: '90%'
    },

    line2: {
        borderBottomWidth: 2,
        borderColor: '#31356E',
        width: '100%',
        marginBottom: 20
    },

    actions: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },

    actionBtn: {
        alignItems: 'center',
        marginVertical: 4,
        marginHorizontal: 6,
    },

    actionIcon: {
        width: 35,
        height: 35,
        marginRight: 6
    },

    actionText: {
        fontSize: 13,
        fontWeight: '500',

    },

    addBtn: {
        width: 60,
        height: 60,
        backgroundColor: '#31356E',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    addIcon: {
        width: 40,
        height: 40
    }
});
