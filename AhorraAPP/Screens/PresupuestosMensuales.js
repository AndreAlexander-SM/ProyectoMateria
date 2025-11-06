import { Text, StyleSheet, View, Button } from 'react-native';
import React, { useState } from 'react';
import CrearApartado from './CApartados';

export default function Apartados() {
    const [screen, setScreen] = useState('apartados');

    switch (screen) {
        case 'crear':
            return <CrearApartado setScreen={setScreen} />;

        case 'apartados':
        default:
            return (
                <View style={styles.container}>
                    <Text style={styles.title}>Apartados</Text>

                    <View style={styles.card}>
                        <Text>Comida - $200.00</Text>
                    </View>
                    <View style={styles.card}>
                        <Text>Gasolina - $200.00</Text>
                    </View>
                    <View style={styles.card}>
                        <Text>Renta - $200.00</Text>
                    </View>
                    <View style={styles.card}>
                        <Text>Vacaciones - $200.00</Text>
                    </View>

                    <Button title="Agregar Apartado +" onPress={() => setScreen('crear')} />
                </View>
            );
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'flex-start', backgroundColor: '#fff', padding: 20 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
    card: {
        width: '100%',
        backgroundColor: '#bcd3e0',
        padding: 15,
        borderRadius: 10,
        marginVertical: 5,
    },
});
