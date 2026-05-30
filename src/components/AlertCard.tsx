import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AlertCardProps {
    type: 'danger' | 'warn' | 'ok';
    msg: string;
    sub: string;
}

export default function AlertCard({ type, msg, sub }: AlertCardProps) {
    return (
        <View style={[styles.card, styles[type]]}>
            <View style={[styles.dot, styles[`${type}Dot`]]} />
            <View style={styles.textContainer}>
                <Text style={styles.msg}>{msg}</Text>
                <Text style={styles.sub}>{sub}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 14,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        borderWidth: 1,
    },
    textContainer: {
        flex: 1,
    },
    warn: { backgroundColor: 'rgba(244,162,97,0.08)', borderColor: 'rgba(244,162,97,0.3)' },
    danger: { backgroundColor: 'rgba(230,57,70,0.08)', borderColor: 'rgba(230,57,70,0.3)' },
    ok: { backgroundColor: 'rgba(82,183,136,0.08)', borderColor: 'rgba(82,183,136,0.3)' },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginTop: 4,
    },
    warnDot: { backgroundColor: '#F4A261' },
    dangerDot: { backgroundColor: '#E63946' },
    okDot: { backgroundColor: '#52B788' },
    msg: { color: '#F1FAEE', fontSize: 13, fontWeight: 'bold' },
    sub: { color: '#A8DADC', fontSize: 11, marginTop: 2 },
});
