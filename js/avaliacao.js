// avaliacao.js
export function inicializarAvaliacao({ AvaliacaoService, TesteService, mostrarToast, voltarParaSelecao }) {
    const telaAvaliacao = document.getElementById("telaAvaliacao");
    const reiniciarBtn = document.getElementById("reiniciarBtn");
    const enviarBtn = document.getElementById("enviarBtn");
    const voltarBtn = document.getElementById("voltarBtn");
    const textoTesteEl = document.getElementById("textoTeste");
    const tempoEl = document.getElementById("tempo");
    const statusEl = document.getElementById("statusAvaliacao");

    let tempoRestante = 60;
    let timerInterval;

    function iniciarAvaliacaoUI() {
        textoTesteEl.textContent = window.AVALIACAO_ATUAL.teste.texto;
        statusEl.textContent = "Status: ⏳ Avaliação iniciada";
        tempoRestante = 60;
        tempoEl.textContent = tempoRestante;

        timerInterval = setInterval(() => {
            tempoRestante--;
            tempoEl.textContent = tempoRestante;
            if (tempoRestante <= 0) {
                clearInterval(timerInterval);
                mostrarToast("Tempo esgotado", "aviso");
            }
        }, 1000);
    }

    reiniciarBtn.addEventListener("click", () => {
        clearInterval(timerInterval);
        iniciarAvaliacaoUI();
    });

    enviarBtn.addEventListener("click", async () => {
        clearInterval(timerInterval);
        const prosodia = document.querySelector('input[name="prosodiaNivel"]:checked');
        if (!prosodia) return mostrarToast("Selecione a prosódia", "aviso");

        const avaliacao = {
            alunoId: window.AVALIACAO_ATUAL.alunoId,
            testeId: window.AVALIACAO_ATUAL.teste.id,
            prosodia: prosodia.value,
            palavrasLidas: 0,
            palavrasErro: 0,
            velocidade: 0,
            precisao: 0,
            data: new Date().toISOString()
        };

        try {
            await AvaliacaoService.registrarAvaliacao(avaliacao);
            mostrarToast("Avaliação registrada com sucesso!", "sucesso");
            voltarParaSelecao();
        } catch (err) {
            console.error(err);
            mostrarToast("Erro ao registrar avaliação", "erro");
        }
    });

    voltarBtn.addEventListener("click", () => {
        clearInterval(timerInterval);
        voltarParaSelecao();
    });

    return { iniciarAvaliacaoUI };
}