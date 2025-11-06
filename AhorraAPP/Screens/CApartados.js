import { Text, StyleSheet, View, Button, Alert, TextInput } from 'react-native';
import React, { useState } from 'react';

export default function CrearApartado({ setScreen }) {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [monto, setMonto] = useState('');

    const handleApartar = () => {
        Alert.alert('Apartado creado', 'El apartado se ha guardado correctamente.', [
            { text: 'Aceptar', onPress: () => setScreen('apartados') },
        ]);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Crea tu apartado</Text>

            <Text style={styles.label}>¿Cuál es el nombre de este apartado?</Text>
            <TextInput
                style={styles.input}
                placeholder="Ingresa un nombre"
                value={nombre}
                onChangeText={setNombre}
            />

            <Text style={styles.label}>Descripción</Text>
            <TextInput
                style={styles.input}
                placeholder="Opcional"
                value={descripcion}
                onChangeText={setDescripcion}
            />

            <Text style={styles.label}>Monto</Text>
            <TextInput
                style={styles.input}
                placeholder="0.00"
                keyboardType="numeric"
                value={monto}
                onChangeText={setMonto}
            />

            <Button title="Apartar" onPress={handleApartar} />
            <Button title="Volver" onPress={() => setScreen('apartados')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'flex-start', backgroundColor: '#fff', padding: 20 },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
    label: { fontSize: 16, alignSelf: 'flex-start', marginTop: 10 },
    input: {
        backgroundColor: '#e0edf2',
        padding: 10,
        borderRadius: 10,
        width: '100%',
        marginVertical: 5,
    },
});
