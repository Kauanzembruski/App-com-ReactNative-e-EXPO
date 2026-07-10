// src/components/BotaoTema.js
// Botão que alterna claro/escuro. Pode ser usado em qualquer tela.

import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTema } from '../ThemeContext';

export default function BotaoTema() {
    const { tema, alternarTema } = useTema();

    return (
        <TouchableOpacity
            style={[estilos.botao, { backgroundColor: tema.cores.card, borderColor: tema.cores.borda }]}
            onPress={alternarTema}
        >
            <Text style={estilos.icone}>
                {tema.nome === 'claro' ? '🌙' : '☀️'}
            </Text>
        </TouchableOpacity>
    );
}

const estilos = StyleSheet.create({
    botao: {
        borderWidth: 1, borderRadius: 20, width: 40, height: 40,
        alignItems: 'center', justifyContent: 'center',
    },
    icone: { fontSize: 18 },
});