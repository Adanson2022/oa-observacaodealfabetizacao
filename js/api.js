const API_URL = "https://script.google.com/macros/s/AKfycbwwPus4dje_Uk_dmaSJejqUpAX8tirIOmUzVuEWEdcm_QMfU9Cv0fSqtecGlj6pjpuj/exec";

/**
 * Função base para comunicação com a API
 */
async function apiRequest(action, data = {}) {

    try {

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: action,
                payload: data
            })
        });

        const result = await response.json();

        if (!result.sucesso) {
            throw new Error(result.erro || "Erro desconhecido");
        }

        return result;

    } catch (error) {
        console.error("Erro API:", error);
        mostrarToast("Erro de comunicação com servidor", "erro");
        throw error;
    }

}

async function buscarAlunos() {

    const resp = await apiRequest("buscarAlunos");

    return resp.dados;

}

async function buscarTestes() {

    const resp = await apiRequest("buscarTestes");

    return resp.dados;

}

async function buscarTestePorId(id) {

    const resp = await apiRequest("buscarTestePorId", {
        id: id
    });

    return resp.dados;

}

async function registrarAvaliacao(avaliacao) {

    const resp = await apiRequest("registrarAvaliacao", avaliacao);

    return resp;

}