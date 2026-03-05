const API_URL = "https://script.google.com/macros/s/AKfycbxxKYTfx9Pt_aeIeaV48XIGH3Ix-HZ53GwK6WQ4rhtaErhMaGHm9LHLGaZYG0wChfNciA/exec";

/**
 * Função base para requisições POST
 */
async function postRequest(action, payload = {}) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action, ...payload })
        });

        const result = await response.json();

        if (!result.sucesso) {
            throw new Error(result.erro || "Erro desconhecido");
        }

        return result.data;
    } catch (error) {
        console.error("Erro API (POST):", error);
        mostrarToast("Erro de comunicação com servidor", "erro");
        throw error;
    }
}

/**
 * Função base para requisições GET
 */
async function getRequest(params = {}) {
    try {
        const url = new URL(API_URL);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        const response = await fetch(url.toString());
        const result = await response.json();

        if (!result.sucesso) {
            throw new Error(result.erro || "Erro desconhecido");
        }

        return result.data;
    } catch (error) {
        console.error("Erro API (GET):", error);
        mostrarToast("Erro de comunicação com servidor", "erro");
        throw error;
    }
}

// =======================
// Funções do frontend
// =======================

async function buscarAlunos() {
    return getRequest({ action: "listarAlunos" });
}

async function listarAvaliacoes(alunoId) {
    return getRequest({ action: "listarAvaliacoes", alunoid: alunoId });
}

async function buscarPerguntasCompreensao(testeId) {
    return getRequest({ action: "buscarPerguntasCompreensao", testeId });
}

async function registrarAluno(aluno) {
    return postRequest("registrarAluno", aluno);
}

async function registrarAvaliacao(avaliacao) {
    return postRequest("registrarAvaliacao", avaliacao);
}