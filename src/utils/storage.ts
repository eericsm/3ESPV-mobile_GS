import AsyncStorage from '@react-native-async-storage/async-storage';
import { Estufa } from '../types';

const STORAGE_KEY = '@astrofarm_estufas';

export const salvarEstufaNoStorage = async (novaEstufa: Estufa): Promise<void> => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        const estufas: Estufa[] = jsonValue != null ? JSON.parse(jsonValue) : [];
        estufas.push(novaEstufa);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(estufas));
    } catch (e) {
        console.error('Erro ao salvar estufa:', e);
        throw e;
    }
};

export const obterEstufas = async (): Promise<Estufa[]> => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error('Erro ao obter estufas:', e);
        return [];
    }
};

export const obterEstufaPorId = async (id: string): Promise<Estufa | undefined> => {
    try {
        const estufas = await obterEstufas();
        return estufas.find(e => e.id === id);
    } catch (e) {
        console.error('Erro ao obter estufa por ID:', e);
        return undefined;
    }
};

export const removerEstufa = async (id: string): Promise<void> => {
    try {
        const estufas = await obterEstufas();
        const filtradas = estufas.filter(e => e.id !== id);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtradas));
    } catch (e) {
        console.error('Erro ao remover estufa:', e);
        throw e;
    }
};

export const atualizarEstufa = async (estufaAtualizada: Estufa): Promise<void> => {
    try {
        const estufas = await obterEstufas();
        const index = estufas.findIndex(e => e.id === estufaAtualizada.id);
        if (index !== -1) {
            estufas[index] = estufaAtualizada;
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(estufas));
        }
    } catch (e) {
        console.error('Erro ao atualizar estufa:', e);
        throw e;
    }
};

// Utilizado para limpar dados para testes
export const limparEstufas = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (e) {
        console.error('Erro ao limpar estufas', e);
    }
}
