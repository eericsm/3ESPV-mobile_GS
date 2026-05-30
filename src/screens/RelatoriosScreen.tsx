import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { RootTabScreenProps } from '../types';

export default function RelatoriosScreen({ navigation }: RootTabScreenProps<'Relatorios'>) {
    const [tab, setTab] = useState<'semana' | 'mes' | 'total'>('semana');

    const data = {
        semana: { labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'], temps: [28, 33, 35, 31, 27, 30, 29], umids: [55, 30, 22, 40, 60, 48, 52] },
        mes: { labels: ['S1', 'S2', 'S3', 'S4'], temps: [30, 34, 28, 32], umids: [45, 25, 60, 40] },
        total: { labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'], temps: [31, 29, 33, 35, 30], umids: [50, 55, 35, 28, 45] }
    };

    const d = data[tab];
    const avgTemp = Math.round(d.temps.reduce((a, b) => a + b, 0) / d.temps.length);
    const avgUmid = Math.round(d.umids.reduce((a, b) => a + b, 0) / d.umids.length);

    const getWidth = (val: number, max: number): any => {
        return `${Math.round((val / max) * 100)}%`;
    };

    return (
        <View style={styles.container}>
            <View style={styles.topbar}>
                <Text style={styles.topbarTitle}>Relatórios</Text>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 20 }}>

                <View style={styles.tabRow}>
                    <TouchableOpacity style={[styles.tabBtn, tab === 'semana' && styles.tabActive]} onPress={() => setTab('semana')}>
                        <Text style={[styles.tabText, tab === 'semana' && styles.tabTextActive]}>Esta semana</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.tabBtn, tab === 'mes' && styles.tabActive]} onPress={() => setTab('mes')}>
                        <Text style={[styles.tabText, tab === 'mes' && styles.tabTextActive]}>Este mês</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.tabBtn, tab === 'total' && styles.tabActive]} onPress={() => setTab('total')}>
                        <Text style={[styles.tabText, tab === 'total' && styles.tabTextActive]}>Total</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>Temperatura média</Text>
                <View style={styles.chartBox}>
                    {d.labels.map((l, i) => (
                        <View key={`temp-${i}`} style={styles.chartRow}>
                            <Text style={styles.chartLabel}>{l}</Text>
                            <View style={styles.chartBarBg}>
                                <View style={[styles.chartBarFill, { width: getWidth(d.temps[i], 50), backgroundColor: d.temps[i] > 30 ? '#E8672A' : '#52B788' }]} />
                            </View>
                            <Text style={styles.chartVal}>{d.temps[i]}°</Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Umidade média</Text>
                <View style={styles.chartBox}>
                    {d.labels.map((l, i) => (
                        <View key={`umid-${i}`} style={styles.chartRow}>
                            <Text style={styles.chartLabel}>{l}</Text>
                            <View style={styles.chartBarBg}>
                                <View style={[styles.chartBarFill, { width: getWidth(d.umids[i], 100), backgroundColor: d.umids[i] < 35 ? '#F4A261' : '#52B788' }]} />
                            </View>
                            <Text style={styles.chartVal}>{d.umids[i]}%</Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Resumo geral</Text>
                <View style={styles.chartBox}>
                    <View style={styles.metricRow}>
                        <Text style={styles.metricName}>Temperatura média</Text>
                        <Text style={[styles.metricVal, { color: avgTemp > 30 ? '#F4A261' : '#52B788' }]}>{avgTemp}°C</Text>
                    </View>
                    <View style={styles.metricRow}>
                        <Text style={styles.metricName}>Umidade média</Text>
                        <Text style={[styles.metricVal, { color: avgUmid < 35 ? '#F4A261' : '#52B788' }]}>{avgUmid}%</Text>
                    </View>
                    <View style={styles.metricRow}>
                        <Text style={styles.metricName}>Taxa de saúde</Text>
                        <Text style={[styles.metricVal, { color: '#52B788' }]}>85%</Text>
                    </View>
                    <View style={[styles.metricRow, { borderBottomWidth: 0 }]}>
                        <Text style={styles.metricName}>Registros analisados</Text>
                        <Text style={styles.metricVal}>48</Text>
                    </View>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1A1A2E' },
    topbar: { backgroundColor: '#16213E', paddingVertical: 15, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#2A4058' },
    topbarTitle: { color: '#F1FAEE', fontWeight: 'bold', fontSize: 16 },
    content: { flex: 1, padding: 16 },
    sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#6B8E92', textTransform: 'uppercase', marginBottom: 12 },

    tabRow: { flexDirection: 'row', gap: 6, marginBottom: 20 },
    tabBtn: { flex: 1, backgroundColor: '#1E2D3A', borderWidth: 1, borderColor: '#2A4058', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
    tabActive: { backgroundColor: '#2D6A4F', borderColor: '#2D6A4F' },
    tabText: { color: '#6B8E92', fontSize: 12, fontWeight: 'bold' },
    tabTextActive: { color: '#FFF' },

    chartBox: { backgroundColor: '#1E2D3A', borderWidth: 1, borderColor: '#2A4058', borderRadius: 12, padding: 16, marginBottom: 20 },
    chartRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
    chartLabel: { color: '#A8DADC', fontSize: 12, width: 35 },
    chartBarBg: { flex: 1, height: 10, backgroundColor: '#0F3460', borderRadius: 5, overflow: 'hidden' },
    chartBarFill: { height: '100%', borderRadius: 5 },
    chartVal: { color: '#A8DADC', fontSize: 12, width: 35, textAlign: 'right', fontWeight: 'bold' },

    metricRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#2A4058' },
    metricName: { color: '#F1FAEE', fontSize: 13 },
    metricVal: { color: '#A8DADC', fontSize: 14, fontWeight: 'bold' }
});