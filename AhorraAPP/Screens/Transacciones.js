import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Image, Alert, Platform, StatusBar } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import { Picker } from '@react-native-picker/picker'; 
import { TransaccionController } from "../controllers/TransaccionController";
import { UsuarioController } from "../controllers/UsuarioController";

export default function Transacciones({ onNext, onEdit, navigation }) {
  // --- ESTADOS DE FILTRO ---
  const [filtroFecha, setFiltroFecha] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  
  const [listaTransacciones, setListaTransacciones] = useState([]);

  const transCtrl = new TransaccionController();
  const userCtrl = new UsuarioController();

  const cargarDatos = async () => {
    const user = await userCtrl.getUsuarioActivo();
    if (user) {
      const data = await transCtrl.obtenerTodas(user.id);
      setListaTransacciones(data);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [])
  );

  const handleDelete = (id) => {
    Alert.alert(
      "Eliminar",
      "¿Estás seguro de borrar esta transacción?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Borrar", 
          style: "destructive",
          onPress: async () => {
            await transCtrl.eliminar(id);
            cargarDatos(); 
          }
        }
      ]
    );
  };

  // --- LÓGICA DE FILTRADO Y LIMPIEZA DE DATOS ---
  
  const uniqueCategories = [
    ...new Set(
        listaTransacciones
        .map((item) => item.categoria)
        .filter(c => c !== null && c !== undefined && c !== "") // Filtro anti-null
    )
  ];

  const uniqueFechas = [
    ...new Set(
        listaTransacciones
        .map((item) => item.fecha)
        .filter(f => f !== null && f !== undefined && f !== "") // Filtro anti-null
    )
  ];

  // 2. Función de filtrado real
  const obtenerDatosFiltrados = () => {
    return listaTransacciones.filter(item => {
      const coincideFecha = filtroFecha ? item.fecha === filtroFecha : true;
      const coincideCategoria = filtroCategoria ? item.categoria === filtroCategoria : true;
      return coincideFecha && coincideCategoria;
    });
  };

  const datosVisibles = obtenerDatosFiltrados();

  // 3. Limpiar filtros
  const limpiarFiltros = () => {
    setFiltroFecha("");
    setFiltroCategoria("");
  };

  const renderCard = (item, index) => (
    <View key={item.id || index} style={styles.card}>
      <TouchableOpacity style={styles.iconContainer}>
        <MaterialIcons
          name={item.tipo === "ingreso" ? "attach-money" : "money-off"}
          size={30}
          color={item.tipo === "ingreso" ? "#00dcb4" : "#ff3b30"}
        />
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <Text
          style={[
            styles.montoText,
            item.tipo === "gasto" ? styles.textRed : styles.textBlack
          ]}
        >
          ${typeof item.monto === 'number' ? item.monto.toFixed(2) : item.monto}
        </Text>

        <Text style={styles.conceptoText}>
            {item.categoria ? item.categoria : "Sin categoría"}
        </Text>
        <Text style={styles.fechaDetailText}>
            {item.fecha ? item.fecha : "--/--/--"}
        </Text>

        {item.descripcion ? (
          <Text style={{ fontSize: 10, color: "#888" }}>
            {item.descripcion}
          </Text>
        ) : null}
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.btnEditar}
          onPress={() => onEdit(item)}
        >
          <Text style={styles.btnTextSmall}>Editar</Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={[styles.btnEditar, { backgroundColor: "#ff3b30" }]}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.btnTextSmall}>Borrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#46607C" />
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Image
              style={styles.backIcon}
              source={require("../assets/regresar.png")}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Transacciones</Text>

          <TouchableOpacity onPress={onNext}>
            <Image
              style={styles.plusIconHeader}
              source={require("../assets/mas.png")}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bodyContainer}>
        
        {/* --- SECCIÓN DE FILTROS --- */}
        <View style={styles.filtersWrapper}>
            {/* Cabecera del filtro con botón de limpiar */}
            <View style={styles.filterHeader}>
                <Text style={styles.filterSectionTitle}>Filtrar por:</Text>
                
                {(filtroFecha !== "" || filtroCategoria !== "") && (
                    <TouchableOpacity onPress={limpiarFiltros} style={styles.clearFilterButton}>
                        <Text style={styles.clearFilterText}>Limpiar filtros ✕</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.filtersRow}>
                {/* Filtro Fecha */}
                <View style={styles.smallPickerContainer}>
                    <Picker
                        selectedValue={filtroFecha}
                        onValueChange={(val) => setFiltroFecha(val)}
                        style={styles.pickerStyle}
                        mode="dropdown"
                    >
                        <Picker.Item label="Todas las Fechas" value="" color="#46607C" />
                        {uniqueFechas.map((fecha, i) => (
                             <Picker.Item key={i} label={String(fecha)} value={fecha} />
                        ))}
                    </Picker>
                </View>

                {/* Filtro Categoría */}
                <View style={styles.smallPickerContainer}>
                    <Picker
                        selectedValue={filtroCategoria}
                        onValueChange={(val) => setFiltroCategoria(val)}
                        style={styles.pickerStyle}
                        mode="dropdown"
                    >
                        <Picker.Item label="Todas las Categorías" value="" color="#46607C" />
                        {uniqueCategories.map((cat, i) => (
                             <Picker.Item key={i} label={String(cat)} value={cat} />
                        ))}
                    </Picker>
                </View>
            </View>
            
            <Text style={styles.resultsText}>
                Mostrando {datosVisibles.length} resultado(s)
            </Text>
        </View>
        {/* --------------------------- */}

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 60 }}
        >
          {datosVisibles.length === 0 ? (
             <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No hay transacciones con estos filtros.</Text>
                <TouchableOpacity onPress={limpiarFiltros}>
                    <Text style={styles.emptyLink}>Ver todas</Text>
                </TouchableOpacity>
            </View>
          ) : (
            datosVisibles.map((item, index) => renderCard(item, index))
          )}
        </ScrollView>

        <LinearGradient
          colors={["transparent", "white"]}
          style={styles.gradientFade}
          pointerEvents="none"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white"
  },
  headerContainer: {
    backgroundColor: "#46607C",
    paddingTop: Platform.OS === 'android' ? 50 : 20, 
    paddingBottom: 20,
    height: 120,
    justifyContent: 'center'
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "white"
  },
  backIcon: {
    width: 30,
    height: 30,
    tintColor: "#fff",
    resizeMode: "contain"
  },
  plusIconHeader: {
    width: 30,
    height: 30,
    tintColor: "#fff",
    resizeMode: "contain"
  },
  bodyContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 10
  },
  
  // --- ESTILOS FILTROS ---
  filtersWrapper: {
    width: "100%",
    marginTop: 5,
    marginBottom: 15,
  },
  filterHeader: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 5,
    paddingHorizontal: 2,
  },
  filterSectionTitle: {
    fontSize: 14,
    color: "#46607C",
    fontWeight: 'bold',
  },
  clearFilterButton: {
    paddingVertical: 2,
    paddingHorizontal: 5,
  },
  clearFilterText: {
    fontSize: 12,
    color: "#FF3B30", 
    fontWeight: '600',
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
    justifyContent: 'center',
    overflow: 'hidden',
  },
  pickerStyle: {
    width: '100%',
  },
  resultsText: {
    fontSize: 12,
    color: "#7f8c8d",
    marginTop: 5,
    textAlign: "right",
    marginRight: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  },
  emptyLink: {
    color: '#46607C',
    fontWeight: 'bold',
    marginTop: 5,
  },
  // ----------------------

  scrollView: {
    width: "100%"
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eaf4f8",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#bdc3c7",
    padding: 15,
    marginBottom: 10
  },
  iconContainer: {
    marginRight: 10
  },
  infoContainer: {
    flex: 1
  },
  montoText: {
    fontSize: 18,
    fontWeight: "bold"
  },
  textRed: {
    color: "#ff3b30"
  },
  textBlack: {
    color: "#333"
  },
  conceptoText: {
    fontSize: 13,
    color: "#333",
    fontWeight: "500"
  },
  fechaDetailText: {
    fontSize: 10,
    color: "#666",
    marginTop: 2
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 8
  },
  btnEditar: {
    backgroundColor: "#ffab00",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15
  },
  btnTextSmall: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold"
  },
  gradientFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 50
  }
});