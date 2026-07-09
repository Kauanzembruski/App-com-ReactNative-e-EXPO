// src/screens/BuscaScreen.js
// Tela de busca de filmes no TMDB.

import { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    FlatList, Image, StyleSheet, ActivityIndicator,
} from 'react-native';
import { buscarFilmes, IMAGE_BASE } from '../services/tmdb';
import { adicionarFavorito, listarFavoritos } from '../services/favoritos';

export default function BuscaScreen() {
    // Estado = a "memória" da tela. Quando um estado muda, o React redesenha.
    const [texto, setTexto] = useState('');        // o que o usuário digitou
    const [filmes, setFilmes] = useState([]);      // resultados da busca
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState(null);
    const [mensagem, setMensagem] = useState(null);

    async function aoFavoritar(filme) {
        try {
            // Regra de negócio: não favoritar o mesmo filme duas vezes.
            // Verificamos pelo tmdbId — é para isso que guardamos a referência externa.
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
                nota: 0,           // usuário define depois, na tela de favoritos
                comentario: '',
            });
            setMensagem(`"${filme.title}" adicionado aos favoritos!`);
        } catch (e) {
            console.error(e); // erro técnico completo no console, pro desenvolvedor
            setMensagem('Não foi possível salvar o favorito.');
        }
    }
    async function aoBuscar() {
        if (!texto.trim()) return; // ignora busca vazia
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

    return (
        <View style={estilos.container}>
            <Text style={estilos.titulo}>Meu Catálogo de Filmes</Text>

            <View style={estilos.linhaBusca}>
                <TextInput
                    style={estilos.campo}
                    placeholder="Digite o nome de um filme..."
                    value={texto}
                    onChangeText={setTexto}
                    onSubmitEditing={aoBuscar}  // Enter também dispara a busca
                />
                <TouchableOpacity style={estilos.botao} onPress={aoBuscar}>
                    <Text style={estilos.botaoTexto}>Buscar</Text>
                </TouchableOpacity>
            </View>

            {carregando && <ActivityIndicator size="large" />}
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
                                <Text>Sem pôster</Text>
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
                            <TouchableOpacity
                                style={estilos.botaoFavoritar}
                                onPress={() => aoFavoritar(item)}
                            >
                                <Text style={estilos.botaoTexto}>⭐ Favoritar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}

const estilos = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 48, backgroundColor: '#fff' },
    titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
    linhaBusca: { flexDirection: 'row', marginBottom: 12 },
    campo: {
        flex: 1, borderWidth: 1, borderColor: '#ccc',
        borderRadius: 8, paddingHorizontal: 12, height: 44,
    },
    botao: {
        marginLeft: 8, backgroundColor: '#2563EB', borderRadius: 8,
        justifyContent: 'center', paddingHorizontal: 16,
    },
    botaoTexto: { color: '#fff', fontWeight: 'bold' },
    erro: { color: '#DC2626', marginBottom: 8 },
    card: {
        flexDirection: 'row', marginBottom: 12, borderWidth: 1,
        borderColor: '#eee', borderRadius: 8, overflow: 'hidden',
    },
    poster: { width: 80, height: 120 },
    semPoster: {
        backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center',
    },
    info: { flex: 1, padding: 8 },
    tituloFilme: { fontSize: 16, fontWeight: 'bold' },
    ano: { color: '#666', marginBottom: 4 },
    sinopse: { fontSize: 13, color: '#444' },
    mensagem: { color: '#16A34A', marginBottom: 8, fontWeight: 'bold' },
    botaoFavoritar: {
        backgroundColor: '#16A34A', borderRadius: 6, paddingVertical: 6,
        paddingHorizontal: 10, alignSelf: 'flex-start', marginTop: 6,
    },
});