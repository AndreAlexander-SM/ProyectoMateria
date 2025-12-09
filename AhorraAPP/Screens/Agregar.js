import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, Linking, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from '@react-native-community/datetimepicker';

import { TransaccionController } from "../controllers/TransaccionController";
import { UsuarioController } from "../controllers/UsuarioController";
import { PresupuestoController } from "../controllers/PresupuestoController";

export default function Agregar({ onBack, onSave }) {
  const [monto, setMonto] = useState("");
  const [categoria, setCategoria] = useState("");
  
  const [fecha, setFecha] = useState(""); 
  const [date, setDate] = useState(new Date()); 
  const [showDatePicker, setShowDatePicker] = useState(false); 

  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState("gasto");

  const [listaApartados, setListaApartados] = useState([]); 

  const transCtrl = new TransaccionController();
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

  const formatearFecha = (rawDate) => {
    let dia = rawDate.getDate();
    let mes = rawDate.getMonth() + 1; 
    let anio = rawDate.getFullYear();

    if (dia < 10) dia = '0' + dia;
    if (mes < 10) mes = '0' + mes;

    return `${dia}/${mes}/${anio}`;
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
    setFecha(formatearFecha(currentDate));
    
    if (Platform.OS === 'android') {
        setShowDatePicker(false);
    }
  };

  const mostrarCalendario = () => {
    setShowDatePicker(true);
  };

  const cambiarTipo = (nuevoTipo) => {
    setTipo(nuevoTipo);
    setCategoria(""); 
  };

  const handleSave = async () => {
    if (!monto || !categoria || !fecha) {
      return Alert.alert("Error", "Campos obligatorios vacíos");
    }

    // --- NUEVA VALIDACIÓN DE PRESUPUESTO ---
    if (tipo === "gasto") {
      // 1. Buscamos el apartado seleccionado en la lista cargada
      const apartadoSeleccionado = listaApartados.find(item => item.nombre === categoria);
      
      if (apartadoSeleccionado) {
        // 2. Limpiamos los valores de símbolos ($) y comas (,) para compararlos como números
        const montoDisponible = parseFloat(apartadoSeleccionado.monto.toString().replace("$", "").replace(",", ""));
        const montoEgreso = parseFloat(monto);

        // 3. Comparamos
        if (montoEgreso > montoDisponible) {
          Alert.alert(
            "Fondos Insuficientes", // Título de la alerta
            `No puedes gastar $${montoEgreso} porque tu apartado "${categoria}" solo tiene $${montoDisponible} disponibles.\n\nPor favor corrige la cantidad.`,
            [{ text: "Entendido" }]
          );
          return; // <--- IMPORTANTE: Esto detiene la función aquí y NO guarda nada.
        }
      }
    }
    // ---------------------------------------

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
      // Mantenemos tu lógica de alertas post-guardado por si acaso (para control de límites mensuales acumulados)
      if (resultado.alerta) {
        Alert.alert(
          "⚠️ LÍMITE EXCEDIDO",
          `Has superado tu presupuesto en: ${categoria}.\n\nLímite: $${resultado.limite}\nTotal Gastado: $${resultado.total}\n\n¿Quieres enviar el reporte por correo?`,
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
            onPress={() => cambiarTipo("gasto")}
            style={[
              styles.typeBtn,
              tipo === "gasto" ? { backgroundColor: "#ff3b30" } : {},
            ]}
          >
            <Text style={{ color: tipo === "gasto" ? "white" : "black" }}>
              Egreso
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => cambiarTipo("ingreso")}
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

        <View style={styles.pickerContainer}>
            <Picker
                selectedValue={categoria}
                onValueChange={(itemValue) => setCategoria(itemValue)}
                style={styles.picker}
                mode="dropdown"
            >
                <Picker.Item 
                  label={tipo === "gasto" ? "Selecciona Apartado" : "Selecciona Categoría"} 
                  value="" 
                  color="#999" 
                  enabled={false} 
                />
                
                {tipo === "gasto" ? (
                  listaApartados.length > 0 ? (
                    listaApartados.map((item) => (
                      <Picker.Item key={item.id} label={item.nombre} value={item.nombre} color="black" />
                    ))
                  ) : (
                    <Picker.Item label="No hay apartados creados" value="" enabled={false} />
                  )
                ) : (
                  categoriasFijas.map((cat, index) => (
                    <Picker.Item key={index} label={cat} value={cat} color="black" />
                  ))
                )}
            </Picker>
        </View>

        <TouchableOpacity onPress={mostrarCalendario} style={styles.dateInputContainer}>
            <Text style={fecha ? styles.dateText : styles.placeholderText}>
                {fecha || "Selecciona Fecha (DD/MM/AAAA)"}
            </Text>
        </TouchableOpacity>

        {showDatePicker && (
            <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                display="default"
                onChange={onDateChange}
                maximumDate={new Date()} 
            />
        )}

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
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 10,
    width: "100%",
    justifyContent: "center",
    height: 54,
    overflow: 'hidden',
  },
  picker: {
    width: "100%",
    height: "100%",
  },
  dateInputContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    width: "100%",
    justifyContent: 'center'
  },
  dateText: {
    color: 'black',
    fontSize: 14,
  },
  placeholderText: {
    color: '#999', 
    fontSize: 14,
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