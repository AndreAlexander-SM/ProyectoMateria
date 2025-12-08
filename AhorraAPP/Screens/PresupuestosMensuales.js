import React, { useState, useCallback } from "react";
import { Text, StyleSheet, View, TouchableOpacity, Image, ScrollView, Platform, StatusBar, Modal, TextInput, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "@react-navigation/native";

import { PresupuestoController } from "../controllers/PresupuestoController";
import { UsuarioController } from "../controllers/UsuarioController";

export default function PresupuestosMensuales({ navigation }) {
  const [filtroMes, setFiltroMes] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [listaApartados, setListaApartados] = useState([]);

  const presCtrl = new PresupuestoController();
  const userCtrl = new UsuarioController();

  const cargarDatos = async () => {
    const usuario = await userCtrl.getUsuarioActivo();
    if (usuario) {
      const datos = await presCtrl.obtenerTodos(usuario.id);
      setListaApartados(datos);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [])
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoMes, setNuevoMes] = useState("");
  const [nuevoMonto, setNuevoMonto] = useState("");
  const [nuevaCategoria, setNuevaCategoria] = useState("");

  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editNombre, setEditNombre] = useState("");
  const [editMes, setEditMes] = useState("");
  const [editMonto, setEditMonto] = useState("");
  const [editCategoria, setEditCategoria] = useState("");

  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const categorias = ["Hogar", "Familia", "Despensa", "Personal", "Salud", "Transporte", "Ocio"];

  const obtenerDatosFiltrados = () => {
    return listaApartados.filter(item => {
      const coincideMes = filtroMes ? item.mes === filtroMes : true;
      const coincideCategoria = filtroCategoria ? item.categoria === filtroCategoria : true;
      return coincideMes && coincideCategoria;
    });
  };

  const datosVisibles = obtenerDatosFiltrados();

  const limpiarFiltros = () => {
    setFiltroMes("");
    setFiltroCategoria("");
  };

  const handleApartar = async () => {
    if (!nuevoNombre.trim() || !nuevoMonto || !nuevoMes || !nuevaCategoria) {
      Alert.alert("Campos incompletos", "Por favor completa todos los campos.");
      return;
    }

    const usuario = await userCtrl.getUsuarioActivo();
    if (usuario) {
      const exito = await presCtrl.crear(usuario.id, nuevoNombre, nuevaCategoria, nuevoMes, nuevoMonto);

      if (exito) {
        Alert.alert("Éxito", "Presupuesto guardado");
        setModalVisible(false);
        setNuevoNombre("");
        setNuevoMonto("");
        setNuevoMes("");
        setNuevaCategoria("");
        cargarDatos();
      } else {
        Alert.alert("Error", "No se pudo guardar");
      }
    }
  };

  const abrirModalEditar = item => {
    setEditId(item.id);
    setEditNombre(item.nombre);
    setEditMes(item.mes || "");
    setEditMonto(item.monto.replace("$", ""));
    setEditCategoria(item.categoria || "");
    setModalEditarVisible(true);
  };

  const handleActualizar = async () => {
    const exito = await presCtrl.editar(editId, editNombre, editCategoria, editMes, editMonto);
    if (exito) {
      Alert.alert("Actualizado", "Presupuesto modificado correctamente");
      setModalEditarVisible(false);
      cargarDatos();
    } else {
      Alert.alert("Error", "No se pudo actualizar");
    }
  };

  const confirmarEliminacion = id => {
    Alert.alert("Eliminar Apartado", "¿Estás seguro de que deseas eliminar este apartado?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          const exito = await presCtrl.eliminar(id);
          if (exito) cargarDatos();
        }
      }
    ]);
  };

  const renderCard = item => (
    <View key={item.id} style={styles.card}>
      <View style={styles.textContainer}>
        <Text style={styles.itemTitle}>{item.nombre}</Text>
        <Text style={styles.itemAmount}>{item.monto}</Text>
        <View style={{ flexDirection: "row", gap: 5 }}>
          <Text style={styles.badgeInfo}>{item.mes}</Text>
          <Text style={styles.badgeInfo}>{item.categoria}</Text>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.editButton} onPress={() => abrirModalEditar(item)}>
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={() => confirmarEliminacion(item.id)}>
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#46607C" />

      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else {
                navigation.navigate("Inicio");
              }
            }}
          >
            <Image style={styles.backIcon} source={require("../assets/regresar.png")} />
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>Apartados</Text>
            <Text style={styles.headerTitle}>Mensuales</Text>
          </View>
        </View>
      </View>

      <View style={styles.bodyContainer}>
        <View style={styles.filtersWrapper}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterSectionTitle}>Filtrar por:</Text>

            {(filtroMes !== "" || filtroCategoria !== "") && (
              <TouchableOpacity onPress={limpiarFiltros} style={styles.clearFilterButton}>
                <Text style={styles.clearFilterText}>Limpiar filtros ✕</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.filtersRow}>
            <View style={styles.smallPickerContainer}>
              <Picker selectedValue={filtroMes} onValueChange={setFiltroMes} style={styles.pickerStyle} mode="dropdown">
                <Picker.Item label="Todos los Meses" value="" color="#46607C" />
                {meses.map((m, i) => <Picker.Item key={i} label={m} value={m} />)}
              </Picker>
            </View>

            <View style={styles.smallPickerContainer}>
              <Picker selectedValue={filtroCategoria} onValueChange={setFiltroCategoria} style={styles.pickerStyle} mode="dropdown">
                <Picker.Item label="Todas las Categorías" value="" color="#46607C" />
                {categorias.map((c, i) => <Picker.Item key={i} label={c} value={c} />)}
              </Picker>
            </View>
          </View>

          <Text style={styles.resultsText}>Mostrando {datosVisibles.length} resultado(s)</Text>
        </View>

        <View style={styles.listWrapper}>
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {datosVisibles.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No hay resultados.</Text>
                <TouchableOpacity onPress={limpiarFiltros}>
                  <Text style={styles.emptyLink}>Ver todos</Text>
                </TouchableOpacity>
              </View>
            ) : (
              datosVisibles.map(item => renderCard(item))
            )}
          </ScrollView>

          <LinearGradient colors={["transparent", "#ffffff"]} style={styles.bottomGradient} pointerEvents="none" />
        </View>

        <View style={styles.footerContainer}>
          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Image style={styles.plusIcon} source={require("../assets/mas.png")} />
          </TouchableOpacity>
        </View>
      </View>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentContainer}>
            <Text style={styles.modalTitle}>Apartados Mensuales</Text>

            <Text style={styles.inputLabel}>¿Cual es el nombre de este apartado?</Text>
            <TextInput style={styles.modalInput} placeholder="Ingresa un nombre" placeholderTextColor="#A0A0A0" value={nuevoNombre} onChangeText={setNuevoNombre} />

            <Text style={styles.inputLabel}>Selecciona el mes:</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={nuevoMes} onValueChange={setNuevoMes} style={styles.pickerStyle} dropdownIconColor="#A0A0A0" mode="dropdown">
                <Picker.Item label="Opciones" value="" color="#A0A0A0" enabled={false} />
                {meses.map((mes, index) => <Picker.Item key={index} label={mes} value={mes} color="#000" />)}
              </Picker>
            </View>

            <Text style={styles.inputLabel}>Selecciona la categoria:</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={nuevaCategoria} onValueChange={setNuevaCategoria} style={styles.pickerStyle} dropdownIconColor="#A0A0A0" mode="dropdown">
                <Picker.Item label="Categorias" value="" color="#A0A0A0" enabled={false} />
                {categorias.map((cat, index) => <Picker.Item key={index} label={cat} value={cat} color="#000" />)}
              </Picker>
            </View>

            <View style={styles.amountContainer}>
              <TextInput style={styles.bigAmountInput} placeholder="$ 0.00" placeholderTextColor="#000" keyboardType="numeric" value={nuevoMonto} onChangeText={setNuevoMonto} />
            </View>

            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.modalButton, styles.apartarButton]} onPress={handleApartar}>
                <Text style={styles.modalButtonText}>Apartar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal animationType="slide" transparent={true} visible={modalEditarVisible} onRequestClose={() => setModalEditarVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentContainer}>
            <Text style={styles.modalTitle}>Actualizar apartado</Text>

            <Text style={styles.inputLabel}>Nombre</Text>
            <TextInput style={styles.modalInput} placeholder="Ingresa un nombre" placeholderTextColor="#A0A0A0" value={editNombre} onChangeText={setEditNombre} />

            <Text style={styles.inputLabel}>Selecciona el mes:</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={editMes} onValueChange={setEditMes} style={styles.pickerStyle} dropdownIconColor="#A0A0A0" mode="dropdown">
                <Picker.Item label="Opciones" value="" color="#A0A0A0" enabled={false} />
                {meses.map((mes, index) => <Picker.Item key={index} label={mes} value={mes} color="#000" />)}
              </Picker>
            </View>

            <Text style={styles.inputLabel}>Selecciona la categoria:</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={editCategoria} onValueChange={setEditCategoria} style={styles.pickerStyle} dropdownIconColor="#A0A0A0" mode="dropdown">
                <Picker.Item label="Categorias" value="" color="#A0A0A0" enabled={false} />
                {categorias.map((cat, index) => <Picker.Item key={index} label={cat} value={cat} color="#000" />)}
              </Picker>
            </View>

            <View style={styles.amountContainer}>
              <TextInput style={styles.bigAmountInput} placeholder="$ 0.00" placeholderTextColor="#000" keyboardType="numeric" value={editMonto} onChangeText={setEditMonto} />
            </View>

            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalEditarVisible(false)}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.modalButton, styles.updateButton]} onPress={handleActualizar}>
                <Text style={styles.modalButtonText}>Actualizar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    backgroundColor: "#46607C",
    width: "100%",
    height: 157,
    justifyContent: "center",
    paddingTop: Platform.OS === "android" ? 20 : 0,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  backButton: {
    padding: 5,
    marginRight: 10,
    position: "absolute",
    left: 20,
    top: 0,
    zIndex: 10,
  },
  backIcon: {
    width: 30,
    height: 30,
    tintColor: "#fff",
    resizeMode: "contain",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  bodyContainer: {
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
  filtersWrapper: {
    width: "90%",
    marginTop: 15,
    marginBottom: 5,
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
    paddingHorizontal: 2,
  },
  filterSectionTitle: {
    fontSize: 14,
    color: "#46607C",
    fontWeight: "bold",
  },
  clearFilterButton: {
    paddingVertical: 2,
    paddingHorizontal: 5,
  },
  clearFilterText: {
    fontSize: 12,
    color: "#FF3B30",
    fontWeight: "600",
  },
  filtersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  smallPickerContainer: {
    flex: 1,
    backgroundColor: "#E8F0F5",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    overflow: "hidden",
  },
  resultsText: {
    fontSize: 12,
    color: "#7f8c8d",
    marginTop: 5,
    textAlign: "right",
    marginRight: 5,
  },
  listWrapper: {
    flex: 1,
    width: "100%",
    position: "relative",
  },
  scrollView: {
    width: "100%",
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 30,
  },
  emptyText: {
    color: "#999",
    fontSize: 16,
  },
  emptyLink: {
    color: "#46607C",
    fontWeight: "bold",
    marginTop: 5,
  },
  bottomGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
    zIndex: 1,
  },
  card: {
    backgroundColor: "#E8F0F5",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#bdc3c7",
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  itemTitle: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
  itemAmount: {
    fontSize: 18,
    color: "#000",
    fontWeight: "600",
    marginTop: 2,
    marginBottom: 4,
  },
  badgeInfo: {
    fontSize: 10,
    color: "#fff",
    backgroundColor: "#95a5a6",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: "hidden",
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  editButton: {
    backgroundColor: "#FFAB00",
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
  footerContainer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#fff",
  },
  addButton: {
    width: 60,
    height: 60,
    backgroundColor: "#ABC4D8",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  plusIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContentContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 25,
    alignItems: "center",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#31356E",
    marginBottom: 25,
  },
  inputLabel: {
    alignSelf: "flex-start",
    fontSize: 16,
    color: "#000",
    marginBottom: 10,
    marginLeft: 5,
  },
  modalInput: {
    width: "100%",
    backgroundColor: "#E8F0F5",
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    marginBottom: 20,
    color: "#000",
  },
  pickerContainer: {
    width: "100%",
    backgroundColor: "#E8F0F5",
    borderRadius: 15,
    marginBottom: 20,
    height: Platform.OS === "ios" ? 120 : 50,
    justifyContent: "center",
    overflow: "hidden",
  },
  pickerStyle: {
    width: "100%",
  },
  amountContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  bigAmountInput: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    width: "100%",
    padding: 5,
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 25,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#FF3B30",
  },
  apartarButton: {
    backgroundColor: "#FFAB00",
  },
  updateButton: {
    backgroundColor: "#1DCC98",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
