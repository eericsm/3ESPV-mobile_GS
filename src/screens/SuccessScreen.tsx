import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RootStackScreenProps } from '../types';

export default function SuccessScreen({ route, navigation }: RootStackScreenProps<'Success'>) {
    const { id, nome } = route.params;

    return (
        <View style={styles.container}>
            <View style={styles.successIcon}>
                <Text style={styles.iconText}>✅</Text>
            </View>
            <Text style={styles.title}>Estufa cadastrada!</Text>
            <Text style={styles.subtitle}>
                A estufa "{nome}" foi registrada com sucesso no sistema AstroFarm. O monitoramento iniciará em breve.
            </Text>

            <View style={styles.codeBox}>
                <Text style={styles.codeText}>ID: {id}</Text>
            </View>

            <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => navigation.navigate('HomeTabs')}
            >
                <Text style={styles.primaryBtnText}>Ir ao Início</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1A1A2E',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    successIcon: {
        width: 80,
        height: 80,
        backgroundColor: 'rgba(82,183,136,0.15)',
        borderColor: '#52B788',
        borderWidth: 2,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    iconText: {
        fontSize: 40,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#F1FAEE',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#A8DADC',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 28,
    },
    codeBox: {
        backgroundColor: '#1E2D3A',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginBottom: 28,
    },
    codeText: {
        color: '#E8672A',
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    primaryBtn: {
        backgroundColor: '#2D6A4F',
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
    },
    primaryBtnText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    }
});
