function mostrarAvaliacao() {
document.getElementById("telaSelecao").classList.add("hidden");
document.getElementById("telaAvaliacao").classList.remove("hidden");

document.querySelectorAll('input.questao[type="checkbox"]').forEach(q => {
q.checked = false;
});
}

function voltarParaSelecao() {
document.getElementById("telaAvaliacao").classList.add("hidden");
document.getElementById("telaSelecao").classList.remove("hidden");
}

function mostrarLoading(){
const overlay=document.getElementById("loading-overlay");
overlay.classList.remove("hidden");
overlay.dataset.startTime=Date.now();
}

function esconderLoading(){

const overlay=document.getElementById("loading-overlay");
const tempoMinimo=400;

const tempoDecorrido=Date.now()-overlay.dataset.startTime;

const restante=tempoMinimo-tempoDecorrido;

setTimeout(()=>{
overlay.classList.add("hidden");
}, restante>0?restante:0);

}