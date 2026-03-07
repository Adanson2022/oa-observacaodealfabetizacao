// AppState.js

const state = {

    alunos: [],
    testes: [],

    selecao: {
        localidade: null,
        escola: null,
        ano: null,
        turma: null,
        alunoId: null,
        tipoTextoId: null
    },

    avaliacaoAtual: null

};

export const AppState = {

    setAlunos(alunos) {
        state.alunos = alunos;
    },

    getAlunos() {
        return state.alunos;
    },

    setTestes(testes) {
        state.testes = testes;
    },

    getTestes() {
        return state.testes;
    },

    setSelecao(selecao) {
        state.selecao = { ...state.selecao, ...selecao };
    },

    getSelecao() {
        return state.selecao;
    },

    setAvaliacaoAtual(avaliacao) {
        state.avaliacaoAtual = avaliacao;
    },

    getAvaliacaoAtual() {
        return state.avaliacaoAtual;
    },

    limparAvaliacao() {
        state.avaliacaoAtual = null;
    }

};