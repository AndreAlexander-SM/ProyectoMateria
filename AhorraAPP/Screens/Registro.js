import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
  Switch,
} from "react-native";
import { UsuarioController } from "../controllers/UsuarioController";

export default function Registro({ navigation }) {
  const controller = new UsuarioController();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [telefono, setTelefono] = useState("");
  const [aceptarTerminos, setAceptarTerminos] = useState(false);

  const handleRegistro = async () => {
    if (!nombre || !email || !contraseña)
      return Alert.alert("Error", "Llena los campos obligatorios");

    if (!aceptarTerminos)
      return Alert.alert("Error", "Acepta los términos");

    const resultado = await controller.registrar(
      nombre,
      email,
      contraseña,
      telefono
    );

    if (resultado.success) {
      Alert.alert("Éxito", "Registro exitoso", [
        { text: "OK", onPress: () => navigation.navigate("InicioSesion") },
      ]);
    } else {
      Alert.alert("Error", resultado.msg);
    }
  };

  // ... (RESTO DEL CÓDIGO VISUAL IGUAL, solo cambia el return del render)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AHORRA+</Text>

      <View style={styles.loginBox}>
        {/* ... (Todo igual que antes) ... */}

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
          <Switch
            value={aceptarTerminos}
            onValueChange={setAceptarTerminos}
          />
          <Text style={styles.checkboxLabel}>
            Aceptar términos y condiciones
          </Text>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleRegistro}>
          <Text style={styles.loginButtonText}>REGISTRARTE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ... (STYLES IGUALES)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    color: "#2C3E50",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
  },

  loginBox: {
    backgroundColor: "#46617A",
    borderRadius: 20,
    padding: 20,
    width: "88%",
    alignItems: "center",
  },

  welcomeText: {
    color: "#FFFFFF",
    marginBottom: 12,
    fontSize: 14,
    textAlign: "center",
  },

  label: {
    color: "#FFFFFF",
    alignSelf: "flex-start",
    fontSize: 12,
    marginBottom: 5,
  },

  input: {
    borderBottomColor: "#FFFFFF",
    borderBottomWidth: 1,
    color: "#FFFFFF",
    width: "100%",
    marginBottom: 12,
    paddingVertical: 6,
  },

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    width: "100%",
  },

  checkboxLabel: {
    color: "#FFFFFF",
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
  },

  loginButton: {
    backgroundColor: "#A8C7E5",
    paddingVertical: 12,
    borderRadius: 30,
    marginTop: 10,
    width: "100%",
  },

  loginButtonText: {
    textAlign: "center",
    color: "#2C3E50",
    fontWeight: "bold",
  },
});
