// src/ThemeContext.js
// Context do tema: disponibiliza o tema atual (e a função de troca)
// para QUALQUER componente do app, sem passar por props.

import { createContext, useContext, useState } from 'react';
import { temaClaro, temaEscuro } from './theme';

// 1) O "quadro de avisos" em si.
const ThemeContext = createContext(null);

// 2) O provedor: componente que abraça o app e anuncia o valor.
export function ThemeProvider({ children }) {
    const [tema, setTema] = useState(temaClaro); // claro é o padrão

    function alternarTema() {
        setTema((atual) => (atual.nome === 'claro' ? temaEscuro : temaClaro));
    }

    return (
        <ThemeContext.Provider value={{ tema, alternarTema }}>
            {children}
        </ThemeContext.Provider>
    );
}

// 3) O hook de leitura: como qualquer componente acessa o tema.
//    Uso: const { tema, alternarTema } = useTema();
export function useTema() {
    const contexto = useContext(ThemeContext);
    if (!contexto) {
        // Erro pedagógico: acusa na hora se alguém esquecer o Provider.
        throw new Error('useTema precisa estar dentro de <ThemeProvider>');
    }
    return contexto;
}