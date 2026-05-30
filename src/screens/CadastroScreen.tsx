import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { RootTabScreenProps, Estufa } from '../types';
import { salvarEstufaNoStorage } from '../utils/storage';

export default function CadastroScreen({ navigation }: RootTabScreenProps<'Cadastro'>) {
    const [nome, setNome] = useState<string>('');
    const [tipo, setTipo] = useState<string>('');
    const [area, setArea] = useState<string>('');
    const [foto, setFoto] = useState<string | null>(null);

    const tirarFoto = async (): Promise<void> => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert("Permissão necessária", "Você precisa permitir o acesso à câmera.");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });

        if (!result.canceled) {
            setFoto(result.assets[0].uri);
        }
    };

    const salvarEstufa = async (): Promise<void> => {
        if (!nome || !tipo || !area) {
            Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        // A variável obedece estritamente a interface `Estufa` criada
        const novaEstufa: Estufa = {
            id: Math.random().toString(36).substring(2, 9),
            nome,
            tipo,
            area: parseFloat(area),
            foto,
            dados: {
                temperatura: Math.floor(Math.random() * 30 + 15),
                umidade: Math.floor(Math.random() * 70 + 10),
                agua: Math.floor(Math.random() * 100),
                luz: Math.floor(Math.random() * 100),
            }
        };

        try {
            await salvarEstufaNoStorage(novaEstufa);

            // Navegando para uma tela na ROOT stack partindo num Tab com tipagem
            navigation.navigate('Success', { id: novaEstufa.id, nome: novaEstufa.nome });

            // Limpar os campos para um próximo uso
            setNome(''); setTipo(''); setArea(''); setFoto(null);
        } catch (e) {
            Alert.alert("Erro", "Falha ao salvar a estufa. Tente novamente.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Nome da estufa *</Text>
            <TextInput
                style={styles.input}
                value={nome}
                onChangeText={setNome}
                placeholderTextColor="#6B8E92"
                placeholder="Ex: Estufa Marte-04"
            />

            <Text style={styles.label}>Tipo de cultivo *</Text>
            <TextInput
                style={styles.input}
                value={tipo}
                onChangeText={setTipo}
                placeholderTextColor="#6B8E92"
                placeholder="Ex: Tomate"
            />

            <Text style={styles.label}>Área (m²) *</Text>
            <TextInput
                style={styles.input}
                value={area}
                onChangeText={setArea}
                keyboardType="numeric"
                placeholderTextColor="#6B8E92"
                placeholder="Ex: 25.5"
            />

            <Text style={styles.label}>Foto da Estufa (Opcional)</Text>
            <TouchableOpacity style={styles.photoArea} onPress={tirarFoto}>
                {foto ? (
                    <Image source={{ uri: foto }} style={styles.photoPreview} />
                ) : (
                    <>
                        <Ionicons name="camera" size={40} color="#6B8E92" />
                        <Text style={styles.photoText}>Toque para abrir a câmera</Text>
                    </>
                )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveBtn} onPress={salvarEstufa}>
                <Text style={styles.saveBtnText}>SALVAR ESTUFA</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1A1A2E', padding: 20 },
    label: { color: '#A8DADC', fontWeight: 'bold', marginBottom: 5 },
    input: { backgroundColor: '#1E2D3A', color: '#FFF', padding: 12, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#2A4058' },
    photoArea: { backgroundColor: '#1E2D3A', height: 150, borderRadius: 8, borderWidth: 2, borderColor: '#2A4058', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    photoPreview: { width: '100%', height: '100%', borderRadius: 8 },
    photoText: { color: '#6B8E92', marginTop: 10 },
    saveBtn: { backgroundColor: '#2D6A4F', padding: 15, borderRadius: 8, alignItems: 'center' },
    saveBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});