// src/services/tmdb.js
// Camada de comunicação com a API do TMDB (The Movie Database).
// Toda chamada à API externa passa por aqui — as telas nunca usam fetch direto.

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;

// Base para montar URLs de pôsteres. O TMDB devolve só o caminho
// (ex: "/abc123.jpg") e nós completamos com o tamanho desejado.
export const IMAGE_BASE = 'https://image.tmdb.org/t/p/w342';

/**
 * Busca filmes pelo título.
 * @param {string} query - texto digitado pelo usuário
 * @returns {Promise<Array>} lista de filmes (pode ser vazia)
 */
export async function buscarFilmes(query) {
    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=pt-BR`;

    const resposta = await fetch(url);

    if (!resposta.ok) {
        // Erro HTTP (401 = chave errada, 404 = rota errada, etc.)
        throw new Error(`Erro na API do TMDB: ${resposta.status}`);
    }

    const dados = await resposta.json();
    return dados.results; // o TMDB devolve { page, results, total_pages, ... }
}