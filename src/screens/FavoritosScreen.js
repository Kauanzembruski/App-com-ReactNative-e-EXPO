// src/screens/FavoritosScreen.js
// Lista de favoritos (READ, UPDATE, DELETE) — agora consumindo o tema.

import { useState, useCallback } from 'react';
import {
    View, Text, TextInput, FlatList, Image,
    StyleSheet, ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { IMAGE_BASE } from '../services/tmdb';
import {
    listarFavoritos, atualizarFavorito, removerFavorito,
} from '../services/favoritos';
import { useTema } from '../ThemeContext';
import { espacos, fontes, raios } from '../theme';
import Botao from '../components/Botao';
import BotaoTema from '../components/BotaoTema';

export default function FavoritosScreen() {
    const { tema } = useTema();
    const estilos = criarEstilos(tema);

    const [favoritos, setFavoritos] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [mensagem, setMensagem] = useState(null);

    const [emEdicao, setEmEdicao] = useState(null);
    const [confirmandoExclusao, setConfirmandoExclusao] = useState(null); // id
    const [notaDigitada, setNotaDigitada] = useState('');
    const [comentarioDigitado, setComentarioDigitado] = useState('');

    async function carregarLista() {
        setCarregando(true);
        try {
            const dados = await listarFavoritos();
            setFavoritos(dados);
        } catch (e) {
            console.error(e);
            setMensagem('Não foi possível carregar os favoritos.');
        } finally {
            setCarregando(false);
        }
    }

    useFocusEffect(
        useCallback(() => {
            carregarLista();
        }, [])
    );

    function iniciarEdicao(fav) {
        setEmEdicao(fav.id);
        setNotaDigitada(String(fav.nota ?? ''));
        setComentarioDigitado(fav.comentario ?? '');
    }

    async function salvarEdicao(fav) {
        const nota = Number(notaDigitada);
        if (Number.isNaN(nota) || nota < 0 || nota > 10) {
            setMensagem('A nota precisa ser um número de 0 a 10.');
            return;
        }
        try {
            await atualizarFavorito(fav.id, {
                ...fav,
                nota,
                comentario: comentarioDigitado,
            });
            setEmEdicao(null);
            setMensagem(`"${fav.titulo}" atualizado.`);
            carregarLista();
        } catch (e) {
            console.error(e);
            setMensagem('Não foi possível salvar a alteração.');
        }
    }

    async function excluir(fav) {
        try {
            await removerFavorito(fav.id);
            setMensagem(`"${fav.titulo}" removido.`);
            carregarLista();
        } catch (e) {
            console.error(e);
            setMensagem('Não foi possível remover.');
        }
    }

    return (
        <View style={estilos.container}>
            <View style={estilos.linhaTitulo}>
                <Text style={estilos.titulo}>Meus Favoritos</Text>
                <BotaoTema />
            </View>

            {carregando && <ActivityIndicator size="large" color={tema.cores.primaria} />}
            {mensagem && <Text style={estilos.mensagem}>{mensagem}</Text>}

            <FlatList
                data={favoritos}
                keyExtractor={(item) => String(item.id)}
                refreshing={carregando}
                onRefresh={carregarLista}
                ListEmptyComponent={
                    !carregando && (
                        <Text style={estilos.vazio}>
                            Nenhum favorito ainda. Busque um filme na aba 🔍 e favorite!
                        </Text>
                    )
                }
                renderItem={({ item }) => (
                    <View style={estilos.card}>
                        {item.posterPath ? (
                            <Image
                                source={{ uri: IMAGE_BASE + item.posterPath }}
                                style={estilos.poster}
                            />
                        ) : (
                            <View style={[estilos.poster, estilos.semPoster]}>
                                <Text style={estilos.textoSecundario}>Sem pôster</Text>
                            </View>
                        )}

                        <View style={estilos.info}>
                            <Text style={estilos.tituloFilme}>
                                {item.titulo} {item.ano ? `(${item.ano})` : ''}
                            </Text>

                            {emEdicao === item.id ? (
                                // ----- MODO EDIÇÃO -----
                                <View>
                                    <TextInput
                                        style={estilos.campo}
                                        placeholder="Nota (0 a 10)"
                                        placeholderTextColor={tema.cores.textoSecundario}
                                        keyboardType="numeric"
                                        value={notaDigitada}
                                        onChangeText={setNotaDigitada}
                                    />
                                    <TextInput
                                        style={estilos.campo}
                                        placeholder="Comentário"
                                        placeholderTextColor={tema.cores.textoSecundario}
                                        value={comentarioDigitado}
                                        onChangeText={setComentarioDigitado}
                                    />
                                    <View style={estilos.linhaBotoes}>
                                        <Botao titulo="Salvar" cor="sucesso" pequeno
                                            onPress={() => salvarEdicao(item)} />
                                        <Botao titulo="Cancelar" cor="textoSecundario" pequeno
                                            onPress={() => setEmEdicao(null)} />
                                    </View>
                                </View>
                            ) : (
                                // ----- MODO LEITURA -----
                                <View>
                                    <Text style={estilos.nota}>
                                        {'⭐'.repeat(Math.round((item.nota || 0) / 2)) || '☆'} {item.nota}/10
                                    </Text>
                                    <Text style={estilos.comentario}>
                                        {item.comentario || 'Sem comentário.'}
                                    </Text>
                                    <View style={estilos.linhaBotoes}>
                                        <Botao titulo="✏️ Editar" pequeno
                                            onPress={() => iniciarEdicao(item)} />
                                        {confirmandoExclusao === item.id ? (
                                            <>
                                                <Botao titulo="Confirmar?" cor="perigo" pequeno
                                                    onPress={() => {
                                                        setConfirmandoExclusao(null);
                                                        excluir(item);
                                                    }} />
                                                <Botao titulo="Não" cor="textoSecundario" pequeno
                                                    onPress={() => setConfirmandoExclusao(null)} />
                                            </>
                                        ) : (
                                            <Botao titulo="🗑️ Excluir" cor="perigo" pequeno
                                                onPress={() => setConfirmandoExclusao(item.id)} />
                                        )}
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>
                )}
            />
        </View>
    );
}

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
    mensagem: {
        color: tema.cores.sucesso, marginBottom: espacos.pequeno,
        fontWeight: 'bold',
    },
    vazio: {
        color: tema.cores.textoSecundario, marginTop: espacos.grande,
        textAlign: 'center',
    },
    card: {
        flexDirection: 'row', marginBottom: espacos.medio,
        borderWidth: 1, borderColor: tema.cores.borda,
        borderRadius: raios.card, overflow: 'hidden',
        backgroundColor: tema.cores.card,
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
        color: tema.cores.textoPrincipal, marginBottom: 4,
    },
    nota: { color: tema.cores.alerta, fontWeight: 'bold', marginBottom: 2 },
    comentario: {
        fontSize: fontes.corpo, color: tema.cores.textoSecundario,
        marginBottom: espacos.pequeno,
    },
    campo: {
        borderWidth: 1, borderColor: tema.cores.borda,
        borderRadius: raios.campo, paddingHorizontal: espacos.pequeno,
        height: 36, marginBottom: 6,
        color: tema.cores.textoPrincipal, backgroundColor: tema.cores.fundo,
    },
    textoSecundario: { color: tema.cores.textoSecundario },
    linhaBotoes: { flexDirection: 'row', gap: espacos.pequeno },
});