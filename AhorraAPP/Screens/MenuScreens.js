import { Text, StyleSheet, View, Button } from 'react-native';
import React, { useState } from 'react';

import AutenticacionUsuario from './Autenticacion';
import Gestion from './GestionDeTransacciones';
import GraficasdeDatos from './Graficas';
import Presupuestos from './PresupuestosMensuales';
import LoginScreen from './LoginScreen';
import InicioSesion from './InicioSesion';

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

    case 'menu':
    default:
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Menu Principal</Text>

          <Button 
            onPress={() => SetScreen('Autenticacion')} 
            title="Autenticacion de Usuario" 
          />

          <Button 
            onPress={() => SetScreen('gestion')} 
            title="Gestion de Transacciones" 
          />

          <Button 
            onPress={() => SetScreen('graficas')} 
            title="Graficas" 
          />

          <Button 
            onPress={() => SetScreen('presupuesto')} 
            title="Presupuestos Mensuales" 
          />

          <Button 
            onPress={() => SetScreen('LoginScreen')} 
            title="Login" 
          />

          <Button 
            onPress={() => SetScreen('InicioSesion')} 
            title="Inicio de Sesión" 
          />
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#cceeff', 
    padding: 30 
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#2e2e2e', 
    marginBottom: 40 
  },
  button: { 
    backgroundColor: '#6a5acd', 
    paddingVertical: 14, 
    paddingHorizontal: 30, 
    borderRadius: 12, 
    marginVertical: 15, 
    width: '80%', 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '600' 
  },
});