import React, { useState } from "react";
import { Text, StyleSheet, View, TextInput, Alert, TouchableOpacity, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { UsuarioController } from "../controllers/UsuarioController";

export default function Registro({ navigation }) {
  const controller = new UsuarioController();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [telefono, setTelefono] = useState("");
  const [aceptarTerminos, setAceptarTerminos] = useState(false);
  const [verPassword, setVerPassword] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const telefonoRegex = /^[0-9]{10}$/;

  const validarCampos = () => {
    if (nombre.trim() === "") return Alert.alert("Error", "Por favor ingresa tu nombre completo");
    if (email.trim() === "" || !emailRegex.test(email)) return Alert.alert("Error", "Correo inválido");
    if (!telefonoRegex.test(telefono.trim())) return Alert.alert("Error", "El teléfono debe tener 10 dígitos numéricos");
    if (contraseña.trim() === "") return Alert.alert("Error", "Completa tu contraseña");
    if (!aceptarTerminos) return Alert.alert("Error", "Debes aceptar los términos");
;
    return true;
  };

  const mostrarAlerta = async () => {
    if (!validarCampos()) return;

    const resultado = await controller.registrar(nombre, email, contraseña, telefono);

    if (resultado.success) {
      Alert.alert("¡Registro Exitoso!", "Ahora puedes iniciar sesión.", [
        { text: "Ir a Iniciar Sesión", onPress: () => navigation.navigate("InicioSesion") }
      ]);

      setNombre("");
      setEmail("");
      setContraseña("");
      setTelefono("");
      setAceptarTerminos(false);
    } else {
      Alert.alert("Error", resultado.msg);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AHORRA+</Text>

      <View style={styles.loginBox}>
        <View style={styles.toggleButtons}>
          <TouchableOpacity style={styles.smallButton} onPress={() => navigation.navigate("InicioSesion")}>
            <Text style={styles.smallButtonText}>INICIAR SESIÓN</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.smallButton, styles.activeButton]}>
            <Text style={styles.smallButtonText}>REGÍSTRATE</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            placeholder="NOMBRE"
            placeholderTextColor="gray"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder="EMAIL"
            placeholderTextColor="gray"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
            placeholder="TELÉFONO"
            placeholderTextColor="gray"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={contraseña}
            onChangeText={setContraseña}
            secureTextEntry={!verPassword}
            placeholder="CONTRASEÑA"
            placeholderTextColor="gray"
          />
          <TouchableOpacity onPress={() => setVerPassword(!verPassword)} style={styles.eyeIcon}>
            <Ionicons name={verPassword ? "eye-off" : "eye"} size={20} color="gray" />
          </TouchableOpacity>
        </View>

        <View style={styles.checkboxContainer}>
          <Switch value={aceptarTerminos} onValueChange={setAceptarTerminos} />
          <Text style={styles.checkboxLabel}>Acepto términos y condiciones</Text>
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
  toggleButtons: {
    flexDirection: "row",
    marginBottom: 12,
    width: "100%",
  },
  smallButton: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: "#A8C7E5",
    borderRadius: 18,
    marginHorizontal: 5,
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "#B7D3EB",
  },
  smallButtonText: {
    color: "#2C3E50",
    fontWeight: "bold",
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    paddingHorizontal: 20,
    marginBottom: 12,
    height: 45,
    width: "100%",
  },
  input: {
    flex: 1,
    color: "#000",
    height: "100%",
  },
  eyeIcon: {
    paddingLeft: 10,
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
