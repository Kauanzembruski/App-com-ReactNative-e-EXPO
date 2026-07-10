// src/theme.js
// Identidade visual centralizada (design tokens).
// Regra do projeto: NENHUMA tela usa cor hexadecimal direto —
// sempre através dos nomes semânticos daqui.

// Tokens que não mudam entre os temas:
export const espacos = {
    pequeno: 8,
    medio: 16,
    grande: 24,
};

export const fontes = {
    titulo: 22,
    subtitulo: 16,
    corpo: 14,
    detalhe: 12,
};

export const raios = {
    card: 12,
    botao: 8,
    campo: 8,
};

// As duas paletas: mesmos NOMES, valores diferentes.
export const temaClaro = {
    nome: 'claro',
    cores: {
        fundo: '#F8FAFC',          // fundo geral das telas
        card: '#FFFFFF',           // superfícies elevadas
        borda: '#E2E8F0',
        textoPrincipal: '#0F172A',
        textoSecundario: '#64748B',
        primaria: '#2563EB',       // ações principais (buscar, editar)
        sucesso: '#16A34A',        // confirmações, favoritar
        alerta: '#F59E0B',         // nota/estrela
        perigo: '#DC2626',         // excluir, erros
        textoSobreCor: '#FFFFFF',  // texto em cima de botões coloridos
    },
};

export const temaEscuro = {
    nome: 'escuro',
    cores: {
        fundo: '#0F172A',
        card: '#1E293B',
        borda: '#334155',
        textoPrincipal: '#F1F5F9',
        textoSecundario: '#94A3B8',
        primaria: '#3B82F6',       // um tom acima do claro: contraste no escuro
        sucesso: '#22C55E',
        alerta: '#FBBF24',
        perigo: '#EF4444',
        textoSobreCor: '#FFFFFF',
    },
};