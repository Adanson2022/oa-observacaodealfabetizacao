// AlunoService.js
// Responsável por todas as operações relacionadas aos alunos

async function listarAlunos() {
    return await getRequest({ action: "listarAlunos" });
}

async function registrarAluno(aluno) {
    return await postRequest("registrarAluno", aluno);
}

export const AlunoService = {
    listarAlunos,
    registrarAluno
};