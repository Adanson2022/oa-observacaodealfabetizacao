// TesteService.js
import { getRequest } from "./api.js";

export function criarTesteService() {

    async function listarTestes() {

        try {

            const res = await getRequest({
                action: "listarTestes"
            });
            console.log("Resposta testes da API: ", res);
            // formato padrão da API
            if (res && res?.sucesso !== undefined) {
                return res;
            }

            // caso a API retorne array direto
            if (Array.isArray(res)) return res;
            

            throw new Error(res?.erro || "Erro ao listar testes");

        } catch (err) {

            console.error("Erro em listarTestes:", err);
            throw err;

        }

    }

    async function buscarTextoPorTeste(testeId) {

        try {

            const res = await getRequest({
                action: "buscarTextoPorTeste",
                testeId
            });

            // formato padrão
            if (res?.sucesso) return res.dados;

            // caso backend retorne objeto direto
            if (res && typeof res === "object") return res;

            throw new Error(res?.erro || "Erro ao buscar texto");

        } catch (err) {

            console.error("Erro em buscarTextoPorTeste:", err);
            throw err;

        }

    }

    async function buscarPerguntasCompreensao(testeId) {

        try {

            const res = await getRequest({
                action: "buscarPerguntasCompreensao",
                testeId
            });

            // formato padrão
            if (res?.sucesso) return res.dados || [];

            // caso backend retorne array direto
            if (Array.isArray(res)) return res;
            
            throw new Error(res?.erro || "Erro ao buscar perguntas");

        } catch (err) {

            console.error("Erro em buscarPerguntasCompreensao:", err);
            throw err;

        }

    }

    return {
        listarTestes,
        buscarTextoPorTeste,
        buscarPerguntasCompreensao
    };

}