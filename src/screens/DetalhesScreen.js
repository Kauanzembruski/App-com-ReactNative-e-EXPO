import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { IMAGE_BASE } from '../services/tmdb';
import { useTema } from '../ThemeContext';
import { espacos, fontes } from '../theme';

export default function DetalhesScreen({ route }) {
    const { filme } = route.params; // dados passados pela navegação
    const { tema } = useTema();
    const estilos = criarEstilos(tema);

    return (
        <ScrollView style={estilos.container}>
            {filme.poster_path && (
                <Image
                    source={{ uri: IMAGE_BASE + filme.poster_path }}
                    style={estilos.poster}
                />
            )}
            <Text style={estilos.titulo}>{filme.title}</Text>
            <Text style={estilos.detalhe}>
                Lançamento: {filme.release_date || '—'} · Nota TMDB:{' '}
                {filme.vote_average ? filme.vote_average.toFixed(1) : '—'}/10
            </Text>
            <Text style={estilos.sinopse}>
                {filme.overview || 'Sem sinopse disponível.'}
            </Text>
        </ScrollView>
    );
}

const criarEstilos = (tema) => StyleSheet.create({
    container: { flex: 1, backgroundColor: tema.cores.fundo, padding: espacos.medio },
    poster: { width: 160, height: 240, borderRadius: 8, alignSelf: 'center', marginBottom: espacos.medio },
    titulo: { fontSize: fontes.titulo, fontWeight: 'bold', color: tema.cores.textoPrincipal },
    detalhe: { color: tema.cores.textoSecundario, marginVertical: espacos.pequeno },
    sinopse: { fontSize: fontes.corpo, color: tema.cores.textoPrincipal, lineHeight: 22 },
});