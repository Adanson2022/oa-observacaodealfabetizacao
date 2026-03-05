// AvaliacaoService.js
// Responsável por registrar e listar avaliações

async function registrarAvaliacao(avaliacao) {
    return await postRequest("registrarAvaliacao", avaliacao);
}

async function listarAvaliacoes(alunoId) {
    return await getRequest({ action: "listarAvaliacoes", alunoid: alunoId });
}

export const AvaliacaoService = {
    registrarAvaliacao,
    listarAvaliacoes
};