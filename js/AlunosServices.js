// AlunoService.js
import { getRequest, postRequest } from "./api.js";

export function criarAlunoService() {
    async function listarAlunos() {
        return await getRequest({ action: "listarAlunos" });
    }

    async function registrarAluno(aluno) {
        return await postRequest("registrarAluno", aluno);
    }

    return { listarAlunos, registrarAluno };
}