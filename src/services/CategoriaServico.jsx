import { getToken } from "../security/Autenticacao";

const API_URL = process.env.REACT_APP_ENDERECO_API || "http://localhost:3003";

const requisicaoCategoria = async (url, options) => {
    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            "authorization": getToken()
        }
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || `Erro na requisição: ${response.status}`);
    }

    return data;
};

export const getCategoriasAPI = async () => {
    const data = await requisicaoCategoria(`${API_URL}/categoria`, {
        method: "GET"
    });
    return data;
};

export const getCategoriaPorCodigoAPI = async codigo => {
    const data = await requisicaoCategoria(`${API_URL}/categoria/${codigo}`, {
        method: "GET"
    });
    return data;
};

export const deleteCategoriaPorCodigoAPI = async codigo => {
    const data = await requisicaoCategoria(`${API_URL}/categoria/${codigo}`, {
        method: "DELETE"
    });
    return data;
};

export const cadastraCategoriaAPI = async (objeto, metodo) => {
    const data = await requisicaoCategoria(`${API_URL}/categoria`, {
        method: metodo,
        body: JSON.stringify(objeto),
    });
    return data;
};