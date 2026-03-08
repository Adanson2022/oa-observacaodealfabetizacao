// AlunosService.js
import { getRequest, postRequest } from "./api.js";

export function criarAlunosService() {

    // Lista todos os alunos do backend
    async function listarAlunos() {
        try {
            const res = await getRequest({ action: "listarAlunos" });

            // Caso backend já retorne no formato esperado
            if (res && res?.sucesso !== undefined) {
                return res;
            }

            // Caso backend retorne apenas array de alunos
            if (Array.isArray(res)) {
                return { sucesso: true, dados: res };
            }

            console.error("Erro ao listar alunos:", res?.erro);
            return { sucesso: false, dados: [] };

        } catch (err) {
            console.error("Erro na requisição listarAlunos:", err);
            return { sucesso: false, dados: [] };
        }
    }

    // Registra um novo aluno
    async function registrarAluno(aluno) {
        try {
            const res = await postRequest("registrarAluno", aluno);
            if (res.sucesso) return res.dados;
            throw new Error(res.erro);
        } catch (err) {
            console.error("Erro na requisição registrarAluno:", err);
            throw err;
        }
    }

    return { listarAlunos, registrarAluno };
}