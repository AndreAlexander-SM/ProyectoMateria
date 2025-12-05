import React, { useState, useCallback } from "react";
import { Text, StyleSheet, View, TouchableOpacity, ScrollView, StatusBar, TextInput, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { UsuarioController } from "../controllers/UsuarioController";

export default function PerfilScreen({ navigation }) {
  const userCtrl = new UsuarioController();

  const [usuario, setUsuario] = useState(null);
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [passwordConfirmar, setPasswordConfirmar] = useState("");

  const [ver1, setVer1] = useState(false);
  const [ver2, setVer2] = useState(false);
  const [ver3, setVer3] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const user = userCtrl.getUsuarioActivo();

      if (user) {
        setUsuario(user);
      } else {
        navigation.replace("InicioSesion");
      }
    }, [])
  );

  const cambiarPassword = async () => {
    if (!passwordActual || !passwordNueva || !passwordConfirmar) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    if (passwordActual !== usuario.password) {
      Alert.alert("Error", "Contraseña actual incorrecta.");
      return;
    }

    if (passwordNueva !== passwordConfirmar) {
      Alert.alert("Error", "Las nuevas contraseñas no coinciden.");
      return;
    }

    const res = await userCtrl.recuperarPassword(usuario.email, passwordNueva);

    if (res) {
      Alert.alert("Éxito", "Contraseña actualizada correctamente.");
      setPasswordActual("");
      setPasswordNueva("");
      setPasswordConfirmar("");
    } else {
      Alert.alert("Error", "No se pudo actualizar la contraseña.");
    }
  };

  if (!usuario) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#46617A" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.Text}>Mi Perfil</Text>

        <View style={{ width: 26 }} />
      </View>

      <View style={styles.accountSelector}>
        <Ionicons name="person-circle" size={90} color="#31356E" />
        <Text style={styles.nombre}>{usuario.nombre}</Text>
        <Text style={styles.info}>{usuario.email}</Text>
        <Text style={styles.info}>{usuario.telefono}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subtitle}>Cambiar Contraseña</Text>

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Contraseña actual"
            secureTextEntry={!ver1}
            value={passwordActual}
            onChangeText={setPasswordActual}
          />
          <TouchableOpacity onPress={() => setVer1(!ver1)}>
            <Ionicons name={ver1 ? "eye-off" : "eye"} size={22} color="#555" />
          </TouchableOpacity>
        </View>

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Nueva contraseña"
            secureTextEntry={!ver2}
            value={passwordNueva}
            onChangeText={setPasswordNueva}
          />
          <TouchableOpacity onPress={() => setVer2(!ver2)}>
            <Ionicons name={ver2 ? "eye-off" : "eye"} size={22} color="#555" />
          </TouchableOpacity>
        </View>

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirmar nueva contraseña"
            secureTextEntry={!ver3}
            value={passwordConfirmar}
            onChangeText={setPasswordConfirmar}
          />
          <TouchableOpacity onPress={() => setVer3(!ver3)}>
            <Ionicons name={ver3 ? "eye-off" : "eye"} size={22} color="#555" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.btn} onPress={cambiarPassword}>
          <Text style={styles.btnText}>Actualizar contraseña</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#46617A",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
  },

  Text: { fontSize: 20, color: "#fff", fontWeight: "bold" },

  accountSelector: {
    backgroundColor: "#46617A",
    paddingVertical: 25,
    alignItems: "center",
  },

  nombre: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },

  info: {
    color: "#e0e0e0",
    fontSize: 14,
  },

  scrollContent: { padding: 20 },

  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 12,
  },

  btn: {
    backgroundColor: "#31356E",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
