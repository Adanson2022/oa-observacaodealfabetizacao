let palavrasErro = new Set();
let palavraParou = null;

function renderizarTextoInterativo(texto) {

    const container = document.getElementById("textoTeste");

    if (!container) {
        console.error("Container textoTeste não encontrado.");
        return;
    }

    container.innerHTML = "";

    const palavras = texto.split(" ");

    palavras.forEach((palavra, index) => {

        const box = document.createElement("div");
        box.className = "palavra-box";

        const numero = document.createElement("div");
        numero.className = "numero-palavra";
        numero.innerText = index + 1;

        const palavraDiv = document.createElement("div");
        palavraDiv.className = "palavra-texto";
        palavraDiv.innerText = palavra;

        const botoes = document.createElement("div");
        botoes.className = "botoes-palavra";

        const btnErro = document.createElement("button");
        btnErro.innerText = "Erro";
        btnErro.onclick = () => marcarErro(index + 1, box);

        const btnParou = document.createElement("button");
        btnParou.innerText = "Parou";
        btnParou.onclick = () => marcarParou(index + 1, box);

        botoes.appendChild(btnErro);
        botoes.appendChild(btnParou);

        box.appendChild(numero);
        box.appendChild(palavraDiv);
        box.appendChild(botoes);

        container.appendChild(box);

    });

    document.getElementById("totalPalavras").innerText = palavras.length;
}

function marcarErro(indice, box) {

    if (palavrasErro.has(indice)) {
        palavrasErro.delete(indice);
        box.classList.remove("erro");
    } else {
        palavrasErro.add(indice);
        box.classList.add("erro");
    }

    atualizarVisor();
}

function marcarParou(indice, box) {

    document.querySelectorAll(".palavra-box").forEach(b => {
        b.classList.remove("parou");
    });

    box.classList.add("parou");

    palavraParou = indice;

    document.getElementById("ultimaPalavraTexto").innerText = indice;

    atualizarVisor();
}

function atualizarVisor() {

    const totalPalavras = Number(document.getElementById("totalPalavras").innerText);

    const lidas = palavraParou || 0;
    const erros = palavrasErro.size;

    document.getElementById("palavrasLidas").innerText = lidas;
    document.getElementById("palavrasErro").innerText = erros;

    let velocidade = 0;
    let precisao = 0;

    if (totalPalavras > 0) {
        velocidade = (lidas / totalPalavras) * 100;
    }

    if (lidas > 0) {
        precisao = ((lidas - erros) / lidas) * 100;
    }

    document.getElementById("velocidadeCalc").innerText = velocidade.toFixed(1);
    document.getElementById("precisaoCalc").innerText = precisao.toFixed(1);

}

document.addEventListener("DOMContentLoaded", function () {
    let ultimaPalavraLida = 0;
    let tempoRestante = 60;
    let timer = null;
    let avaliacaoAtiva = false;
    let avaliacaoEncerrada = false;
    let dadosSelecaoAtual = {};

    document.getElementById("enviarBtn").addEventListener("click", enviarAvaliacao);

    function toggleLida(span) {

        if (!avaliacaoAtiva && !avaliacaoEncerrada) return;

        const indiceClicado = Number(span.dataset.index);
        const palavrasLidasAtuais = document.querySelectorAll(".palavra.lida").length;

        // Se tempo encerrado, não pode avançar além do que já estava lido
        //Atualiza leitura sequencial
        if (avaliacaoEncerrada && indiceClicado > palavrasLidasAtuais) {
            return;
        }

        const todasPalavras = document.querySelectorAll(".palavra");


        todasPalavras.forEach(p => {
            const idx = Number(p.dataset.index);

            if (idx <= indiceClicado) {
                p.classList.add("lida");
            } else {
                p.classList.remove("lida");
            }
        });

        // Atualiza palavra onde parou
        document.querySelectorAll(".palavra").forEach(p => {
            p.classList.remove("parou");
        });

        span.classList.add("parou");

        atualizarVisor();
    }

    function toggleErro(span) {

        if (!avaliacaoAtiva && !avaliacaoEncerrada) return;

        const idx = Number(span.dataset.index);

        // Após tempo só pode remover erro, não adicionar novo
        if (avaliacaoEncerrada && !palavrasErro.has(idx)) {
            return;
        }

        if (palavrasErro.has(idx)) {
            // Removendo erro
            palavrasErro.delete(idx);
            span.classList.remove("erro");
            span.classList.remove("erro-invalido"); // remove destaque vermelho imediatamente
        } else {
            palavrasErro.add(idx);
            span.classList.add("erro");
        }
        atualizarVisor();
    }

    function validarErrosDentroDaLeitura() {

        const palavrasMarcadas = document.querySelectorAll(".palavra.lida");
        const palavrasLidas = palavrasMarcadas.length;

        let possuiErroInvalido = false;

        // Remove marcação anterior
        document.querySelectorAll(".palavra").forEach(p => {
            p.classList.remove("erro-invalido");
        });

        for (let idx of palavrasErro) {
            if (idx > palavrasLidas) {
                possuiErroInvalido = true;

                const palavraInvalida = document.querySelector(`.palavra[data-index="${idx}"]`);
                if (palavraInvalida) {
                    palavraInvalida.classList.add("erro-invalido");
                }
            }
        }
        return !possuiErroInvalido;
    }

    function iniciarAvaliacao() {

        if (avaliacaoAtiva) return;

        avaliacaoAtiva = true;
        tempoRestante = 10;

        document.getElementById("tempo").textContent = tempoRestante;
        document.getElementById("statusAvaliacao").textContent = "Status: ▶ Avaliação em andamento";
        document.getElementById("statusAvaliacao").classList.remove("status-revisao");
        document.body.classList.remove("modo-revisao");

        // Bloqueia envio durante avaliação
        document.getElementById("enviarBtn").disabled = true;

        timer = setInterval(() => {

            tempoRestante--;
            document.getElementById("tempo").textContent = tempoRestante;

            if (tempoRestante <= 0) {
                clearInterval(timer);
                finalizarAvaliacao();
            }

        }, 1000);
    }

    function finalizarAvaliacao() {

        if (avaliacaoEncerrada) return;

        avaliacaoAtiva = false;
        avaliacaoEncerrada = true;

        document.getElementById("statusAvaliacao").textContent = "Status: 🟡 Modo Revisão";
        document.getElementById("statusAvaliacao").classList.add("status-revisao");

        document.body.classList.add("modo-revisao");

        // Desabilita botão iniciar
        const btn = document.getElementById("iniciarBtn");
        btn.disabled = true;
        btn.textContent = "Avaliação Finalizada";

        // Habilita botão enviar (agora pode enviar)
        const btnEnviar = document.getElementById("enviarBtn");
        btnEnviar.disabled = false;

        mostrarToast("Tempo encerrado! Avaliação finalizada.", "info");
    }

    const modal = document.getElementById("modalReiniciar");
    const btnReiniciar = document.getElementById("reiniciarBtn");
    const btnCancelar = document.getElementById("cancelarReinicio");
    const btnConfirmar = document.getElementById("confirmarReinicio");

    // Abrir modal
    btnReiniciar.onclick = function () {

        if (!avaliacaoAtiva && !avaliacaoEncerrada && ultimaPalavraLida === 0) {
            return mostrarToast("Nenhuma avaliação iniciada.", "aviso")
        }

        modal.classList.remove("hidden");
    };

    // Cancelar
    btnCancelar.onclick = function () {
        modal.classList.add("hidden");
    };

    //Confirmar reinício
    btnConfirmar.onclick = function () {

        if (timer) {
            clearInterval(timer);
        }

        resetarAvaliacao();
        modal.classList.add("hidden");
        mostrarToast("Avaliação reiniciado com sucesso.", "info");
    };

    // Fechar clicando fora da caixa
    modal.addEventListener("click", function (e) {
        if (e.target === modal) {
            modal.classList.add("hidden");
        }
    });

    document.getElementById("iniciarBtn").onclick = iniciarAvaliacao;

    atualizarVisor();

    function enviarAvaliacao() {

        const prosodiaSelecionada = document.querySelector('input[name="prosodiaNivel"]:checked');
        const prosodia = prosodiaSelecionada ? prosodiaSelecionada.value : null;

        const respostasCompreensao = [];

        document.querySelectorAll('input.questao[type="checkbox"]').forEach(q => {
            respostasCompreensao.push({
                nivel: q.dataset.nivel,
                acertou: q.checked
            });
        });

        if (!prosodia) {
            return mostrarToast("Selecione Prosódia", "aviso");
        }

        if (!palavraParou) {
            return mostrarToast("Marque onde o aluno parou.", "aviso");
        }

        const alunoId = window.alunoSelecionadoId;
        const id_teste = window.testeSelecionadoId;

        mostrarLoading();

        google.script.run.withSuccessHandler(resp => {

            esconderLoading();

            if (resp.sucesso) {

                mostrarToast("Avaliação enviada com sucesso!", "sucesso");

                resetarAvaliacao();
                voltarParaSelecao();

            } else {

                mostrarToast("Erro: " + resp.erro, "erro");

            }

        }).registrarAvaliacao({

            alunoId: alunoId,
            id_teste: id_teste,
            palavrasLidas: palavraParou,
            palavrasErro: palavrasErro.size,
            prosodia: prosodia,
            compreensao: respostasCompreensao,
            data: new Date().toISOString()

        });

    }

    document.querySelectorAll('input[name="prosodiaNivel"]').forEach(radio => {
        radio.addEventListener("change", () => {

            document.querySelectorAll(".prosodia-item").forEach(label => {
                label.classList.remove("selecionado");
            });

            radio.closest(".prosodia-item").classList.add("selecionado");

        })
    })

    // Remove borda vermelha da Prosódia ao selecionar
    document.querySelectorAll('input[name="prosodiaNivel"]').forEach(radio => {
        radio.addEventListener("change", () => {
            document.getElementById("prosodia").style.border = "none";
        });
    });

    //Remove borda vermelha da Compreensão ao alterar
    // fazer depois

    function resetarAvaliacao() {

        // Limpa marcações de leitura
        document.querySelectorAll(".palavra").forEach(p => {
            p.classList.remove("lida", "erro", "parou", "erro-invalido");
        });

        // Limpa erros
        palavrasErro.clear();

        // Reset estados
        ultimaPalavraLida = 0;
        tempoRestante = 60;
        avaliacaoAtiva = false;
        avaliacaoEncerrada = false;

        if (timer) {
            clearInterval(timer);
        }

        // Reset visor
        document.getElementById("tempo").textContent = 60;
        document.getElementById("statusAvaliacao").textContent = "Status: ⏳ Aguardando início";
        document.getElementById("statusAvaliacao").classList.remove("status-revisao");
        document.body.classList.remove("modo-revisao");

        document.getElementById("iniciarBtn").disabled = false;
        document.getElementById("iniciarBtn").textContent = "Iniciar Avaliação";

        document.getElementById("enviarBtn").disabled = false;

        document.getElementById("ultimaPalavraTexto").textContent = "-";

        atualizarVisor();

        // Limpa prosódia
        document.querySelectorAll('input[name="prosodiaNivel"]').forEach(r => {
            r.checked = false;
        });

        document.querySelectorAll(".prosodia-item").forEach(label => {
            label.classList.remove("selecionado");
        });

        // Limpa compreensão
        document.querySelectorAll('input.questao[type="checkbox"]').forEach(q => {
            q.checked = false;
        })

    }

    function mostrarToast(mensagem, tipo = "info", duracao = 3000) {
        const toast = document.getElementById("toast");
        const icon = document.getElementById("toast-icon");
        const message = document.getElementById("toast-message");

        toast.className = "toast"; // limpa classes antigas
        toast.classList.add(tipo);

        message.textContent = mensagem;

        const icones = {
            sucesso: "✔",
            erro: "✖",
            aviso: "⚠",
            info: "ℹ"
        };

        icon.textContent = icones[tipo] || "ℹ";

        toast.classList.add("show");

        setTimeout(() => {
            toast.classList.remove("show");
        }, duracao);
    }

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
});