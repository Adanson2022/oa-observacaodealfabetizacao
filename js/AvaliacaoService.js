// AvaliacaoService.js
import { getRequest, postRequest } from "./api.js";

export function criarAvaliacaoService() {
    async function registrarAvaliacao(avaliacao) {
        return await postRequest("registrarAvaliacao", avaliacao);
    }

    async function listarAvaliacoes(alunoId) {
        return await getRequest({ action: "listarAvaliacoes",alunoId });
    }

    return { registrarAvaliacao, listarAvaliacoes };
}