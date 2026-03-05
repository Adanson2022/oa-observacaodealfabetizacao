let estruturaAlunos = {};
let alunoSelecionadoId = null;
window.alunoSelecionadoId = null;

function resetSelect(id) {
    const select = document.getElementById(id);
    select.innerHTML = '<option value="">Selecione</option>';
    select.disabled = true;
}

google.script.run
    .withSuccessHandler(dados => estruturaAlunos = dados)
    .buscarEstruturaAlunos();

document.getElementById("localidade").addEventListener("change", function () {
    const valor = this.value;
    resetSelect("escola"); resetSelect("ano"); resetSelect("turma"); resetSelect("aluno");
    if (!valor) return;
    const selectEscola = document.getElementById("escola");
    selectEscola.disabled = false;
    Object.keys(estruturaAlunos[valor] || {}).forEach(escola => {
        selectEscola.innerHTML += `<option value="${escola}">${escola}</option>`;
    });
});

document.getElementById("escola").addEventListener("change", function () {
    const localidade = document.getElementById("localidade").value;
    resetSelect("ano"); resetSelect("turma"); resetSelect("aluno");
    if (!this.value) return;
    const selectAno = document.getElementById("ano");
    selectAno.disabled = false;
    Object.keys(estruturaAlunos[localidade][this.value] || {}).forEach(ano => {
        selectAno.innerHTML += `<option value="${ano}">${ano}</option>`;
    });
});

document.getElementById("ano").addEventListener("change", function () {
    const localidade = document.getElementById("localidade").value;
    const escola = document.getElementById("escola").value;
    resetSelect("turma"); resetSelect("aluno");
    if (!this.value) return;
    const selectTurma = document.getElementById("turma");
    selectTurma.disabled = false;
    Object.keys(estruturaAlunos[localidade][escola][this.value] || {}).forEach(turma => {
        selectTurma.innerHTML += `<option value="${turma}">${turma}</option>`;
    });
});

document.getElementById("turma").addEventListener("change", function () {
    const localidade = document.getElementById("localidade").value;
    const escola = document.getElementById("escola").value;
    const ano = document.getElementById("ano").value;
    resetSelect("aluno");
    if (!this.value) return;
    const alunos = estruturaAlunos[localidade][escola][ano][this.value] || [];
    const selectAluno = document.getElementById("aluno");
    selectAluno.disabled = false;
    alunos.forEach(aluno => {
        selectAluno.innerHTML += `<option value="${aluno.id}">${aluno.nome}</option>`;
    });
});

document.getElementById("aluno").addEventListener("change", function () {
    alunoSelecionadoId = this.value;
    window.alunoSelecionadoId = this.value;
});

function selecionarTeste(testeId) {

    carregarTextoTeste(testeId);
    carregarPerguntasCompreensao(testeId);

}

document.getElementById("btnIniciarAvaliacao").onclick = function () {

    if (!alunoSelecionadoId) {
        mostrarToast("Selecione um aluno.", "aviso");
        return;
    }

    const testeSelecionadoId = document.getElementById("tipoTextoSelect").value;

    if (!testeSelecionadoId) {
        mostrarToast("Selecione o tipo de texto.", "aviso")
        return;
    }

    // Armazenamos globalmente
    window.alunoSelecionadoId = alunoSelecionadoId;
    window.testeSelecionadoId = testeSelecionadoId;

    mostrarLoading();

    setTimeout(() => {
        mostrarAvaliacao();
        carregarTextoTeste(testeSelecionadoId);
        carregarPerguntasCompreensao(testeSelecionadoId);
        esconderLoading();
    }, 100)

};

function mostrarLoading() {
    const overlay = document.getElementById("loading-overlay");
    overlay.classList.remove("hidden");
    overlay.dataset.startTime = Date.now();
}

function esconderLoading() {
    const overlay = document.getElementById("loading-overlay");
    const tempoMinimo = 400;

    const tempoDecorrido = Date.now() - overlay.dataset.startTime;
    const restante = tempoMinimo - tempoDecorrido;

    setTimeout(() => {
        overlay.classList.add("hidden");
    }, restante > 0 ? restante : 0);
}

function carregarTextoTeste(testeId) {
    google.script.run
        .withSuccessHandler(function (resposta) {

            if (!resposta || !resposta.texto) {
                document.getElementById("textoTeste").innerHTML = "<i>Texto não encontrado</i>";
                return;
            }

            renderizarTextoInterativo(resposta.texto);

        })
        .buscarTextoTeste(testeId);
}

function carregarPerguntasCompreensao(testeId) {

    google.script.run.withSuccessHandler(perguntas => {

        renderizarPerguntas(perguntas);

    }).buscarPerguntasCompreensao(testeId);
}

function renderizarPerguntas(perguntas) {

    const container = document.getElementById("blocoCompreensao");

    if (!container) {
        console.error("Container de perguntas não encontrado.");
        return;
    }

    container.innerHTML = "";

    perguntas.forEach((p, index) => {

        const linha = document.createElement("div");
        linha.className = "questao-linha";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "questao";
        checkbox.dataset.nivel = p.nivel;

        const label = document.createElement("label");
        label.innerText = `(${p.nivel}) ${p.pergunta}`;

        linha.appendChild(checkbox);
        linha.appendChild(label);

        container.appendChild(linha);

    });

}