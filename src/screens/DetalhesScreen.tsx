import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import { RootStackScreenProps, Estufa } from '../types';
import { obterEstufaPorId, removerEstufa, atualizarEstufa } from '../utils/storage';
import { Ionicons } from '@expo/vector-icons';
import AlertCard from '../components/AlertCard';

const getStatus = (s: any) => {
    if (s.temperatura > 34 || s.agua < 20 || s.umidade < 20) return 'critico';
    if (s.temperatura > 30 || s.umidade < 35 || s.agua < 40) return 'atencao';
    return 'saudavel';
};

const getStatusLabel = (st: string) => {
    return { critico: 'Crítico', atencao: 'Atenção', saudavel: 'Saudável' }[st];
};

export default function DetalhesScreen({ route, navigation }: RootStackScreenProps<'Detalhes'>) {
    const { estufaId } = route.params;
    const [estufa, setEstufa] = useState<Estufa | null>(null);

    useEffect(() => {
        carregar();
    }, [estufaId]);

    const carregar = async () => {
        const e = await obterEstufaPorId(estufaId);
        if (e) setEstufa(e);
    };

    const refreshSensors = async () => {
        if (!estufa) return;
        const estufaAtualizada = {
            ...estufa,
            dados: {
                temperatura: Math.floor(20 + Math.random() * 22),
                umidade: Math.floor(15 + Math.random() * 65),
                agua: Math.floor(10 + Math.random() * 80),
                luz: Math.floor(40 + Math.random() * 55)
            }
        };
        setEstufa(estufaAtualizada);
        await atualizarEstufa(estufaAtualizada);
    };

    const confirmarDelecao = () => {
        if (Platform.OS === 'web') {
            if (window.confirm(`Tem certeza que deseja excluir a estufa ${estufa?.nome}?`)) {
                deletar();
            }
        } else {
            Alert.alert(
                "Excluir Estufa",
                `Tem certeza que deseja excluir a estufa ${estufa?.nome}?`,
                [
                    { text: "Cancelar", style: "cancel" },
                    { text: "Excluir", style: "destructive", onPress: deletar }
                ]
            );
        }
    };

    const deletar = async () => {
        if (!estufa) return;
        await removerEstufa(estufa.id);
        navigation.goBack();
    };

    if (!estufa) return <View style={styles.container}><Text style={{ color: '#FFF', margin: 20 }}>Carregando...</Text></View>;

    const s = estufa.dados;
    const st = getStatus(s);

    let alertas: any[] = [];
    if (s.temperatura > 34) alertas.push({ type: 'danger', msg: 'Estresse térmico crítico', sub: `Temperatura ${s.temperatura}°C — resfriamento urgente` });
    else if (s.temperatura > 30) alertas.push({ type: 'warn', msg: 'Risco de estresse térmico', sub: `Temperatura ${s.temperatura}°C — monitore de perto` });

    if (s.umidade < 20) alertas.push({ type: 'danger', msg: 'Irrigação crítica', sub: `Umidade ${s.umidade}% — plantas em risco` });
    else if (s.umidade < 35) alertas.push({ type: 'warn', msg: 'Necessário irrigar', sub: `Umidade ${s.umidade}% abaixo do ideal` });

    if (s.agua < 20) alertas.push({ type: 'danger', msg: 'Reservatório crítico', sub: `Nível ${s.agua}% — reabastecer agora` });
    else if (s.agua < 40) alertas.push({ type: 'warn', msg: 'Nível de água baixo', sub: `Reservatório ${s.agua}%` });

    let recos = [];
    if (s.temperatura > 30) recos.push({ title: '⚠ Controle térmico', text: 'Ative o sistema de ventilação e resfriamento. Temperatura ideal: 20-28°C.' });
    if (s.umidade < 35) recos.push({ title: '💧 Irrigação recomendada', text: 'Inicie irrigação gotejamento. Meta: umidade entre 50-70%.' });
    if (s.agua < 40) recos.push({ title: '🪣 Nível de água', text: 'Verifique e reabasteça o reservatório. Nível mínimo: 30%.' });
    if (recos.length === 0) recos.push({ title: '✅ Sistema em equilíbrio', text: 'Condições ideais para crescimento. Mantenha o monitoramento regular.' });

    return (
        <View style={styles.container}>
            <View style={styles.topbar}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 5 }}>
                    <Ionicons name="chevron-back" size={24} color="#A8DADC" />
                </TouchableOpacity>
                <Text style={styles.topbarTitle}>{estufa.nome}</Text>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={refreshSensors} style={{ padding: 5 }}>
                        <Ionicons name="refresh" size={20} color="#A8DADC" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={confirmarDelecao} style={{ padding: 5, marginLeft: 5 }}>
                        <Ionicons name="trash" size={20} color="#E63946" />
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 20 }}>

                <View style={styles.heroBox}>
                    <View style={styles.heroPhoto}>
                        {estufa.foto ? <Image source={{ uri: estufa.foto }} style={{ width: '100%', height: '100%', borderRadius: 10 }} /> : <Text style={{ fontSize: 36 }}>🌱</Text>}
                    </View>
                    <View style={styles.heroTexts}>
                        <Text style={styles.heroName}>{estufa.nome}</Text>
                        <Text style={styles.heroMeta}>{estufa.tipo} • {estufa.area}m²</Text>
                        <View style={[styles.statusPill, styles[`${st}Pill`]]}>
                            <Text style={[styles.statusText, styles[`${st}Text`]]}>{getStatusLabel(st)}</Text>
                        </View>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Sensores em tempo real</Text>
                <View style={styles.sensorsGrid}>
                    <View style={styles.bigSensor}>
                        <Text style={[styles.sensorVal, { color: s.temperatura > 34 ? '#E63946' : s.temperatura > 30 ? '#F4A261' : '#52B788' }]}>{s.temperatura}°C</Text>
                        <Text style={styles.sensorLab}>Temperatura</Text>
                    </View>
                    <View style={styles.bigSensor}>
                        <Text style={[styles.sensorVal, { color: s.umidade < 20 ? '#E63946' : s.umidade < 35 ? '#F4A261' : '#52B788' }]}>{s.umidade}%</Text>
                        <Text style={styles.sensorLab}>Umidade</Text>
                    </View>
                    <View style={styles.bigSensor}>
                        <Text style={[styles.sensorVal, { color: s.agua < 20 ? '#E63946' : s.agua < 40 ? '#F4A261' : '#52B788' }]}>{s.agua}%</Text>
                        <Text style={styles.sensorLab}>Reserv. Água</Text>
                    </View>
                    <View style={styles.bigSensor}>
                        <Text style={[styles.sensorVal, { color: '#E9C46A' }]}>{s.luz || 50}%</Text>
                        <Text style={styles.sensorLab}>Luminosidade</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Alertas</Text>
                {alertas.length > 0 ? (
                    alertas.map((a, i) => <AlertCard key={i} type={a.type} msg={a.msg} sub={a.sub} />)
                ) : (
                    <AlertCard type="ok" msg="Sem alertas críticos" sub="Tudo ok!" />
                )}

                <Text style={styles.sectionTitle}>Recomendações da IA</Text>
                {recos.map((r, i) => (
                    <View key={i} style={styles.recoCard}>
                        <Text style={styles.recoTitle}>{r.title}</Text>
                        <Text style={styles.recoText}>{r.text}</Text>
                    </View>
                ))}

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1A1A2E' },
    topbar: { backgroundColor: '#16213E', paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#2A4058', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    topbarTitle: { color: '#F1FAEE', fontWeight: 'bold', fontSize: 16 },
    content: { flex: 1, padding: 16 },
    sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#6B8E92', textTransform: 'uppercase', marginBottom: 12, marginTop: 15 },

    heroBox: { backgroundColor: '#16213E', borderWidth: 1, borderColor: '#2A4058', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 15 },
    heroPhoto: { width: 70, height: 70, borderRadius: 10, backgroundColor: '#0F3460', justifyContent: 'center', alignItems: 'center' },
    heroTexts: { flex: 1, alignItems: 'flex-start' },
    heroName: { fontSize: 18, fontWeight: 'bold', color: '#F1FAEE', marginBottom: 4 },
    heroMeta: { color: '#A8DADC', fontSize: 12, marginBottom: 8 },

    statusPill: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 20 },
    statusText: { fontSize: 10, fontWeight: 'bold' },
    saudavelPill: { backgroundColor: 'rgba(82,183,136,0.15)' },
    saudavelText: { color: '#52B788' },
    atencaoPill: { backgroundColor: 'rgba(244,162,97,0.15)' },
    atencaoText: { color: '#F4A261' },
    criticoPill: { backgroundColor: 'rgba(230,57,70,0.15)' },
    criticoText: { color: '#E63946' },

    sensorsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    bigSensor: { backgroundColor: '#1E2D3A', borderWidth: 1, borderColor: '#2A4058', borderRadius: 10, padding: 14, width: '48%' },
    sensorVal: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
    sensorLab: { fontSize: 11, color: '#6B8E92' },

    recoCard: { backgroundColor: 'rgba(233,196,106,0.06)', borderWidth: 1, borderColor: 'rgba(233,196,106,0.2)', borderRadius: 10, padding: 14, marginBottom: 10 },
    recoTitle: { color: '#E9C46A', fontWeight: 'bold', fontSize: 12, marginBottom: 6 },
    recoText: { color: '#A8DADC', fontSize: 13, lineHeight: 20 },

    historyRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#2A4058' },
    historyDate: { color: '#6B8E92', fontSize: 12, width: 45 },
    historyInfo: { flex: 1 },
    historyCultivo: { color: '#F1FAEE', fontWeight: 'bold', fontSize: 14 },
    historyVals: { color: '#A8DADC', fontSize: 12, marginTop: 2 }
});