// TesteService.js
import { getRequest } from "./api.js";

export function criarTesteService() {
    async function buscarTestes() {
        return await getRequest({ action: "listarTestes" });
    }

    async function buscarTestePorId(id) {
        return await getRequest({ action: "buscarTestePorId", testeId: id });
    }

    async function buscarPerguntasCompreensao(testeId) {
        return await getRequest({ action: "buscarPerguntasCompreensao", testeId });
    }

    return { buscarTestes, buscarTestePorId, buscarPerguntasCompreensao };
}