import React, { useState } from 'react';
import { Text, StyleSheet, View, TextInput, Alert, TouchableOpacity, Switch } from 'react-native';

export default function Registro() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [telefono, setTelefono] = useState('');
  const [aceptarTerminos, setAceptarTerminos] = useState(false);
  const [recibirNoticias, setRecibirNoticias] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validarCampos = () => {
    if (nombre.trim() === '') {
      Alert.alert('Error', 'Por favor ingresa tu nombre completo');
      return false;
    }
    if (email.trim() === '' || !emailRegex.test(email)) {
      Alert.alert('Error', 'Por favor ingresa un correo válido');
      return false;
    }
    if (contraseña.trim() === '') {
      Alert.alert('Error', 'Por favor completa tu contraseña');
      return false;
    }
    if (telefono.trim() === '') {
      Alert.alert('Error', 'Por favor ingresa tu teléfono');
      return false;
    }
    if (!aceptarTerminos) {
      Alert.alert('Error', 'Debes aceptar los términos y condiciones');
      return false;
    }
    return true;
  };

  const mostrarAlerta = () => {
    if (!validarCampos()) return;
    Alert.alert('Éxito', 'Registro exitoso');
    setNombre('');
    setEmail('');
    setContraseña('');
    setTelefono('');
    setAceptarTerminos(false);
    setRecibirNoticias(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AHORRA+</Text>

      <View style={styles.loginBox}>
        <View style={styles.toggleButtons}>
          <TouchableOpacity style={[styles.smallButton, styles.activeButton]}>
            <Text style={styles.smallButtonText}>INICIAR SESIÓN</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.smallButton}>
            <Text style={styles.smallButtonText}>REGÍSTRATE</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.welcomeText}>BIENVENIDO A AHORRA+</Text>

        <Text style={styles.label}>NOMBRE COMPLETO</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. Nombre Apellido"
          placeholderTextColor="#dce6f0"
          value={nombre}
          onChangeText={setNombre}
        />

        <Text style={styles.label}>EMAIL</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. nombre@gmail.com"
          placeholderTextColor="#dce6f0"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoComplete="off"
        />

        <Text style={styles.label}>CONTRASEÑA</Text>
        <TextInput
          style={styles.input}
          placeholder="*"
          placeholderTextColor="#dce6f0"
          value={contraseña}
          onChangeText={setContraseña}
          secureTextEntry
        />

        <Text style={styles.label}>TELÉFONO</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. 5512345678"
          placeholderTextColor="#dce6f0"
          value={telefono}
          onChangeText={setTelefono}
          keyboardType="phone-pad"
        />

        <View style={styles.checkboxContainer}>
          <Switch value={aceptarTerminos} onValueChange={setAceptarTerminos} />
          <Text style={styles.checkboxLabel}>Aceptar términos y condiciones</Text>
        </View>

        <View style={styles.checkboxContainer}>
          <Switch value={recibirNoticias} onValueChange={setRecibirNoticias} />
          <Text style={styles.checkboxLabel}>
            Deseo recibir notificaciones de promociones y noticias de la aplicación.
          </Text>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={mostrarAlerta}>
          <Text style={styles.loginButtonText}>REGISTRARTE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#2C3E50',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  loginBox: {
    backgroundColor: '#46617A',
    borderRadius: 20,
    padding: 20,
    width: '88%',
    alignItems: 'center',
  },
  toggleButtons: {
    flexDirection: 'row',
    marginBottom: 12,
    width: '100%',
  },
  smallButton: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: '#A8C7E5',
    borderRadius: 18,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#B7D3EB',
  },
  smallButtonText: {
    color: '#2C3E50',
    fontWeight: 'bold',
    fontSize: 12,
  },
  welcomeText: {
    color: '#FFFFFF',
    marginBottom: 12,
    fontSize: 14,
    textAlign: 'center',
  },
  label: {
    color: '#FFFFFF',
    alignSelf: 'flex-start',
    fontSize: 12,
    marginBottom: 5,
  },
  input: {
    borderBottomColor: '#FFFFFF',
    borderBottomWidth: 1,
    color: '#FFFFFF',
    width: '100%',
    marginBottom: 12,
    paddingVertical: 6,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
  },
  checkboxLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
  },
  loginButton: {
    backgroundColor: '#A8C7E5',
    paddingVertical: 12,
    borderRadius: 30,
    marginTop: 10,
    width: '100%',
  },
  loginButtonText: {
    textAlign: 'center',
    color: '#2C3E50',
    fontWeight: 'bold',
  },
});
