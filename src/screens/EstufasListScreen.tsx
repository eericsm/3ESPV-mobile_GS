import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { RootTabScreenProps, Estufa } from '../types';
import { obterEstufas } from '../utils/storage';

const getStatus = (s: any) => {
    if (s.temperatura > 34 || s.agua < 20 || s.umidade < 20) return 'critico';
    if (s.temperatura > 30 || s.umidade < 35 || s.agua < 40) return 'atencao';
    return 'saudavel';
};

const getStatusLabel = (st: string) => {
    return { critico: 'Crítico', atencao: 'Atenção', saudavel: 'Saudável' }[st];
};

export default function EstufasListScreen({ navigation }: RootTabScreenProps<'Estufas'>) {
    const [estufas, setEstufas] = useState<Estufa[]>([]);

    useFocusEffect(
        useCallback(() => {
            carregar();
        }, [])
    );

    const carregar = async () => {
        const dados = await obterEstufas();
        setEstufas(dados);
    };

    const renderItem = ({ item }: { item: Estufa }) => {
        const st = getStatus(item.dados);
        return (
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Detalhes', { estufaId: item.id })}>
                <View style={styles.cardHeader}>
                    <View style={styles.iconBox}><Text style={styles.icon}>🌱</Text></View>
                    <View style={styles.infoBox}>
                        <Text style={styles.name}>{item.nome}</Text>
                        <Text style={styles.type}>{item.tipo} • {item.area}m²</Text>
                    </View>
                    <View style={[styles.statusPill, styles[`${st}Pill`]]}>
                        <Text style={[styles.statusText, styles[`${st}Text`]]}>{getStatusLabel(st)}</Text>
                    </View>
                </View>

                <View style={styles.sensorRow}>
                    <View style={styles.sensorChip}>
                        <Text style={[styles.sensorVal, item.dados.temperatura > 30 ? styles.hot : styles.ok]}>{item.dados.temperatura}°C</Text>
                        <Text style={styles.sensorLab}>Temp</Text>
                    </View>
                    <View style={styles.sensorChip}>
                        <Text style={[styles.sensorVal, item.dados.umidade < 35 ? styles.warn : styles.ok]}>{item.dados.umidade}%</Text>
                        <Text style={styles.sensorLab}>Umidade</Text>
                    </View>
                    <View style={styles.sensorChip}>
                        <Text style={[styles.sensorVal, item.dados.agua < 40 ? styles.warn : styles.ok]}>{item.dados.agua}%</Text>
                        <Text style={styles.sensorLab}>Água</Text>
                    </View>
                    <View style={styles.sensorChip}>
                        <Text style={[styles.sensorVal, styles.ok]}>{item.dados.luz}%</Text>
                        <Text style={styles.sensorLab}>Luz</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.topbar}>
                <Text style={styles.topbarTitle}>Minhas Estufas</Text>
            </View>
            <View style={styles.content}>
                <Text style={styles.sectionTitle}>{estufas.length} estufas ativas</Text>
                <FlatList
                    data={estufas}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1A1A2E' },
    topbar: { backgroundColor: '#16213E', paddingVertical: 15, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#2A4058' },
    topbarTitle: { color: '#F1FAEE', fontWeight: 'bold', fontSize: 16 },
    content: { flex: 1, padding: 16 },
    sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#6B8E92', textTransform: 'uppercase', marginBottom: 12 },
    card: { backgroundColor: '#1E2D3A', borderWidth: 1, borderColor: '#2A4058', borderRadius: 12, padding: 14, marginBottom: 12 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    iconBox: { width: 40, height: 40, backgroundColor: '#0F3460', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
    icon: { fontSize: 20 },
    infoBox: { flex: 1 },
    name: { color: '#F1FAEE', fontSize: 15, fontWeight: 'bold' },
    type: { color: '#A8DADC', fontSize: 12, marginTop: 2 },
    statusPill: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 20 },
    statusText: { fontSize: 10, fontWeight: 'bold' },
    saudavelPill: { backgroundColor: 'rgba(82,183,136,0.15)' },
    saudavelText: { color: '#52B788' },
    atencaoPill: { backgroundColor: 'rgba(244,162,97,0.15)' },
    atencaoText: { color: '#F4A261' },
    criticoPill: { backgroundColor: 'rgba(230,57,70,0.15)' },
    criticoText: { color: '#E63946' },
    sensorRow: { flexDirection: 'row', justifyContent: 'space-between' },
    sensorChip: { backgroundColor: '#16213E', borderRadius: 6, paddingVertical: 8, paddingHorizontal: 4, alignItems: 'center', flex: 1, marginHorizontal: 3 },
    sensorVal: { fontWeight: 'bold', fontSize: 14, marginBottom: 2 },
    sensorLab: { color: '#6B8E92', fontSize: 10 },
    hot: { color: '#E8672A' },
    warn: { color: '#F4A261' },
    ok: { color: '#52B788' }
});