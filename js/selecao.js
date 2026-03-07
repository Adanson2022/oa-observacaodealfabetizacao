// selecao.js
import { AppState } from "./AppState.js";
import { Router } from "./Router.js";

export function inicializarSelecao({ AlunosService, TesteService, mostrarToast}) {
    const localidadeEl = document.getElementById("localidade");
    const escolaEl = document.getElementById("escola");
    const anoEl = document.getElementById("ano");
    const turmaEl = document.getElementById("turma");
    const alunoEl = document.getElementById("aluno");
    const tipoTextoSelect = document.getElementById("tipoTextoSelect");
    const btnIrParaAvaliacao = document.getElementById("btnIrParaAvaliacao");

    let todosAlunos = [];
    let todosTestes = [];

    async function initSelecao() {
        try {
            const resAlunos = await AlunosService.listarAlunos();

            if (!resAlunos.sucesso) {
                throw new Error("Falha ao carregar alunos");
            }

            todosAlunos = resAlunos.dados || [];

            AppState.setAlunos(todosAlunos);

            const resTestes = await TesteService.listarTestes();
            todosTestes = resTestes || [];

            AppState.setTestes(todosTestes);

            popularLocalidade();
            popularTestes();

        } catch (err) {
            console.error(err);
            mostrarToast("Erro ao carregar alunos ou testes", "erro");
        }
    }

    function popularLocalidade() {
        const localidades = [...new Set(todosAlunos.map(a => a.localidade))].sort();
        localidadeEl.innerHTML = '<option value="">Selecione</option>';
        localidades.forEach(loc => {
            const opt = document.createElement("option");
            opt.value = loc;
            opt.textContent = loc;
            localidadeEl.appendChild(opt);
        });

        escolaEl.innerHTML = '<option value="">Selecione</option>';
        anoEl.innerHTML = '<option value="">Selecione</option>';
        turmaEl.innerHTML = '<option value="">Selecione</option>';
        alunoEl.innerHTML = '<option value="">Selecione</option>';

        escolaEl.disabled = true;
        anoEl.disabled = true;
        turmaEl.disabled = true;
        alunoEl.disabled = true;
    }

    function popularEscola() {
        escolaEl.innerHTML = '<option value="">Selecione</option>';
        anoEl.innerHTML = '<option value="">Selecione</option>';
        turmaEl.innerHTML = '<option value="">Selecione</option>';
        alunoEl.innerHTML = '<option value="">Selecione</option>';

        if (!localidadeEl.value) return (escolaEl.disabled = anoEl.disabled = turmaEl.disabled = alunoEl.disabled = true);

        const filtrados = todosAlunos.filter(a => a.localidade === localidadeEl.value);
        const escolas = [...new Set(filtrados.map(a => a.escola))].sort();
        escolas.forEach(e => {
            const opt = document.createElement("option");
            opt.value = e;
            opt.textContent = e;
            escolaEl.appendChild(opt);
        });

        escolaEl.disabled = escolas.length === 0;
        anoEl.disabled = true;
        turmaEl.disabled = true;
        alunoEl.disabled = true;
    }

    function popularAno() {
        anoEl.innerHTML = '<option value="">Selecione</option>';
        turmaEl.innerHTML = '<option value="">Selecione</option>';
        alunoEl.innerHTML = '<option value="">Selecione</option>';

        if (!escolaEl.value) return (anoEl.disabled = turmaEl.disabled = alunoEl.disabled = true);

        const filtrados = todosAlunos.filter(a => a.localidade === localidadeEl.value && a.escola === escolaEl.value);
        const anos = [...new Set(filtrados.map(a => a.anoescolar))].sort();
        anos.forEach(a => {
            const opt = document.createElement("option");
            opt.value = a;
            opt.textContent = a;
            anoEl.appendChild(opt);
        });

        anoEl.disabled = anos.length === 0;
        turmaEl.disabled = true;
        alunoEl.disabled = true;
    }

    function popularTurma() {
        turmaEl.innerHTML = '<option value="">Selecione</option>';
        alunoEl.innerHTML = '<option value="">Selecione</option>';

        if (!anoEl.value) return (turmaEl.disabled = alunoEl.disabled = true);

        const filtrados = todosAlunos.filter(a => a.localidade === localidadeEl.value && a.escola === escolaEl.value && a.anoescolar === anoEl.value);
        const turmas = [...new Set(filtrados.map(a => a.turma))].sort();
        turmas.forEach(t => {
            const opt = document.createElement("option");
            opt.value = t;
            opt.textContent = t;
            turmaEl.appendChild(opt);
        });

        turmaEl.disabled = turmas.length === 0;
        alunoEl.disabled = true;
    }

    function popularAluno() {
        alunoEl.innerHTML = '<option value="">Selecione</option>';

        if (!turmaEl.value) return (alunoEl.disabled = true);

        const filtrados = todosAlunos.filter(a =>
            a.localidade === localidadeEl.value &&
            a.escola === escolaEl.value &&
            a.anoescolar === anoEl.value &&
            a.turma === turmaEl.value
        );
        filtrados.forEach(a => {
            const opt = document.createElement("option");
            opt.value = String(a.id);
            opt.textContent = a.nome;
            alunoEl.appendChild(opt);
        });

        alunoEl.disabled = filtrados.length === 0;
    }

    function popularTestes() {

        tipoTextoSelect.innerHTML = '<option value="">Selecione</option>';

        todosTestes.forEach(t => {

            const opt = document.createElement("option");

            opt.value = t.id || t.Id_teste;
            opt.textContent = t.nome;

            tipoTextoSelect.appendChild(opt);

        });

    }    

    // Eventos dropdowns
    localidadeEl.addEventListener("change", popularEscola);
    escolaEl.addEventListener("change", popularAno);
    anoEl.addEventListener("change", popularTurma);
    turmaEl.addEventListener("change", popularAluno);

    // Botão da tela de seleção: só abre tela de avaliação e carrega texto
    btnIrParaAvaliacao.addEventListener("click", async () => {

        if (!alunoEl.value) return mostrarToast("Selecione um aluno", "aviso");
        if (!tipoTextoSelect.value) return mostrarToast("Selecione o tipo de texto", "aviso");

        try {

            const alunoSelecionado = todosAlunos.find(a => a.id === Number(alunoEl.value));

            const testeSelecionado = todosTestes.find(t => (t.id || t.Id_teste) == tipoTextoSelect.value);
            console.log("Aluno selecionado:", alunoSelecionado);
            console.log("Teste selecionado:", testeSelecionado);
            const texto = await TesteService.buscarTextoPorTeste(tipoTextoSelect.value);

            const testeCompleto = {
                ...testeSelecionado,
                texto: texto.texto || texto
            };

            AppState.setAvaliacaoAtual({
                aluno: alunoSelecionado,
                teste: testeCompleto
            });

            Router.mostrarTela("tela-avaliacao");

        }

        catch (err) {

            console.error(err);
            mostrarToast("Erro ao carregar teste", "erro");

        }

    });

    initSelecao();
}