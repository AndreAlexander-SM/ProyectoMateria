import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  Modal,
  TextInput,
  Platform
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function Transacciones({ onNext, onEdit, navigation }) {
  // --- ESTADOS ---
  const [activeTab, setActiveTab] = useState('fecha');
  
  // Lista de Transacciones
  const [listaTransacciones, setListaTransacciones] = useState([
    { id: 1, monto: "$60.00", concepto: "Hogar", tipo: "ingreso", fecha: "27 de noviembre de 2025", descripcion: "Compra de artículos de limpieza" },
    { id: 2, monto: "-$160.00", concepto: "Despensa", tipo: "gasto", fecha: "27 de noviembre de 2025", descripcion: "Súper semanal" },
    { id: 3, monto: "$200.00", concepto: "Personal", tipo: "ingreso", fecha: "27 de noviembre de 2025", descripcion: "Pago de deuda" },
    { id: 4, monto: "-$70.00", concepto: "Familia", tipo: "gasto", fecha: "27 de noviembre de 2025", descripcion: "Salida al cine" },
    { id: 5, monto: "$60.00", concepto: "Hogar", tipo: "ingreso", fecha: "27 de noviembre de 2025", descripcion: "Ajuste de cuentas" },
    { id: 6, monto: "-$160.00", concepto: "Despensa", tipo: "gasto", fecha: "27 de noviembre de 2025", descripcion: "Frutas y verduras" },
    { id: 7, monto: "-$70.00", concepto: "Familia", tipo: "gasto", fecha: "27 de noviembre de 2025", descripcion: "Regalo de cumpleaños" },
  ]);

  // --- ESTADOS PARA MODAL CREAR/EDITAR ---
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [mostrarOpcionesCategoria, setMostrarOpcionesCategoria] = useState(false);
  const opcionesCategoria = ["Familia", "Personal", "Hogar", "Despensa"];
  const [fecha, setFecha] = useState(new Date());
  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);

  // --- NUEVOS ESTADOS PARA MODAL DE DETALLE (INFO) ---
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Categorías únicas
  const uniqueCategories = [...new Set(listaTransacciones.map(item => item.concepto))];

  // --- FUNCIONES ---
  const onChangeFecha = (event, selectedDate) => {
    const currentDate = selectedDate || fecha;
    setMostrarDatePicker(Platform.OS === 'ios');
    setFecha(currentDate);
    if (Platform.OS === 'android') {
      setMostrarDatePicker(false);
    }
  };

  const formatearFecha = (date) => {
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // --- FUNCIONES CREAR/EDITAR ---
  const abrirModalCrear = () => {
    setIsEditMode(false);
    setEditId(null);
    setMonto('');
    setCategoriaSeleccionada('');
    setDescripcion('');
    setFecha(new Date());
    setModalVisible(true);
  };

  const abrirModalEditar = (item) => {
    setIsEditMode(true);
    setEditId(item.id);
    const montoLimpio = item.monto.replace('$', '').replace('-', '');
    setMonto(montoLimpio);
    setCategoriaSeleccionada(item.concepto);
    setDescripcion(item.descripcion || ""); 
    setFecha(new Date()); 
    setModalVisible(true);
  };

  const guardarTransaccion = () => {
    if (isEditMode) {
      const nuevaLista = listaTransacciones.map(item => {
        if (item.id === editId) {
            const signo = item.tipo === 'gasto' ? '-' : ''; 
            return {
                ...item,
                monto: `${signo}$${monto}`,
                concepto: categoriaSeleccionada,
                fecha: formatearFecha(fecha),
                descripcion: descripcion
            };
        }
        return item;
      });
      setListaTransacciones(nuevaLista);
    } else {
      // Lógica crear dummy
      console.log("Creando...");
    }
    cerrarModal();
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setMostrarOpcionesCategoria(false);
  };

  // --- NUEVA FUNCIÓN: ABRIR DETALLE ---
  const abrirDetalle = (item) => {
    setSelectedTransaction(item);
    setDetailModalVisible(true);
  };

  // --- RENDER CARD ---
  const renderCard = (item, index) => (
    <View key={item.id || index} style={styles.card}>
      {/* AHORA EL ICONO ES UN TOUCHABLE OPACITY */}
      <TouchableOpacity 
        style={styles.iconContainer} 
        onPress={() => abrirDetalle(item)}
      >
        <MaterialIcons name="info" size={30} color="#00dcb4" />
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <Text style={[
          styles.montoText,
          item.tipo === 'gasto' ? styles.textRed : styles.textBlack
        ]}>
          {item.monto}
        </Text>
        <Text style={styles.conceptoText}>{item.concepto}</Text>
        {activeTab === 'fecha' && (
          <Text style={styles.fechaDetailText}>{item.fecha}</Text>
        )}
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.btnEditar} onPress={() => abrirModalEditar(item)}>
          <Text style={styles.btnTextSmall}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnEliminar}>
          <Text style={styles.btnTextSmall}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      
      {/* --- MODAL 1: CREAR / EDITAR (Existente) --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={cerrarModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.modalInput}
              placeholder="Monto"
              placeholderTextColor="#666"
              keyboardType="numeric"
              value={monto}
              onChangeText={setMonto}
            />
            <View style={{ zIndex: 10 }}> 
              <TouchableOpacity 
                style={styles.modalInputSelector} 
                onPress={() => setMostrarOpcionesCategoria(!mostrarOpcionesCategoria)}
              >
                <Text style={{ color: categoriaSeleccionada ? '#000' : '#666' }}>
                  {categoriaSeleccionada || "Categoria"}
                </Text>
                <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
              </TouchableOpacity>
              {mostrarOpcionesCategoria && (
                <View style={styles.dropdownList}>
                  {opcionesCategoria.map((opcion, index) => (
                    <TouchableOpacity 
                      key={index} 
                      style={styles.dropdownItem}
                      onPress={() => {
                        setCategoriaSeleccionada(opcion);
                        setMostrarOpcionesCategoria(false);
                      }}
                    >
                      <Text>{opcion}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            <TouchableOpacity 
              style={styles.modalInputSelector} 
              onPress={() => setMostrarDatePicker(true)}
            >
              <Text style={{ color: '#000' }}>{formatearFecha(fecha)}</Text>
              <MaterialIcons name="calendar-today" size={20} color="#333" />
            </TouchableOpacity>
            {mostrarDatePicker && (
              <DateTimePicker
                value={fecha}
                mode="date"
                display="default"
                onChange={onChangeFecha}
              />
            )}
            <TextInput
              style={[styles.modalInput, { height: 80, textAlignVertical: 'top' }]}
              placeholder="Descripción"
              placeholderTextColor="#666"
              multiline={true}
              value={descripcion}
              onChangeText={setDescripcion}
            />
            <View style={styles.modalButtonsRow}>
              <TouchableOpacity style={styles.btnCancel} onPress={cerrarModal}>
                <Text style={styles.btnModalText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                    styles.btnAction, 
                    { backgroundColor: isEditMode ? "#FFAB00" : "#00C9A7" }
                ]} 
                onPress={guardarTransaccion}
              >
                <Text style={styles.btnModalText}>
                    {isEditMode ? "Actualizar" : "Crear"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* --- MODAL 2: DETALLE INFO (Nuevo) --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={detailModalVisible}
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            {/* Campos de solo lectura estilizados como la imagen */}
            <View style={styles.detailBox}>
                <Text style={styles.detailText}>
                    Monto: <Text style={{fontWeight: 'normal'}}>{selectedTransaction?.monto}</Text>
                </Text>
            </View>

            <View style={styles.detailBox}>
                <Text style={styles.detailText}>
                    Categoría: <Text style={{fontWeight: 'normal'}}>{selectedTransaction?.concepto}</Text>
                </Text>
            </View>

            <View style={styles.detailBox}>
                <Text style={styles.detailText}>
                    Fecha: <Text style={{fontWeight: 'normal'}}>{selectedTransaction?.fecha}</Text>
                </Text>
            </View>

            <View style={[styles.detailBox, { height: 100, justifyContent: 'flex-start', paddingTop: 10 }]}>
                <Text style={styles.detailText}>
                    Descripción: <Text style={{fontWeight: 'normal'}}>
                        {selectedTransaction?.descripcion || "Pagos de servicios del hogar."}
                    </Text>
                </Text>
            </View>

            {/* Botón Regresar */}
            <View style={{ alignItems: 'center', marginTop: 20 }}>
                <TouchableOpacity 
                    style={styles.btnRegresar} 
                    onPress={() => setDetailModalVisible(false)}
                >
                    <Text style={styles.btnModalText}>Regresar</Text>
                </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>


      {/* --- HEADER --- */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => navigation ? navigation.goBack() : console.log("Back")}
            style={styles.backButton}
          >
            <Image
              style={styles.backIcon}
              source={require("../assets/regresar.png")}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Transacciones</Text>
          <View style={{ width: 32 }} />
        </View>
      </View>

      <View style={styles.bodyContainer}>
        <Text style={styles.subHeaderTitle}>Categorías</Text>
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'fecha' && styles.activeTabBorder]}
            onPress={() => setActiveTab('fecha')}
          >
            <Text style={[styles.tabText, activeTab === 'fecha' && styles.activeTabText]}>
              Fecha
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'categoria' && styles.activeTabBorder]}
            onPress={() => setActiveTab('categoria')}
          >
            <Text style={[styles.tabText, activeTab === 'categoria' && styles.activeTabText]}>
              Categoría
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 60 }}
        >
          {activeTab === 'categoria' ? (
            uniqueCategories.map((categoriaName, groupIndex) => {
              const itemsInGroup = listaTransacciones.filter(t => t.concepto === categoriaName);
              return (
                <View key={groupIndex}>
                  <View style={styles.categoryPillWrapper}>
                    <View style={styles.categoryPill}>
                      <Text style={styles.categoryPillText}>{categoriaName}</Text>
                    </View>
                  </View>
                  {itemsInGroup.map((item) => renderCard(item))}
                </View>
              );
            })
          ) : (
            listaTransacciones.map((item, index) => renderCard(item, index))
          )}
        </ScrollView>
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.9)', 'white']}
          style={styles.gradientFade}
          pointerEvents="none"
        />
      </View>

      <View style={styles.footerContainer}>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={abrirModalCrear} 
        >
          <Image
            style={styles.plusIcon}
            source={require("../assets/mas.png")}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  // --- Estilos del Modal ---
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalInput: {
    backgroundColor: "#E8F0F5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#7a8a99",
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  modalInputSelector: {
    backgroundColor: "#E8F0F5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#7a8a99",
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  
  // --- Estilos Nuevos para Modal Detalle ---
  detailBox: {
    backgroundColor: "#E8F0F5", // Color gris azulado claro
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333", // Borde oscuro
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    justifyContent: 'center',
  },
  detailText: {
    fontSize: 16,
    color: "#000",
    fontWeight: 'bold', // Para las etiquetas "Monto:", "Categoría:", etc.
  },
  btnRegresar: {
    backgroundColor: "#00dcb4", // Color verde agua similar a la imagen
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 8,
  },

  dropdownList: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    zIndex: 20,
    elevation: 5,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    gap: 15,
  },
  btnCancel: {
    flex: 1,
    backgroundColor: "#FF4D4D",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  btnAction: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  btnModalText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  // --- Header Styles ---
  headerContainer: {
    backgroundColor: "#46607C",
    paddingTop: 60,
    paddingBottom: 20,
    height: 157,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "white",
  },
  backIcon: {
    width: 30,
    height: 30,
    tintColor: "#fff",
    resizeMode: "contain",
  },
  bodyContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 10,
    position: 'relative',
  },
  subHeaderTitle: {
    textAlign: "center",
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
  },

  // --- Tabs ---
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  tabItem: {
    paddingBottom: 5,
    minWidth: 80,
    alignItems: 'center',
  },
  activeTabBorder: {
    borderBottomWidth: 3,
    borderBottomColor: "#46607C",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#000",
    fontWeight: "600",
  },

  // --- ScrollView y Pills de Categoría ---
  scrollView: {
    width: "100%",
  },
  categoryPillWrapper: {
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  categoryPill: {
    backgroundColor: "#46617A",
    paddingVertical: 5,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
  categoryPillText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },

  // --- Card Styles ---
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eaf4f8",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#bdc3c7",
    padding: 10,
    marginBottom: 15,
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  iconContainer: {
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
  },
  montoText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  textRed: {
    color: "#ff3b30",
  },
  textBlack: {
    color: "#333",
  },
  conceptoText: {
    fontSize: 13,
    color: "#333",
    fontWeight: "500",
  },
  fechaDetailText: {
    fontSize: 10,
    color: "#666",
    marginTop: 2,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  btnEditar: {
    backgroundColor: "#ffab00",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  btnEliminar: {
    backgroundColor: "#ff3b30",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  btnTextSmall: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  gradientFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 50,
  },
  footerContainer: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  addButton: {
    width: 60,
    height: 60,
    backgroundColor: "#ABC4D8",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  plusIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
});