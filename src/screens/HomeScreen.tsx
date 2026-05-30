import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootTabScreenProps, Estufa } from '../types';
import { obterEstufas } from '../utils/storage';
import AlertCard from '../components/AlertCard';

export default function HomeScreen({ navigation }: RootTabScreenProps<'Home'>) {
    const [estufas, setEstufas] = useState<Estufa[]>([]);
    const [alertas, setAlertas] = useState<any[]>([]);

    useFocusEffect(
        useCallback(() => {
            carregarDados();
        }, [])
    );

    const carregarDados = async () => {
        const dados = await obterEstufas();
        setEstufas(dados);
        calcularAlertas(dados);
    };

    const calcularAlertas = (dados: Estufa[]) => {
        let novosAlertas: any[] = [];
        dados.forEach((e) => {
            const s = e.dados;
            if (s.temperatura > 34) novosAlertas.push({ type: 'danger', msg: 'Estresse térmico crítico', sub: `Temp ${s.temperatura}°C na ${e.nome}` });
            else if (s.temperatura > 30) novosAlertas.push({ type: 'warn', msg: 'Risco de estresse térmico', sub: `Temp ${s.temperatura}°C na ${e.nome}` });

            if (s.umidade < 20) novosAlertas.push({ type: 'danger', msg: 'Irrigação crítica necessária', sub: `Umidade ${s.umidade}% na ${e.nome}` });
            else if (s.umidade < 35) novosAlertas.push({ type: 'warn', msg: 'Necessário irrigar', sub: `Umidade ${s.umidade}% na ${e.nome}` });

            if (s.agua < 20) novosAlertas.push({ type: 'danger', msg: 'Reservatório crítico', sub: `Nível de água ${s.agua}% na ${e.nome}` });
            else if (s.agua < 40) novosAlertas.push({ type: 'warn', msg: 'Nível de água baixo', sub: `Reservatório ${s.agua}% na ${e.nome}` });
        });
        setAlertas(novosAlertas);
    };

    const qtdAlertaDangerWarn = alertas.filter(a => a.type !== 'ok').length;

    return (
        <View style={styles.container}>
            <View style={styles.topbar}>
                <Text style={styles.topbarLogo}>ASTROFARM</Text>
            </View>
            <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 20 }}>

                <View style={styles.headerBox}>
                    <Text style={styles.badge}>⬡ MISSÃO ATIVA</Text>
                    <Text style={styles.title}>Agricultura{'\n'}para Ambientes Hostis</Text>
                    <Text style={styles.subtitle}>Tecnologia de Marte aplicada à Terra</Text>
                    <Text style={styles.headerIcon}>🌱</Text>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Text style={styles.statVal}>{estufas.length}</Text>
                        <Text style={styles.statLabel}>Estufas</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statVal}>{estufas.length}</Text>
                        <Text style={styles.statLabel}>Cultivos</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Alertas ativos</Text>
                <View style={styles.alertsContainer}>
                    {alertas.length > 0 ? (
                        alertas.slice(0, 3).map((a, i) => <AlertCard key={i} type={a.type} msg={a.msg} sub={a.sub} />)
                    ) : (
                        <AlertCard type="ok" msg="Todos os sistemas normais" sub="Cultivos em condições ideais" />
                    )}
                </View>

                <TouchableOpacity style={styles.ctaBtn} onPress={() => navigation.navigate('Cadastro')}>
                    <Text style={styles.ctaText}>+ Nova Estufa</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1A1A2E' },
    topbar: { backgroundColor: '#16213E', paddingVertical: 12, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#2A4058' },
    topbarLogo: { color: '#E8672A', fontWeight: 'bold', letterSpacing: 1 },
    content: { flex: 1, padding: 16 },
    headerBox: { backgroundColor: '#0F3460', borderRadius: 12, padding: 20, marginBottom: 16, overflow: 'hidden', position: 'relative' },
    badge: { color: '#E8672A', fontSize: 10, letterSpacing: 2, fontWeight: 'bold', marginBottom: 8 },
    title: { fontSize: 22, fontWeight: 'bold', color: '#F1FAEE', marginBottom: 4 },
    subtitle: { color: '#A8DADC', fontSize: 12 },
    headerIcon: { position: 'absolute', right: 20, top: '40%', fontSize: 50, opacity: 0.3 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
    statCard: { backgroundColor: '#1E2D3A', borderWidth: 1, borderColor: '#2A4058', borderRadius: 10, padding: 12, alignItems: 'center', flex: 1, marginHorizontal: 4 },
    statVal: { fontSize: 22, fontWeight: 'bold', color: '#E9C46A' },
    statLabel: { fontSize: 10, color: '#6B8E92', marginTop: 4, textTransform: 'uppercase' },
    sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#6B8E92', textTransform: 'uppercase', marginBottom: 8, marginTop: 10 },
    alertsContainer: { marginBottom: 10 },
    ctaBtn: { backgroundColor: '#C1440E', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
    ctaText: { color: '#FFF', fontWeight: 'bold' }
});