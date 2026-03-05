// TesteService.js
// Responsável por buscar testes e perguntas

async function buscarTestes() {
    return await getRequest({ action: "listarTestes" }); // Ajuste se seu backend tiver listarTestes
}

async function buscarTestePorId(id) {
    return await getRequest({ action: "buscarTestePorId", testeId: id });
}

async function buscarPerguntasCompreensao(testeId) {
    return await getRequest({ action: "buscarPerguntasCompreensao", testeId });
}

export const TesteService = {
    buscarTestes,
    buscarTestePorId,
    buscarPerguntasCompreensao
};