import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';

import AutenticacionUsuario from './Autenticacion';
import Gestion from './GestionDeTransacciones';
import GraficasdeDatos from './Graficas';
import Presupuestos from './PresupuestosMensuales';
import LoginScreen from './LoginScreen';
import InicioSesion from './InicioSesion';
import Registro from './Registro';

export default function Menu() {
  const [screen, SetScreen] = useState('menu');

  switch (screen) {
    case 'Autenticacion':
      return <AutenticacionUsuario />;

    case 'gestion':
      return <Gestion onBack={() => SetScreen('menu')} />;

    case 'graficas':
      return <GraficasdeDatos />;

    case 'presupuesto':
      return <Presupuestos />;

    case 'LoginScreen':
      return <LoginScreen />;

    case 'InicioSesion':
      return <InicioSesion />;
    case 'Registro':
      return <Registro />

    case 'menu':
    default:
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Menú Principal</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => SetScreen('gestion')}>
            <Text style={styles.buttonText}>GESTIÓN DE TRANSACCIONES</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => SetScreen('graficas')}>
            <Text style={styles.buttonText}>GRÁFICOS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => SetScreen('presupuesto')}>
            <Text style={styles.buttonText}>PRESUPUESTOS MENSUALES</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => SetScreen('LoginScreen')}>
            <Text style={styles.buttonText}>ACCESO</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => SetScreen('InicioSesion')}>
            <Text style={styles.buttonText}>INICIO DE SESIÓN</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => SetScreen('Registro')}>
            <Text style={styles.buttonText}>Registro</Text>
          </TouchableOpacity>
        </View>

      

      );
  }
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#cceeff', // fondo celeste
    padding: 30 
  },

  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#222', 
    marginBottom: 30, 
    textAlign: 'center'
  },

  button: { 
    backgroundColor: '#2196f3', 
    paddingVertical: 14, 
    paddingHorizontal: 25, 
    borderRadius: 6, 
    marginVertical: 8, 
    width: '80%', 
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4
  },

  buttonText: { 
    color: '#fff', 
    fontSize: 15, 
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 0.5
  },
});
