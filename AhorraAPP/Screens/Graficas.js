import { Text, StyleSheet, View, TouchableOpacity, SafeAreaView, Image } from 'react-native'
import { FontAwesome } from '@expo/vector-icons';

export default function Graficas() {
  return (
    <SafeAreaView style={styles.container}>

     
   <View style={styles.row}>
        <TouchableOpacity>
          <FontAwesome name="arrow-left" size={30} color="rgba(27, 60, 177, 1)" />
        </TouchableOpacity>

        <Text style={styles.encabezado}>Gráficas</Text>

        <TouchableOpacity>
          <FontAwesome name="question-circle" size={30} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.linea} />

      <Text style={styles.texto}>Hola, usuario...</Text>

   
      <View style={styles.row1}>
        <View style={styles.imagenPastel}>
          <Image
            source={require('../assets/pastel.png')}
            style={styles.pastel}
            resizeMode="contain"
          />
        </View>

       <View style={styles.categorias}>
          <View style={styles.itemCategoria}>
            <View style={[styles.colorBox, { backgroundColor: '#71e3ebff' }]} />
            <Text style={styles.nombreCategoria}>Compras</Text>
          </View>

          <View style={styles.itemCategoria}>
            <View style={[styles.colorBox, { backgroundColor: '#4698c1ff' }]} />
            <Text style={styles.nombreCategoria}>Comida</Text>
          </View>
          
          <View style={styles.itemCategoria}>
            <View style={[styles.colorBox, { backgroundColor: 'rgba(73, 116, 185, 0.98)' }]} />
            <Text style={styles.nombreCategoria}>Servicios</Text>
          </View>

          <View style={styles.itemCategoria}>
            <View style={[styles.colorBox, { backgroundColor: '#255490ff' }]} />
            <Text style={styles.nombreCategoria}>Entretenimiento</Text>
          </View>

          <View style={styles.itemCategoria}>
            <View style={[styles.colorBox, { backgroundColor: '#3a4a81ff' }]} />
            <Text style={styles.nombreCategoria}>Otros</Text>
          </View>

        </View>
      </View>

   
      <View style={styles.row2}>
        <View style={styles.imagenBarras}>
          <Image
            source={require('../assets/barras.png')}
            style={styles.barras}
            resizeMode="contain"
          />
         
          <TouchableOpacity style={styles.botonMes}>
            <Text style={styles.textoBoton}>Mes</Text>
          </TouchableOpacity>
        </View>
      </View>

 
      <View style={styles.listaInfo}>
        <View style={styles.itemColor}>
          <View style={[styles.colorBox, { backgroundColor: '#495cb1ff' }]} />
          <Text style={styles.nombreColor}>Gastos</Text>
          <Text style={styles.puntos}>...</Text>
        </View>

        <View style={styles.itemColor}>
          <View style={[styles.colorBox, { backgroundColor: '#cfccc9ff' }]} />
          <Text style={styles.nombreColor}>Ahorros</Text>
          <Text style={styles.puntos}>...</Text>
        </View>

        <View style={styles.itemColor}>
          <View style={[styles.colorBox, { backgroundColor: '#ffffff' }]} />
          <Text style={styles.nombreColor}>Balance</Text>
          <Text style={styles.puntos}>...</Text>
        </View>
      </View>

      <View style={styles.linea} />

      <Text style={styles.textoFinal}>
        Tus ingresos superan tus gastos en $300 este mes, ¡Sigue así!
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 10,
  },

  row: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    position: 'relative',
    marginTop: 15,
  },

  encabezado: {
    fontSize: 30,
    color: '#151313ff',
    fontWeight: 'bold',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    marginTop: 8,
  },

  linea: {
    height: 2,
    backgroundColor: '#393737ff',
    marginVertical: 20,
    width: '100%',
    alignSelf: 'center',
  },

  texto: {
    color: 'gray',
    fontSize: 20,
    marginTop: 10,
    marginLeft: 25,
  },

  row1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  imagenPastel: {
    alignItems: 'center',
    justifyContent: 'center',
    flex:1,
    marginLeft:50,
  },

  pastel: {
    width: 200,
    height: 200,
  },

  categorias: {
    marginLeft: 40,
    justifyContent: 'center',
      marginLeft: 40,
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

  row2: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  imagenBarras: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
      marginLeft: -150,
  },

  barras: {
    width: 200,
    height: 200,
  },

  botonMes: {
    position: 'absolute',
    top: 5,
    right: -55,
    backgroundColor: '#a3abb3ff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
  },

  textoBoton: {
    color: '#eef3f1ff',
    fontSize: 14,
    fontWeight: '600',
  },

  listaInfo: {
    marginTop: 25,
    marginLeft: 25,
    width: '85%',
  },

  itemColor: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 6,
    paddingLeft: 25,
    paddingRight: 15,
  },

  nombreColor: {
    flex: 1,
    fontSize: 16,
    color: '#171616ff',
    fontWeight: 'bold',
    marginLeft: 8,
  },

  puntos: {
    color: '#171616ff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
    letterSpacing: 2,
  },

  textoFinal: {
    color: 'gray',
    fontSize: 18,
    marginTop: 10,
    marginBottom: 20,
    marginLeft: 25,
    width: '90%',
  },
});
