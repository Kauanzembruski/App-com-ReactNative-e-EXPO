// src/screens/FavoritosScreen.js
// Lista de favoritos: READ (listar), UPDATE (nota/comentário), DELETE (remover).
// (Versão do Passo 9 — será refatorada com o tema no Passo 13b.)

import { useState, useCallback } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    FlatList, Image, StyleSheet, ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { IMAGE_BASE } from '../services/tmdb';
import {
    listarFavoritos, atualizarFavorito, removerFavorito,
} from '../services/favoritos';

export default function FavoritosScreen() {
    const [favoritos, setFavoritos] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [mensagem, setMensagem] = useState(null);

    // Controle da edição: qual item está sendo editado e os valores digitados.
    const [emEdicao, setEmEdicao] = useState(null);   // id do favorito em edição
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

    // Recarrega sempre que a aba ganha foco (inclusive na primeira vez).
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
                ...fav,                     // mantém os campos que não mudaram
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
            <Text style={estilos.titulo}>Meus Favoritos</Text>

            {carregando && <ActivityIndicator size="large" />}
            {mensagem && <Text style={estilos.mensagem}>{mensagem}</Text>}

            <FlatList
                data={favoritos}
                keyExtractor={(item) => String(item.id)}
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
                                <Text>Sem pôster</Text>
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
                                        keyboardType="numeric"
                                        value={notaDigitada}
                                        onChangeText={setNotaDigitada}
                                    />
                                    <TextInput
                                        style={estilos.campo}
                                        placeholder="Comentário"
                                        value={comentarioDigitado}
                                        onChangeText={setComentarioDigitado}
                                    />
                                    <View style={estilos.linhaBotoes}>
                                        <TouchableOpacity
                                            style={[estilos.botaoPequeno, estilos.botaoSalvar]}
                                            onPress={() => salvarEdicao(item)}
                                        >
                                            <Text style={estilos.botaoTexto}>Salvar</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[estilos.botaoPequeno, estilos.botaoCancelar]}
                                            onPress={() => setEmEdicao(null)}
                                        >
                                            <Text style={estilos.botaoTexto}>Cancelar</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ) : (
                                // ----- MODO LEITURA -----
                                <View>
                                    <Text style={estilos.nota}>Nota: {item.nota} / 10</Text>
                                    <Text style={estilos.comentario}>
                                        {item.comentario || 'Sem comentário.'}
                                    </Text>
                                    <View style={estilos.linhaBotoes}>
                                        <TouchableOpacity
                                            style={[estilos.botaoPequeno, estilos.botaoEditar]}
                                            onPress={() => iniciarEdicao(item)}
                                        >
                                            <Text style={estilos.botaoTexto}>✏️ Editar</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[estilos.botaoPequeno, estilos.botaoExcluir]}
                                            onPress={() => excluir(item)}
                                        >
                                            <Text style={estilos.botaoTexto}>🗑️ Excluir</Text>
                                        </TouchableOpacity>
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

const estilos = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 48, backgroundColor: '#fff' },
    titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
    mensagem: { color: '#16A34A', marginBottom: 8, fontWeight: 'bold' },
    vazio: { color: '#666', marginTop: 24, textAlign: 'center' },
    card: {
        flexDirection: 'row', marginBottom: 12, borderWidth: 1,
        borderColor: '#eee', borderRadius: 8, overflow: 'hidden',
    },
    poster: { width: 80, height: 120 },
    semPoster: {
        backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center',
    },
    info: { flex: 1, padding: 8 },
    tituloFilme: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
    nota: { color: '#F59E0B', fontWeight: 'bold', marginBottom: 2 },
    comentario: { fontSize: 13, color: '#444', marginBottom: 6 },
    campo: {
        borderWidth: 1, borderColor: '#ccc', borderRadius: 6,
        paddingHorizontal: 8, height: 36, marginBottom: 6,
    },
    linhaBotoes: { flexDirection: 'row', gap: 8 },
    botaoPequeno: {
        borderRadius: 6, paddingVertical: 6, paddingHorizontal: 10,
    },
    botaoSalvar: { backgroundColor: '#16A34A' },
    botaoCancelar: { backgroundColor: '#94A3B8' },
    botaoEditar: { backgroundColor: '#2563EB' },
    botaoExcluir: { backgroundColor: '#DC2626' },
    botaoTexto: { color: '#fff', fontWeight: 'bold' },
});