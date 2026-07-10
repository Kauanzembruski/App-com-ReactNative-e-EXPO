// src/components/Botao.js
// Botão padrão do app. A cor é um NOME SEMÂNTICO do tema
// (primaria, sucesso, perigo...), nunca um hexadecimal.

import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTema } from '../ThemeContext';
import { raios, fontes } from '../theme';

export default function Botao({ titulo, onPress, cor = 'primaria', pequeno = false }) {
    const { tema } = useTema();

    return (
        <TouchableOpacity
            style={[
                estilos.base,
                pequeno && estilos.pequeno,
                { backgroundColor: tema.cores[cor] },
            ]}
            onPress={onPress}
        >
            <Text style={[estilos.texto, { color: tema.cores.textoSobreCor }]}>
                {titulo}
            </Text>
        </TouchableOpacity>
    );
}

const estilos = StyleSheet.create({
    base: {
        borderRadius: raios.botao, paddingVertical: 10, paddingHorizontal: 16,
        alignItems: 'center', justifyContent: 'center',
    },
    pequeno: { paddingVertical: 6, paddingHorizontal: 10 },
    texto: { fontWeight: 'bold', fontSize: fontes.corpo },
});