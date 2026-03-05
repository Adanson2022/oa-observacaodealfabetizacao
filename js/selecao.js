// selecao.js
export function inicializarSelecao({ AlunoService, TesteService, mostrarToast, mostrarAvaliacao, iniciarAvaliacaoUI }) {
    const localidadeEl = document.getElementById("localidade");
    const escolaEl = document.getElementById("escola");
    const anoEl = document.getElementById("ano");
    const turmaEl = document.getElementById("turma");
    const alunoEl = document.getElementById("aluno");
    const tipoTextoSelect = document.getElementById("tipoTextoSelect");
    const btnIniciarAvaliacao = document.getElementById("btnIniciarAvaliacao");

    let todosAlunos = [];
    let todosTestes = [];

    async function initSelecao() {
        try {
            todosAlunos = await AlunoService.listarAlunos();
            todosTestes = await TesteService.buscarTestes();
        } catch (err) {
            console.error(err);
            mostrarToast("Erro ao carregar alunos ou testes", "erro");
        }
    }

    function popularEscola() {
        escolaEl.innerHTML = '<option value="">Selecione</option>';
        const selecionados = todosAlunos.filter(a => a.localidade === localidadeEl.value);
        const escolas = [...new Set(selecionados.map(a => a.escola))];
        escolas.forEach(e => {
            const opt = document.createElement("option");
            opt.value = e;
            opt.textContent = e;
            escolaEl.appendChild(opt);
        });
        escolaEl.disabled = false;
        anoEl.disabled = true;
        turmaEl.disabled = true;
        alunoEl.disabled = true;
    }

    function popularAno() {
        anoEl.innerHTML = '<option value="">Selecione</option>';
        const filtrados = todosAlunos.filter(a =>
            a.localidade === localidadeEl.value && a.escola === escolaEl.value
        );
        const anos = [...new Set(filtrados.map(a => a.ano))];
        anos.forEach(a => {
            const opt = document.createElement("option");
            opt.value = a;
            opt.textContent = a;
            anoEl.appendChild(opt);
        });
        anoEl.disabled = false;
        turmaEl.disabled = true;
        alunoEl.disabled = true;
    }

    function popularTurma() {
        turmaEl.innerHTML = '<option value="">Selecione</option>';
        const filtrados = todosAlunos.filter(a =>
            a.localidade === localidadeEl.value &&
            a.escola === escolaEl.value &&
            a.ano === anoEl.value
        );
        const turmas = [...new Set(filtrados.map(a => a.turma))];
        turmas.forEach(t => {
            const opt = document.createElement("option");
            opt.value = t;
            opt.textContent = t;
            turmaEl.appendChild(opt);
        });
        turmaEl.disabled = false;
        alunoEl.disabled = true;
    }

    function popularAluno() {
        alunoEl.innerHTML = '<option value="">Selecione</option>';
        const filtrados = todosAlunos.filter(a =>
            a.localidade === localidadeEl.value &&
            a.escola === escolaEl.value &&
            a.ano === anoEl.value &&
            a.turma === turmaEl.value
        );
        filtrados.forEach(a => {
            const opt = document.createElement("option");
            opt.value = a.id;
            opt.textContent = a.nome;
            alunoEl.appendChild(opt);
        });
        alunoEl.disabled = false;
    }

    btnIniciarAvaliacao.addEventListener("click", () => {
        if (!alunoEl.value) return mostrarToast("Selecione um aluno", "aviso");
        if (!tipoTextoSelect.value) return mostrarToast("Selecione o tipo de texto", "aviso");

        const teste = todosTestes.find(t => t.tipo === tipoTextoSelect.value);
        if (!teste) return mostrarToast("Teste não encontrado", "erro");

        window.AVALIACAO_ATUAL = { alunoId: alunoEl.value, teste };
        mostrarAvaliacao();
        iniciarAvaliacaoUI(); // inicia UI da avaliação
    });

    // Eventos de select
    localidadeEl.addEventListener("change", popularEscola);
    escolaEl.addEventListener("change", popularAno);
    anoEl.addEventListener("change", popularTurma);
    turmaEl.addEventListener("change", popularAluno);

    initSelecao();
}