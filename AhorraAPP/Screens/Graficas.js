import { Text,StyleSheet, View, TouchableOpacity, SafeAreaView } from 'react-native'
import { FontAwesome } from '@expo/vector-icons';
import {Image}from 'react-native';


export default function Graficas(){

    return (
    <SafeAreaView style={styles.container}>
      <View style={styles.row} >    

         <TouchableOpacity> 
          <FontAwesome name="arrow-left" size={30} color="rgba(27, 60, 177, 1)" />
         </TouchableOpacity>

        <Text style={styles.encabezado}>  Gráficas </Text>

        <TouchableOpacity>
          <FontAwesome name="question-circle" size={30} color="#333" />
            
        </TouchableOpacity>
 

     </View>

     <View style ={styles.linea}/> 


        <Text style={styles.texto}>  Hola,usuario...  </Text>

     <View style={styles.row1} >    
       <View style={styles.imagenPastel}> 
          <Image source={{uri:'https://matemovil.com/wp-content/uploads/2018/08/gr%C3%A1fico-de-torta-gr%C3%A1fico-circular-pastel.jpg'}} 
           style={styles.pastel}
           resizeMode="contain"
         />

        </View>   

        <View style={styles.categorias}>  
           <View style={styles.itemCategoria}>
             <View style={[styles.colorBox, { backgroundColor: '#63beffff' }]} /> 
            <Text style={styles.nombreCategoria}>Compras</Text>
         </View>

        <View style={styles.itemCategoria}>
             <View style={[styles.colorBox, { backgroundColor: '#36a2eb' }]} /> 
            <Text style={styles.nombreCategoria}>Servicios</Text>
        </View>
         </View>




          </View>

          <View style={styles.row2}>
            <Image 
              source={{uri:'https://help.qlik.com/es-ES/cloud-services/Subsystems/Hub/Content/Resources/Images/ui_gen_BarChart.png'}}
               style={styles.barras}
               resizeMode='contain'
  />
  <TouchableOpacity style={styles.botonMes}>
    <Text style={styles.textoBoton}>Mes</Text>
  </TouchableOpacity>


</View>

         <View style={styles.texto}>
  <View style={styles.itemColor}>
    <View style={[styles.colorBox, { backgroundColor: '#ff6b6b' }]} />
    <Text style={styles.nombreColor}>Gastos</Text>
  </View>

  <View style={styles.itemColor}>
    <View style={[styles.colorBox, { backgroundColor: '#1dd1a1' }]} />
    <Text style={styles.nombreColor}>Ahorros</Text>
  </View>

  <View style={styles.itemColor}>
    <View style={[styles.colorBox, { backgroundColor: '#feca57' }]} />
    <Text style={styles.nombreColor}>Ingresos</Text>
  </View>
</View>
   
    <View style ={styles.linea}/>
     

     <Text style={styles.texto}> 
           Tus ingresos superan tus gastos en $300 este mes, ¡Sigue así!

     </Text>
          
        </SafeAreaView>
          
      
    )




}

const styles = StyleSheet.create({

    container:{
        flex:1,
        justifyContent:'flex-start',
        paddingTop:10, 


    },

 row:{
   flexDirection:'row',
  paddingHorizontal:15,
  alignItems:'center',
  width:'100%',
  justifyContent:'space-between',
  position:'relative',
  marginTop:15,
},


   


encabezado:{

fontSize: 30,
    color: '#151313ff',
    fontWeight: 'bold',
    position:'absolute',
    left:0,
    right:0,
    textAlign:'center',
    marginTop: 8,
   

},

button:{ 
fontSize:20,
fontWeight:'bold',
marginBottom:10,
color:'blue',

},

imagenPastel:{
    marginTop: 40,
    alignSelf:'flex-start',
    
   
    


},

pastel:{
    width: 200,
    height:200,
    
    

},

texto:{
color:'gray',
fontSize:20,
marginTop: 20,


},



 row1:{
   flexDirection:'row',
  paddingHorizontal:15,
  alignItems:'center',
  width:'100%',
  position:'relative',
},

categorias: {
  marginLeft: 50,
  justifyContent: 'center',
},

itemCategoria: {
  flexDirection: 'row',
  alignItems: 'center',
  marginVertical: 5,
},

colorBox: {
  width: 20,
  height: 20,
  borderRadius: 4, 
  marginRight: 10,
},

nombreCategoria: {
  fontSize: 18,
  color: '#d1d2daff',
  fontWeight: '500',
},

linea:{

    height:2,
    backgroundColor:'#393737ff',
    marginVertical:20,
    width:'100%',
    alignSelf:'center',
},

imagenBarras:{

  justifyContent:'center',
  alignItems: 'center',
  
},

barras:{

    width:250,
    height:250,
},


row2:{

  flexDirection:'row',
  marginTop:10,
  alignItems:'flex-start',

},



botonMes: {
  backgroundColor: '#a3abb3ff',
   paddingVertical: 5,
  paddingHorizontal: 10,
  borderRadius: 6,
  marginLeft: 10,
},

textoBoton: {
  color: '#eef3f1ff',
  fontSize: 14,
  fontWeight: '600',
},

itemColor: {
  flexDirection: 'row',
  alignItems: 'center',
  marginRight: 25,  // espacio entre cada item
},

colorBox: {
  width: 20,
  height: 20,
  borderRadius: 4,
},

nombreColor: {
  fontSize: 16,
  color: '#171616ff',
  fontWeight:'bold',
  marginLeft: 8, // espacio entre cuadro y texto
},

text1:{
  fontWeight:'bold',
  fontSize:20,



}

})
 
