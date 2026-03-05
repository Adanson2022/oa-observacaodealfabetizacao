// app.js
import * as UI from "./ui.js";
import { criarAlunoService } from "./AlunoService.js";
import { criarAvaliacaoService } from "./AvaliacaoService.js";
import { TesteService } from "./TesteService.js";
import { inicializarSelecao } from "./selecao.js";
import { inicializarAvaliacao } from "./avaliacao.js";

document.addEventListener("DOMContentLoaded", () => {
    console.log("Sistema iniciado");

    const AlunoService = criarAlunoService();
    const AvaliacaoService = criarAvaliacaoService();

    const avaliacaoModule = inicializarAvaliacao({
        AvaliacaoService,
        TesteService,
        mostrarToast: UI.mostrarToast,
        voltarParaSelecao: UI.voltarParaSelecao
    });

    inicializarSelecao({
        AlunoService,
        TesteService,
        mostrarToast: UI.mostrarToast,
        mostrarAvaliacao: UI.mostrarAvaliacao,
        iniciarAvaliacaoUI: avaliacaoModule.iniciarAvaliacaoUI
    });
});