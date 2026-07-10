import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { temaClaro, temaEscuro } from './theme';

const ThemeContext = createContext(null);
const CHAVE_STORAGE = 'tema-preferido';

export function ThemeProvider({ children }) {
    const [tema, setTema] = useState(temaClaro);

    // Na primeira montagem, tenta recuperar a preferência salva.
    useEffect(() => {
        AsyncStorage.getItem(CHAVE_STORAGE).then((salvo) => {
            if (salvo === 'escuro') setTema(temaEscuro);
        });
    }, []);

    function alternarTema() {
        setTema((atual) => {
            const novo = atual.nome === 'claro' ? temaEscuro : temaClaro;
            AsyncStorage.setItem(CHAVE_STORAGE, novo.nome); // persiste a escolha
            return novo;
        });
    }

    return (
        <ThemeContext.Provider value={{ tema, alternarTema }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTema() {
    const contexto = useContext(ThemeContext);
    if (!contexto) {
        throw new Error('useTema precisa estar dentro de <ThemeProvider>');
    }
    return contexto;
}