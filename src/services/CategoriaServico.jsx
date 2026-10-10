const API_URL = process.env.REACT_APP_ENDERECO_API || "http://localhost:3003";
export const getCategoriasAPI = async () => {
    const response = await fetch(`${API_URL}/categoria`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
    const data = await response.json()
    return data;
}

export const getCategoriaPorCodigoAPI = async codigo => {
    const response = await fetch(`${API_URL}/categoria/${codigo}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
    const data = await response.json();
    return data;
}

export const deleteCategoriaPorCodigoAPI = async codigo => {
    const response = await fetch(`${API_URL}/categoria/${codigo}`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });
    const data = await response.json();
    return data;
}

export const cadastraCategoriaAPI = async (objeto, metodo) => {
    const response = await fetch(`${API_URL}/categoria`, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(objeto),
    })
    const data = await response.json();
    return data;
}