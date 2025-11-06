import { Text, StyleSheet, View, Button } from 'react-native';
import React, { useState } from 'react';
import AutenticacionUsuario from './Autenticacion';
import GestionDeTransacciones from './GestionDeTransacciones';
import GraficasdeDatos from './Graficas';
import Presupuestos from './PresupuestosMensuales';
import LoginScreen from './LoginScreen';


export default function Menu() {
    const[screen, SetScreen] = useState('menu');

    switch (screen) {
        case 'Autenticacion':
            return <AutenticacionUsuario/>
        case 'gestion':
            return <GestionDeTransacciones onBack={() => SetScreen('menu')} />;
        case 'graficas':
            return <GraficasdeDatos/>
        case 'presupuesto':
            return <Presupuestos/>
       case 'LoginScreen':
            return <LoginScreen />
        case 'menu':
        default:
            return (
                <View style={styles.container}>
                    <Text style={styles.title}>Menu Principal</Text>
                    <Button onPress={() => SetScreen('Autenticacion')} title="Autenticacion de Usuario" />
                    <Button onPress={() => SetScreen('gestion')} title="Gestion de Transacciones" />
                    <Button onPress={() => SetScreen('graficas')} title="Graficas" />
                    <Button onPress={() => SetScreen('presupuesto')} title="Presupuestos Mensuales" />
                    <Button onPress={() => SetScreen('LoginScreen')} title="Login" />
                </View>
            )
    }
}

const styles = StyleSheet.create({})