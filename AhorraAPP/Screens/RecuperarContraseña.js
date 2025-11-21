import { Text, StyleSheet, View, TextInput, Alert, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';

//Recuperar contraseña mi commit
export default function RecuperarContraseña({ onBack }) {
  const [email, setEmail] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const enviarRecuperacion = () => {
    if (email.trim() === '') {
      Alert.alert('Error', 'Por favor ingresa tu correo electrónico');
      return;
    }

    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Por favor ingresa un correo válido');
      return;
    }

    Alert.alert('Recuperación enviada', 'Revisa tu correo para restablecer tu contraseña');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AHORRA+</Text>

      <View style={styles.loginBox}>
        <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. nombre@gmail.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TouchableOpacity style={styles.loginButton} onPress={enviarRecuperacion}>
          <Text style={styles.loginButtonText}>ENVIAR</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onBack}>
          <Text style={styles.recoverText}>Volver al menú</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
