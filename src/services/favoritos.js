// src/services/favoritos.js
// Camada de comunicação com o MockAPI — CRUD dos favoritos.
// Mesmo padrão do tmdb.js: as telas nunca usam fetch direto.

const BASE_URL = `${process.env.EXPO_PUBLIC_MOCKAPI_URL}/favoritos`;

// Função auxiliar: trata a resposta de todas as chamadas do mesmo jeito.
async function tratarResposta(resposta) {
  if (!resposta.ok) {
    throw new Error(`Erro na API de favoritos: ${resposta.status}`);
  }
  return resposta.json();
}

/** READ — lista todos os favoritos. */
export async function listarFavoritos() {
  const resposta = await fetch(BASE_URL);
  return tratarResposta(resposta);
}

/** CREATE — adiciona um favorito. Recebe o objeto sem id (o MockAPI gera). */
export async function adicionarFavorito(favorito) {
  const resposta = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(favorito),
  });
  return tratarResposta(resposta);
}

/** UPDATE — atualiza nota/comentário de um favorito existente. */
export async function atualizarFavorito(id, dados) {
  const resposta = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  return tratarResposta(resposta);
}

/** DELETE — remove um favorito. */
export async function removerFavorito(id) {
  const resposta = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  return tratarResposta(resposta);
}