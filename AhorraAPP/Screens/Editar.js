import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker"; 
import { UsuarioController } from "../controllers/UsuarioController";
import { PresupuestoController } from "../controllers/PresupuestoController";

export default function Editar({ onBack, onNext, onUpdate, item }) {
  const [monto, setMonto] = useState("");
  const [categoria, setCategoria] = useState("");
  const [fecha, setFecha] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState("gasto");

  const [listaApartados, setListaApartados] = useState([]);

  const userCtrl = new UsuarioController();
  const presCtrl = new PresupuestoController();
  
  const categoriasFijas = ["Hogar", "Familia", "Despensa", "Personal", "Salud", "Transporte", "Ocio", "Nomina", "Extra"];

  useEffect(() => {
    const cargarApartados = async () => {
      const usuario = await userCtrl.getUsuarioActivo();
      if (usuario) {
        const apartados = await presCtrl.obtenerTodos(usuario.id);
        setListaApartados(apartados);
      }
    };
    cargarApartados();
  }, []);

  useEffect(() => {
    if (item) {
      setMonto(item.monto.toString());
      setCategoria(item.categoria);
      setFecha(item.fecha);
      setDescripcion(item.descripcion);
      setTipo(item.tipo);
    }
  }, [item]);

  const handleUpdate = () => {
    if (tipo === "gasto") {
      const apartadoSeleccionado = listaApartados.find(a => a.nombre === categoria);
      
      if (apartadoSeleccionado) {
        let montoDisponible = parseFloat(apartadoSeleccionado.monto.toString().replace("$", "").replace(",", ""));
        
        if (item && item.categoria === categoria && item.tipo === "gasto") {
             montoDisponible += parseFloat(item.monto);
        }

        const montoEgreso = parseFloat(monto);

        if (montoEgreso > montoDisponible) {
          Alert.alert(
            "Fondos Insuficientes", 
            `Esta edición excede el presupuesto. Tu apartado "${categoria}" tendría un balance negativo.\n\nDisponible real: $${montoDisponible.toFixed(2)}`,
            [{ text: "Entendido" }]
          );
          return; 
        }
      }
    }
    
    onUpdate(monto, categoria, fecha, descripcion, tipo);
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

        <Text style={styles.title}>Editar Transacción</Text>

        <View style={{ width: 30 }} />
      </View>

      <View style={styles.line2} />

      <View style={styles.content}>
        <View
          style={{
            flexDirection: "row",
            marginBottom: 10,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              color: tipo === "gasto" ? "red" : "green",
            }}
          >
            {tipo === "gasto" ? "GASTO" : "INGRESO"}
          </Text>
        </View>

        <TextInput
          placeholder="Monto"
          style={styles.input}
          keyboardType="numeric"
          value={monto}
          onChangeText={setMonto}
        />

        {/* Picker de Categorías */}
        <View style={styles.pickerContainer}>
            <Picker
                selectedValue={categoria}
                onValueChange={(itemValue) => setCategoria(itemValue)}
                style={styles.picker}
                mode="dropdown"
            >
                <Picker.Item label="Selecciona Categoría" value="" color="#999" />
                {categoriasFijas.map((cat, index) => (
                    <Picker.Item key={index} label={cat} value={cat} color="black" />
                ))}
            </Picker>
        </View>

        <TextInput
          placeholder="Fecha"
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
            onPress={handleUpdate} 
          >
            <Text style={styles.textoBoton}>Actualizar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.boton, styles.delete]}
            onPress={onNext}
          >
            <Text style={[styles.textoBoton, { color: "white" }]}>
              Eliminar
            </Text>
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

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 10,
    width: "100%",
    justifyContent: "center",
    height: 50, 
    overflow: 'hidden',
  },
  picker: {
    width: "100%",
    height: "100%",
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

  delete: {
    backgroundColor: "#d63031",
    marginLeft: 10,
  },

  textoBoton: {
    color: "black",
    textAlign: "center",
    fontWeight: "600",
  },
});