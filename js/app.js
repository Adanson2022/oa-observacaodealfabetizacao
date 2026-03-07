// app.js

import { criarAlunosService } from "./AlunosService.js";
import { criarTesteService } from "./TesteService.js";
import { criarAvaliacaoService } from "./AvaliacaoService.js";
import { inicializarController } from "./Controller.js";
import { Router } from "./Router.js";

const AlunosService = criarAlunosService();
const TesteService = criarTesteService();
const AvaliacaoService = criarAvaliacaoService();

function mostrarToast(msg, tipo = "info") {

    const toast = document.getElementById("toast");
    const toastMsg = document.getElementById("toast-message");

    toastMsg.textContent = msg;

    toast.className = `toast ${tipo}`;
    toast.classList.remove("hidden");

    setTimeout(() => {
        toast.classList.add("hidden");
    }, 3000);

}

function voltarParaSelecao(){
    Router.mostrarTela("tela-selecao");
}

document.addEventListener("DOMContentLoaded", async function () {
  
    inicializarController({
        AlunosService,
        AvaliacaoService,
        TesteService,
        mostrarToast,
        voltarParaSelecao
    });
    
  console.log("Sistema iniciado");

  Router.mostrarTela("tela-selecao");

});

if ("serviceWorker" in navigator) {

  navigator.serviceWorker.register("service-worker.js")
  .then(() => {
    console.log("Service Worker registrado");
  });

}