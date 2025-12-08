import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, Linking } from "react-native";

import { TransaccionController } from "../controllers/TransaccionController";
import { UsuarioController } from "../controllers/UsuarioController";

export default function Agregar({ onBack, onSave }) {
  const [monto, setMonto] = useState("");
  const [categoria, setCategoria] = useState("");
  const [fecha, setFecha] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState("gasto");

  const transCtrl = new TransaccionController();
  const userCtrl = new UsuarioController();

  const handleSave = async () => {
    if (!monto || !categoria || !fecha) {
      return Alert.alert("Error", "Campos obligatorios vacíos");
    }

    const usuario = await userCtrl.getUsuarioActivo();

    if (!usuario) {
      return Alert.alert("Error", "No hay sesión activa");
    }

    const resultado = await transCtrl.agregar(
      usuario.id,
      monto,
      categoria,
      fecha,
      descripcion,
      tipo
    );

    if (resultado.success) {
      if (resultado.alerta) {
        Alert.alert(
          "⚠️ LÍMITE EXCEDIDO",
          `Has superado tu presupuesto en la categoría: ${categoria}.\n\nLímite: $${resultado.limite}\nTotal Gastado: $${resultado.total}\n\n¿Quieres enviar el reporte por correo?`,
          [
            {
              text: "No",
              onPress: () => {
                if (onSave) onSave();
                onBack();
              }
            },
            {
              text: "Sí, Enviar Correo",
              onPress: () => {
                const asunto = `Alerta de Presupuesto: ${categoria}`;
                const cuerpo = `Hola ${usuario.nombre},\n\nAtención: Has excedido tu presupuesto mensual en ${categoria}.\n\n- Tu límite asignado: $${resultado.limite}\n- Tu gasto total actual: $${resultado.total}\n\nTe recomendamos revisar tus gastos.`;
                
                const url = `mailto:${usuario.email}?subject=${asunto}&body=${cuerpo}`;
                Linking.openURL(url).catch(() => Alert.alert("Error", "No se pudo abrir la app de correo"));

                if (onSave) onSave();
                onBack();
              }
            }
          ]
        );
      } else {
        Alert.alert("¡Listo!", "Transacción guardada correctamente", [
          {
            text: "OK",
            onPress: () => {
              if (onSave) onSave();
              onBack();
            },
          },
        ]);
      }
    } else {
      Alert.alert("Error", "No se pudo guardar la transacción");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={onBack}>
          <Image
            style={styles.headerIcon}
            source={require("../assets/regresar.png")}
          />
        </TouchableOpacity>

        <Text style={styles.title}>Agregar Transacción</Text>

        <View style={{ width: 30 }} />
      </View>

      <View style={styles.line2} />

      <View style={styles.content}>
        <View style={{ flexDirection: "row", marginBottom: 15 }}>
          <TouchableOpacity
            onPress={() => setTipo("gasto")}
            style={[
              styles.typeBtn,
              tipo === "gasto" ? { backgroundColor: "#ff3b30" } : {},
            ]}
          >
            <Text style={{ color: tipo === "gasto" ? "white" : "black" }}>
              Gasto
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setTipo("ingreso")}
            style={[
              styles.typeBtn,
              tipo === "ingreso" ? { backgroundColor: "#00dcb4" } : {},
            ]}
          >
            <Text style={{ color: tipo === "ingreso" ? "white" : "black" }}>
              Ingreso
            </Text>
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="Monto"
          style={styles.input}
          keyboardType="numeric"
          value={monto}
          onChangeText={setMonto}
        />

        <TextInput
          placeholder="Categoría (Ej. Hogar)"
          style={styles.input}
          value={categoria}
          onChangeText={setCategoria}
        />

        <TextInput
          placeholder="Fecha (DD/MM/AAAA)"
          style={styles.input}
          value={fecha}
          onChangeText={setFecha}
        />

        <TextInput
          placeholder="Descripción"
          style={[styles.input, styles.textArea]}
          multiline
          value={descripcion}
          onChangeText={setDescripcion}
        />

        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.boton, styles.cancel]}
            onPress={onBack}
          >
            <Text style={styles.textoBoton}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.boton, styles.guardar]}
            onPress={handleSave}
          >
            <Text style={styles.textoBoton}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 50,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },

  headerBtn: {
    padding: 3,
  },

  headerIcon: {
    width: 30,
    height: 30,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1B1B1B",
  },

  line2: {
    borderBottomWidth: 2,
    borderColor: "#31356E",
    width: "100%",
    marginBottom: 20,
  },

  content: {
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: "center",
  },

  typeBtn: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },

  textArea: {
    height: 100,
    textAlignVertical: "top",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  boton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  cancel: {
    backgroundColor: "#e0e0e0",
    marginRight: 10,
  },

  guardar: {
    backgroundColor: "#31356E",
    marginLeft: 10,
  },

  textoBoton: {
    color: "black",
    textAlign: "center",
    fontWeight: "600",
  },
});
