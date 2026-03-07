import { inicializarSelecao } from "./selecao.js";
import { inicializarAvaliacao } from "./avaliacao.js";

export function inicializarController(deps){

    if(!deps?.TesteService || !deps?.AvaliacaoService){
        console.error("Dependências não fornecidas corretamente");
        return;
    }

    const avaliacaoUI = inicializarAvaliacao(deps);

    inicializarSelecao({
        ...deps,
        iniciarAvaliacaoUI: avaliacaoUI.iniciarAvaliacaoUI
    });

}