// TesteService.js
import { getRequest } from "./api.js";

export function criarTesteService() {

    async function listarTestes() {

        const res = await getRequest({
            action: "listarTestes"
        });

        if (res.sucesso) return res.dados || [];

        throw new Error(res.erro || "Erro ao listar testes");

    }

    async function buscarTextoPorTeste(testeId) {

        const res = await getRequest({
            action: "buscarTextoPorTeste",
            testeId
        });

        if (res.sucesso) return res.dados;

        throw new Error(res.erro || "Erro ao buscar texto");

    }

    async function buscarPerguntasCompreensao(testeId) {

        const res = await getRequest({
            action: "buscarPerguntasCompreensao",
            testeId
        });

        if (res.sucesso) return res.dados || [];

        throw new Error(res.erro || "Erro ao buscar perguntas");

    }

    return {
        listarTestes,
        buscarTextoPorTeste,
        buscarPerguntasCompreensao
    };

}