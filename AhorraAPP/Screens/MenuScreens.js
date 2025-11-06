import { Text, StyleSheet, View, Button, TouchableOpacity, SafeAreaView} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import AutenticacionUsuario from './Autenticacion';
import GestionDeTransacciones from './GestionTransacciones';
import GraficasdeDatos from './Graficas';
import Presupuestos from './PresupuestosMensuales';


export default function Menu() {
    const[screen, SetScreen] = useState('menu');

    switch (screen) {
        case 'Autenticacion':
            return <AutenticacionUsuario/>
        case 'gestion':
            return <GestionDeTransacciones/>
        case 'graficas':
            return <GraficasdeDatos/>
        case 'presupuesto':
            return <Presupuestos/>
        case 'menu':
        default:
            return (
              <SafeAreaView style={styles.container}> 
                    
                    <Text style={styles.title}>AhorraApp</Text>
                     <Text style={styles.subtitle}> El control en la palma de tu mano</Text>
                     <View style={styles.menuContainer}>
                      <TouchableOpacity
                       style={styles.boton}
                       onPress={()=> SetScreen('gestion')}>
                        <FontAwesome name="exchange" size={24} color="#fff" style={styles.icono}/>
                        <Text style={styles.textoBoton}> Gestión de Transacciones  </Text>
                       </TouchableOpacity>

                      <TouchableOpacity
                       style={styles.boton}
                       onPress={()=> SetScreen('graficas')}>
                        <FontAwesome name="pie-chart" size={24} color="#fff" style={styles.icono}/>
                        <Text style={styles.textoBoton}> Gráficas </Text>
                       </TouchableOpacity>

                        <TouchableOpacity
                       style={styles.boton}
                       onPress={()=> SetScreen('presupuesto')}>
                        <FontAwesome name="calendar" size={24} color="#fff" style={styles.icono}/>
                        <Text style={styles.textoBoton}> Presupuestos mensuales </Text>
                       </TouchableOpacity>
                     
                     </View>
               
               </SafeAreaView>  
            );
    }
}

const styles = StyleSheet.create({


container:{
flex:1,
backgroundColor:'#f4f7fa',
alignItems:'center',
justifyContent:'flex-start',
paddingTop:70,


},

title:{

    fontSize:34,
    fontWeight:'bold',
    color:'#1a237e',
    marginBottom:5,


},

subtitle:{
    fontSize:16,
    color:'#546e7a',
    marginBottom:40,


},

menuContainer:{
width:'85%',
alignItems:'center',
gap:20,

},

boton:{
 flexDirection:'row',
 alignItems:'center',
 backgroundColor:'#1e88e5',
 width:'100%',
 paddingVertical:14,
 borderRadius: 12,
 shadowColor:'#000',
 shadowOffset:{width:0,height:3},
 shadowOpacity:0.15,
 shadowRadius:5,
 elevation:5,

},

icono:{
    marginLeft:20,
    marginRight:15,
},

textoBoton:{

color:'#fff',
fontSize:18,
fontWeight:'600',

},





})