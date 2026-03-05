// ui.js
const UI = {
    mostrarAvaliacao() {
        document.getElementById("telaSelecao").classList.add("hidden");
        document.getElementById("telaAvaliacao").classList.remove("hidden");
    },

    voltarParaSelecao() {
        document.getElementById("telaAvaliacao").classList.add("hidden");
        document.getElementById("telaSelecao").classList.remove("hidden");
    },

    mostrarLoading() {
        const overlay = document.getElementById("loading-overlay");
        overlay.classList.remove("hidden");
        overlay.dataset.startTime = Date.now();
    },

    esconderLoading() {
        const overlay = document.getElementById("loading-overlay");
        const tempoMinimo = 400;
        const tempoDecorrido = Date.now() - overlay.dataset.startTime;
        const restante = tempoMinimo - tempoDecorrido;

        setTimeout(() => overlay.classList.add("hidden"), restante > 0 ? restante : 0);
    },

    mostrarToast(mensagem, tipo = "info", duracao = 3000) {
        const toast = document.getElementById("toast");
        const icon = document.getElementById("toast-icon");
        const message = document.getElementById("toast-message");

        toast.className = `toast ${tipo}`;
        message.textContent = mensagem;

        const icones = { sucesso: "✔", erro: "✖", aviso: "⚠", info: "ℹ" };
        icon.textContent = icones[tipo] || "ℹ";

        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), duracao);
    }
};

export default UI;