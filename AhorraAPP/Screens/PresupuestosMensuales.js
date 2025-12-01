import React, { useState } from "react";
import { Text, StyleSheet, View, TouchableOpacity, Image, ScrollView, Platform, StatusBar, Modal, TextInput, Alert 
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';


export default function PresupuestosMensuales({ navigation }) {
  const [screen, setScreen] = useState("apartados");
  const [tabSeleccionado, setTabSeleccionado] = useState("General");

  // --- DATOS INICIALES ---
  const [listaApartados, setListaApartados] = useState([
    { id: '1', nombre: "Comida", monto: "$200.00", mes: "Noviembre", categoria: "Hogar" },
    { id: '2', nombre: "Gasolina", monto: "$500.00", mes: "Noviembre", categoria: "Personal" },
    { id: '3', nombre: "Renta", monto: "$3000.00", mes: "Diciembre", categoria: "Hogar" },
    { id: '4', nombre: "Internet", monto: "$400.00", mes: "Diciembre", categoria: "Hogar" },
    { id: '5', nombre: "Cena", monto: "$200.00", mes: "Enero", categoria: "Personal" },
  ]);

  // --- ESTADOS MODAL CREAR ---
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoMes, setNuevoMes] = useState("");
  const [nuevoMonto, setNuevoMonto] = useState("");
  const [nuevaCategoria, setNuevaCategoria] = useState(""); 

  // --- ESTADOS MODAL EDITAR ---
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [editId, setEditId] = useState(null); 
  const [editNombre, setEditNombre] = useState("");
  const [editMes, setEditMes] = useState("");
  const [editMonto, setEditMonto] = useState("");
  const [editCategoria, setEditCategoria] = useState("");

  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const categorias = ["Hogar", "Familia", "Despensa", "personal"];

  // --- LÓGICA DE AGRUPACIÓN POR MES ---
  const obtenerDatosAgrupadosPorMes = () => {
    const mesesPresentes = [...new Set(listaApartados.map(item => item.mes))];
    const agrupados = mesesPresentes.map(mes => {
      return {
        titulo: mes,
        items: listaApartados.filter(item => item.mes === mes)
      };
    });
    agrupados.sort((a, b) => meses.indexOf(a.titulo) - meses.indexOf(b.titulo));
    return agrupados;
  };

  // --- LÓGICA DE AGRUPACIÓN POR CATEGORÍA ---
  const obtenerDatosPorCategoria = () => {
    const categoriasPresentes = [...new Set(listaApartados.map(item => item.categoria))];
    const agrupados = categoriasPresentes.map(cat => {
        return {
            titulo: cat,
            items: listaApartados.filter(item => item.categoria === cat)
        };
    });
    return agrupados;
  };

  // --- CREAR (CON VALIDACIÓN) ---
  const handleApartar = () => {
    if(!nuevoNombre.trim() || !nuevoMonto || !nuevoMes || !nuevaCategoria) {
        Alert.alert("Campos incompletos", "Por favor completa todos los campos.");
        return; 
    }

    const presupuestoExcedido = false; 
    if (presupuestoExcedido) {
        Alert.alert("Presupuesto Superado", "El monto supera tu presupuesto disponible.");
        return; 
    }

    const nuevoItem = {
      id: Date.now().toString(), 
      nombre: nuevoNombre,
      monto: nuevoMonto.includes('$') ? nuevoMonto : `$${nuevoMonto}`,
      mes: nuevoMes,
      categoria: nuevaCategoria 
    };

    setListaApartados([...listaApartados, nuevoItem]);
    setModalVisible(false);
    
    setNuevoNombre("");
    setNuevoMonto("");
    setNuevoMes("");
    setNuevaCategoria("");
  };

  // --- PREPARAR EDICIÓN ---
  const abrirModalEditar = (item) => {
    setEditId(item.id); 
    setEditNombre(item.nombre);
    setEditMes(item.mes || ""); 
    setEditMonto(item.monto.replace('$', '')); 
    setEditCategoria(item.categoria || "");
    setModalEditarVisible(true);
  };

  // --- ACTUALIZAR ---
  const handleActualizar = () => {
    const listaActualizada = listaApartados.map(item => {
      if (item.id === editId) {
        return {
          ...item,
          nombre: editNombre,
          mes: editMes, 
          categoria: editCategoria,
          monto: editMonto.includes('$') ? editMonto : `$${editMonto}`
        };
      }
      return item;
    });

    setListaApartados(listaActualizada); 
    setModalEditarVisible(false);
  };

  // --- ELIMINAR (NUEVO) ---
  const confirmarEliminacion = (id) => {
    Alert.alert(
      "Eliminar Apartado",
      "¿Estás seguro de que deseas eliminar este apartado?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: () => {
            const nuevaLista = listaApartados.filter((item) => item.id !== id);
            setListaApartados(nuevaLista);
          }
        }
      ]
    );
  };

  // --- RENDERIZADO DE TARJETA ---
  const renderCard = (item) => (
    <View key={item.id} style={styles.card}>
      <View style={styles.textContainer}>
        <Text style={styles.itemTitle}>{item.nombre}</Text>
        <Text style={styles.itemAmount}>{item.monto}</Text>
        
        {tabSeleccionado !== "General" && (
            <Text style={{ fontSize: 10, color: '#7f8c8d' }}>
                {tabSeleccionado === "Categorias" ? item.categoria : item.mes}
            </Text>
        )}
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
            style={styles.editButton}
            onPress={() => abrirModalEditar(item)}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>

        {/* AQUÍ SE MODIFICÓ EL BOTÓN DE ELIMINAR */}
        <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => confirmarEliminacion(item.id)}
        >
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#46607C" />
      
      {/* Encabezado */}
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation?.navigate("Inicio")}
          >
            <Image
              style={styles.backIcon}
              source={require("../assets/regresar.png")} 
            />
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>Apartados</Text>
            <Text style={styles.headerTitle}>Mensuales</Text>
          </View>
        </View>
      </View>

      {/* Cuerpo */}
      <View style={styles.bodyContainer}>
        
        {/* Tabs */}
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryLabel}>Vistas</Text> 
          <View style={styles.tabsContainer}>
            <TouchableOpacity style={styles.tabItem} onPress={() => setTabSeleccionado("General")}>
              <Text style={tabSeleccionado === "General" ? styles.activeTabText : styles.inactiveTabText}>General</Text>
              {tabSeleccionado === "General" && <View style={styles.underline} />}
            </TouchableOpacity>

             <TouchableOpacity style={styles.tabItem} onPress={() => setTabSeleccionado("Categorias")}>
              <Text style={tabSeleccionado === "Categorias" ? styles.activeTabText : styles.inactiveTabText}>Categorías</Text>
              {tabSeleccionado === "Categorias" && <View style={styles.underline} />}
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.tabItem} onPress={() => setTabSeleccionado("Mes")}>
              <Text style={tabSeleccionado === "Mes" ? styles.activeTabText : styles.inactiveTabText}>Mes</Text>
              {tabSeleccionado === "Mes" && <View style={styles.underline} />}
            </TouchableOpacity>
          </View>
        </View>

        {/* Lista */}
        <View style={styles.listWrapper}>
            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {tabSeleccionado === "General" && (
                 listaApartados.map((item) => renderCard(item))
              )}

              {tabSeleccionado === "Categorias" && (
                 obtenerDatosPorCategoria().map((grupo, groupIndex) => (
                    <View key={groupIndex} style={styles.monthGroupContainer}>
                      <View style={styles.monthLabelContainer}>
                        <Text style={styles.monthLabelText}>{grupo.titulo || "Sin Categoría"}</Text>
                      </View>
                      {grupo.items.map((item) => renderCard(item))}
                    </View>
                 ))
              )}

              {tabSeleccionado === "Mes" && (
                 obtenerDatosAgrupadosPorMes().map((grupo, groupIndex) => (
                    <View key={groupIndex} style={styles.monthGroupContainer}>
                      <View style={styles.monthLabelContainer}>
                        <Text style={styles.monthLabelText}>{grupo.titulo || "Sin Mes"}</Text>
                      </View>
                      {grupo.items.map((item) => renderCard(item))}
                    </View>
                 ))
              )}
            </ScrollView>

            <LinearGradient
                colors={['transparent', '#ffffff']} 
                style={styles.bottomGradient}
                pointerEvents="none"
            />
        </View>

        {/* Footer */}
        <View style={styles.footerContainer}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setModalVisible(true)}
            >
              <Image style={styles.plusIcon} source={require("../assets/mas.png")} />
            </TouchableOpacity>
        </View>

      </View>

      {/* ==================== MODAL CREAR ==================== */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentContainer}>
            <Text style={styles.modalTitle}>Apartados Mensuales</Text>
            
            <Text style={styles.inputLabel}>¿Cual es el nombre de este apartado?</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Ingresa un nombre"
              placeholderTextColor="#A0A0A0"
              value={nuevoNombre}
              onChangeText={setNuevoNombre}
            />

            <Text style={styles.inputLabel}>Selecciona el mes:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={nuevoMes}
                onValueChange={(itemValue) => setNuevoMes(itemValue)}
                style={styles.pickerStyle}
                dropdownIconColor="#A0A0A0"
                mode="dropdown"
              >
                <Picker.Item label="Opciones" value="" color="#A0A0A0" enabled={false}/>
                {meses.map((mes, index) => (
                  <Picker.Item key={index} label={mes} value={mes} color="#000" />
                ))}
              </Picker>
            </View>

            <Text style={styles.inputLabel}>Selecciona la categoria:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={nuevaCategoria}
                onValueChange={(itemValue) => setNuevaCategoria(itemValue)}
                style={styles.pickerStyle}
                dropdownIconColor="#A0A0A0"
                mode="dropdown"
              >
                <Picker.Item label="Categorias" value="" color="#A0A0A0" enabled={false}/>
                {categorias.map((cat, index) => (
                  <Picker.Item key={index} label={cat} value={cat} color="#000" />
                ))}
              </Picker>
            </View>

            <View style={styles.amountContainer}>
              <TextInput 
                  style={styles.bigAmountInput}
                  placeholder="$ 0.00"
                  placeholderTextColor="#000"
                  keyboardType="numeric"
                  value={nuevoMonto}
                  onChangeText={setNuevoMonto}
              />
            </View>

            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalButton, styles.apartarButton]}
                onPress={handleApartar}
              >
                <Text style={styles.modalButtonText}>Apartar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ==================== MODAL EDITAR ==================== */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalEditarVisible}
        onRequestClose={() => setModalEditarVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentContainer}>
            <Text style={styles.modalTitle}>Actualizar apartado</Text>
            
            <Text style={styles.inputLabel}>Nombre</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Ingresa un nombre"
              placeholderTextColor="#A0A0A0"
              value={editNombre}
              onChangeText={setEditNombre}
            />

            <Text style={styles.inputLabel}>Selecciona el mes:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={editMes}
                onValueChange={(itemValue) => setEditMes(itemValue)}
                style={styles.pickerStyle}
                dropdownIconColor="#A0A0A0"
                mode="dropdown"
              >
                <Picker.Item label="Opciones" value="" color="#A0A0A0" enabled={false}/>
                {meses.map((mes, index) => (
                  <Picker.Item key={index} label={mes} value={mes} color="#000" />
                ))}
              </Picker>
            </View>

            <Text style={styles.inputLabel}>Selecciona la categoria:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={editCategoria}
                onValueChange={(itemValue) => setEditCategoria(itemValue)}
                style={styles.pickerStyle}
                dropdownIconColor="#A0A0A0"
                mode="dropdown"
              >
                <Picker.Item label="Categorias" value="" color="#A0A0A0" enabled={false}/>
                {categorias.map((cat, index) => (
                  <Picker.Item key={index} label={cat} value={cat} color="#000" />
                ))}
              </Picker>
            </View>

            <View style={styles.amountContainer}>
              <TextInput 
                  style={styles.bigAmountInput}
                  placeholder="$ 0.00"
                  placeholderTextColor="#000"
                  keyboardType="numeric"
                  value={editMonto}
                  onChangeText={setEditMonto}
              />
            </View>

            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalEditarVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalButton, styles.updateButton]}
                onPress={handleActualizar}
              >
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
    paddingTop: Platform.OS === 'android' ? 20 : 0,
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
    position: 'absolute',
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
  categoryContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 10,
  },
  categoryLabel: {
    fontSize: 16,
    color: "#000",
    marginBottom: 10,
    fontWeight: '400',
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%", 
  },
  tabItem: {
    alignItems: "center",
    paddingBottom: 5,
    width: 100, 
  },
  activeTabText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  inactiveTabText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "400",
  },
  underline: {
    height: 3,
    backgroundColor: "#46617A",
    width: "100%",
    marginTop: 2,
    borderRadius: 2,
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
  bottomGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
    zIndex: 1,
  },
  monthGroupContainer: {
    marginBottom: 10,
  },
  monthLabelContainer: {
    backgroundColor: "#576F89",
    alignSelf: "center",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    marginTop: 5,
  },
  monthLabelText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
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
    justifyContent: 'center',
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
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  addButton: {
    width: 60,
    height: 60,
    backgroundColor: "#ABC4D8",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)"
  },
  plusIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },

  // ==================== ESTILOS DEL MODAL ====================
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContentContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 25,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#31356E', 
    marginBottom: 25,
  },
  inputLabel: {
    alignSelf: 'flex-start',
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
    marginLeft: 5,
  },
  modalInput: {
    width: '100%',
    backgroundColor: '#E8F0F5',
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    marginBottom: 20,
    color: '#000',
  },
  pickerContainer: {
    width: '100%',
    backgroundColor: '#E8F0F5',
    borderRadius: 15,
    marginBottom: 20,
    height: Platform.OS === 'ios' ? 120 : 50, 
    justifyContent: 'center',
    overflow: 'hidden',
  },
  pickerStyle: {
    width: '100%',
  },
  amountContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  bigAmountInput: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    width: '100%',
    padding: 5,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 25,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#FF3B30', 
  },
  apartarButton: {
    backgroundColor: '#FFAB00',
  },
  updateButton: {
    backgroundColor: '#1DCC98', 
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});