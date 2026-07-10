// src/screens/BuscaScreen.js
// Tela de busca de filmes no TMDB — agora consumindo o tema.

import { useState } from 'react';
import {
    View, Text, TextInput, FlatList, Image,
    StyleSheet, ActivityIndicator,
} from 'react-native';
import { buscarFilmes, IMAGE_BASE } from '../services/tmdb';
import { adicionarFavorito, listarFavoritos } from '../services/favoritos';
import { useTema } from '../ThemeContext';
import { espacos, fontes, raios } from '../theme';
import Botao from '../components/Botao';
import BotaoTema from '../components/BotaoTema';

export default function BuscaScreen() {
    const { tema } = useTema();
    const estilos = criarEstilos(tema); // estilos recalculados a cada troca de tema

    const [texto, setTexto] = useState('');
    const [filmes, setFilmes] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState(null);
    const [mensagem, setMensagem] = useState(null);

    async function aoBuscar() {
        if (!texto.trim()) return;
        setCarregando(true);
        setErro(null);
        try {
            const resultados = await buscarFilmes(texto);
            setFilmes(resultados);
        } catch (e) {
            setErro('Não foi possível buscar. Verifique sua conexão.');
        } finally {
            setCarregando(false);
        }
    }

    async function aoFavoritar(filme) {
        try {
            const existentes = await listarFavoritos();
            const jaExiste = existentes.some((f) => Number(f.tmdbId) === filme.id);
            if (jaExiste) {
                setMensagem(`"${filme.title}" já está nos favoritos.`);
                return;
            }

            await adicionarFavorito({
                tmdbId: filme.id,
                titulo: filme.title,
                posterPath: filme.poster_path || '',
                ano: filme.release_date ? filme.release_date.slice(0, 4) : '',
                nota: 0,
                comentario: '',
            });
            setMensagem(`"${filme.title}" adicionado aos favoritos!`);
        } catch (e) {
            console.error(e);
            setMensagem('Não foi possível salvar o favorito.');
        }
    }

    return (
        <View style={estilos.container}>
            <View style={estilos.linhaTitulo}>
                <Text style={estilos.titulo}>Meu Catálogo de Filmes</Text>
                <BotaoTema />
            </View>

            <View style={estilos.linhaBusca}>
                <TextInput
                    style={estilos.campo}
                    placeholder="Digite o nome de um filme..."
                    placeholderTextColor={tema.cores.textoSecundario}
                    value={texto}
                    onChangeText={setTexto}
                    onSubmitEditing={aoBuscar}
                />
                <View style={{ marginLeft: espacos.pequeno }}>
                    <Botao titulo="Buscar" onPress={aoBuscar} />
                </View>
            </View>

            {carregando && <ActivityIndicator size="large" color={tema.cores.primaria} />}
            {erro && <Text style={estilos.erro}>{erro}</Text>}
            {mensagem && <Text style={estilos.mensagem}>{mensagem}</Text>}

            <FlatList
                data={filmes}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <View style={estilos.card}>
                        {item.poster_path ? (
                            <Image
                                source={{ uri: IMAGE_BASE + item.poster_path }}
                                style={estilos.poster}
                            />
                        ) : (
                            <View style={[estilos.poster, estilos.semPoster]}>
                                <Text style={estilos.textoSecundario}>Sem pôster</Text>
                            </View>
                        )}
                        <View style={estilos.info}>
                            <Text style={estilos.tituloFilme}>{item.title}</Text>
                            <Text style={estilos.ano}>
                                {item.release_date ? item.release_date.slice(0, 4) : '—'}
                            </Text>
                            <Text numberOfLines={3} style={estilos.sinopse}>
                                {item.overview || 'Sem sinopse disponível.'}
                            </Text>
                            <View style={estilos.linhaBotoes}>
                                <Botao
                                    titulo="⭐ Favoritar"
                                    cor="sucesso"
                                    pequeno
                                    onPress={() => aoFavoritar(item)}
                                />
                            </View>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}

// Estilos como FUNÇÃO do tema: só hexadecimais daqui pra fora — nunca aqui dentro.
const criarEstilos = (tema) => StyleSheet.create({
    container: {
        flex: 1, padding: espacos.medio, paddingTop: 48,
        backgroundColor: tema.cores.fundo,
    },
    linhaTitulo: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: espacos.medio,
    },
    titulo: {
        fontSize: fontes.titulo, fontWeight: 'bold',
        color: tema.cores.textoPrincipal,
    },
    linhaBusca: { flexDirection: 'row', marginBottom: espacos.medio },
    campo: {
        flex: 1, borderWidth: 1, borderColor: tema.cores.borda,
        borderRadius: raios.campo, paddingHorizontal: espacos.medio, height: 44,
        color: tema.cores.textoPrincipal, backgroundColor: tema.cores.card,
    },
    erro: { color: tema.cores.perigo, marginBottom: espacos.pequeno },
    mensagem: {
        color: tema.cores.sucesso, marginBottom: espacos.pequeno,
        fontWeight: 'bold',
    },
    card: {
        flexDirection: 'row', marginBottom: espacos.medio,
        borderWidth: 1, borderColor: tema.cores.borda,
        borderRadius: raios.card, overflow: 'hidden',
        backgroundColor: tema.cores.card,
        // Sombra sutil (elevation = Android; shadow* = iOS/web):
        elevation: 2,
        shadowColor: '#000', shadowOpacity: 0.08,
        shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
    },
    poster: { width: 80, height: 120 },
    semPoster: {
        backgroundColor: tema.cores.borda,
        alignItems: 'center', justifyContent: 'center',
    },
    info: { flex: 1, padding: espacos.pequeno },
    tituloFilme: {
        fontSize: fontes.subtitulo, fontWeight: 'bold',
        color: tema.cores.textoPrincipal,
    },
    ano: { color: tema.cores.textoSecundario, marginBottom: 4, fontSize: fontes.detalhe },
    sinopse: { fontSize: fontes.corpo, color: tema.cores.textoSecundario },
    textoSecundario: { color: tema.cores.textoSecundario },
    linhaBotoes: { flexDirection: 'row', marginTop: espacos.pequeno },
});