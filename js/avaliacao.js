// avaliacao.js
import { AppState } from "./AppState.js";

export function inicializarAvaliacao({ AvaliacaoService, TesteService, mostrarToast, voltarParaSelecao }) {

    const reiniciarBtn = document.getElementById("reiniciarBtn");
    const enviarBtn = document.getElementById("enviarBtn");

    const voltarBtn = document.getElementById("voltarBtn");
    const iniciarBtn = document.getElementById("iniciarBtn");

    const textoTesteEl = document.getElementById("textoTeste");
    const tempoEl = document.getElementById("tempo");
    const statusEl = document.getElementById("statusAvaliacao");

    const totalPalavrasEl = document.getElementById("totalPalavras");
    const palavrasLidasEl = document.getElementById("palavrasLidas");
    const palavrasErroEl = document.getElementById("palavrasErro");
    const velocidadeEl = document.getElementById("velocidadeCalc");
    const precisaoEl = document.getElementById("precisaoCalc");
    const ultimaPalavraEl = document.getElementById("ultimaPalavraTexto");

    let perguntas = [];
    let testeAtual = null;

    let tempoRestante = 60;
    let timerInterval;

    let avaliacaoIniciada = false;

    let totalPalavras = 0;
    let palavraParou = null;
    let erros = new Set();


    function renderizarTexto(texto) {

        textoTesteEl.innerHTML = "";

        const palavras = texto.split(" ");

        totalPalavras = palavras.length;
        totalPalavrasEl.textContent = totalPalavras;

        palavras.forEach((palavra, index) => {

            const box = document.createElement("div");
            box.className = "palavra-box";

            const numero = document.createElement("div");
            numero.className = "numero-palavra";
            numero.textContent = index + 1;

            const textoPalavra = document.createElement("div");
            textoPalavra.className = "palavra-texto";
            textoPalavra.textContent = palavra;

            const botoes = document.createElement("div");
            botoes.className = "botoes-palavra";

            const btnErro = document.createElement("button");
            btnErro.textContent = "Erro";

            const btnParou = document.createElement("button");
            btnParou.textContent = "Parou";

            btnErro.addEventListener("click", () => {

                if (!avaliacaoIniciada) return;

                if (erros.has(index)) {
                    erros.delete(index);
                    box.classList.remove("erro");
                } else {
                    erros.add(index);
                    box.classList.add("erro");
                }

                atualizarVisor();
            });

            btnParou.addEventListener("click", () => {

                if (!avaliacaoIniciada) return;

                document.querySelectorAll(".palavra-box")
                    .forEach(b => b.classList.remove("parou"));

                box.classList.add("parou");

                palavraParou = index + 1;

                ultimaPalavraEl.textContent = palavraParou;

                atualizarVisor();
            });

            botoes.appendChild(btnErro);
            botoes.appendChild(btnParou);

            box.appendChild(numero);
            box.appendChild(textoPalavra);
            box.appendChild(botoes);

            textoTesteEl.appendChild(box);
        });
    }


    function renderizarQuestoes(perguntas) {

        const container = document.getElementById("container-compreensao");

        container.innerHTML = "";

        if (!perguntas || perguntas.length === 0) {

            container.innerHTML = "<p>Nenhuma pergunta cadastrada.</p>";
            return;
        }

        perguntas.forEach((q, index) => {

            const div = document.createElement("div");

            div.className = "questao";

            div.innerHTML = `
                <p><strong>${index + 1}. (${q.nivel})</strong> ${q.pergunta}</p>

                <label>
                    <input type="radio" name="q${index}" value="true">
                    Acertou
                </label>

                <label>
                    <input type="radio" name="q${index}" value="false">
                    Errou
                </label>
            `;

            container.appendChild(div);
        });
    }


    function coletarRespostasCompreensao(perguntas) {

        const respostas = [];

        perguntas.forEach((q, index) => {

            const selecionado = document.querySelector(`input[name="q${index}"]:checked`);

            respostas.push({
                nivel: q.nivel,
                acertou: selecionado ? selecionado.value === "true" : false
            });
        });

        return respostas;
    }


    function atualizarVisor() {

        const lidas = palavraParou || 0;
        const qtdErros = erros.size;

        palavrasLidasEl.textContent = lidas;
        palavrasErroEl.textContent = qtdErros;

        let velocidade = 0;
        let precisao = 0;

        if (totalPalavras > 0) {
            velocidade = (lidas / totalPalavras) * 100;
        }

        if (lidas > 0) {
            precisao = ((lidas - qtdErros) / lidas) * 100;
        }

        velocidadeEl.textContent = velocidade.toFixed(1);
        precisaoEl.textContent = precisao.toFixed(1);
    }


    async function iniciarAvaliacaoUI(aluno, teste) {

        if (!teste) {
            mostrarToast("Teste não encontrado", "erro");
            return;
        }

        testeAtual = teste;

        const testeId = teste.id || teste.Id_teste || teste.id_teste;

        console.log("Objeto teste:", testeAtual);

        perguntas = await TesteService.buscarPerguntasCompreensao(testeId);

        console.log("Perguntas recebidas:", perguntas);

        renderizarTexto(testeAtual.texto);
        renderizarQuestoes(perguntas);

        statusEl.textContent = "Status: ⏳ Avaliação iniciada";

        tempoRestante = 60;
        tempoEl.textContent = tempoRestante;

        avaliacaoIniciada = true;

        clearInterval(timerInterval);

        timerInterval = setInterval(() => {

            tempoRestante--;

            tempoEl.textContent = tempoRestante;

            if (tempoRestante <= 0) {

                clearInterval(timerInterval);

                avaliacaoIniciada = false;

                mostrarToast("Tempo esgotado", "aviso");
            }

        }, 1000);
    }


    function reiniciarAvaliacao() {

        clearInterval(timerInterval);

        avaliacaoIniciada = false;

        tempoRestante = 60;
        tempoEl.textContent = 60;

        palavraParou = null;

        erros.clear();

        document.querySelectorAll(".palavra-box").forEach(el => {
            el.classList.remove("erro");
            el.classList.remove("parou");
        });

        atualizarVisor();

        ultimaPalavraEl.textContent = "-";

        statusEl.textContent = "Status: ⏳ Aguardando início";
    }


    iniciarBtn.addEventListener("click", () => {

        const avaliacaoAtual = AppState.getAvaliacaoAtual();

        if (!avaliacaoAtual) {
            mostrarToast("Nenhuma avaliação selecionada", "aviso");
            return;
        }

        iniciarAvaliacaoUI(avaliacaoAtual.aluno, avaliacaoAtual.teste);
    });


    reiniciarBtn.addEventListener("click", reiniciarAvaliacao);

    enviarBtn.addEventListener("click", enviarAvaliacao);


    async function enviarAvaliacao() {

        console.log("Botão enviar clicado");

        if (!testeAtual) {
            mostrarToast("Teste não carregado", "erro");
            return;
        }

        if (palavraParou === null) {
            mostrarToast("Marque onde o aluno parou de ler", "aviso");
            return;
        }

        const prosodia = document.querySelector('input[name="prosodiaNivel"]:checked');

        if (!prosodia) {
            mostrarToast("Selecione a prosódia", "aviso");
            return;
        }

        const avaliacaoAtual = AppState.getAvaliacaoAtual();

        if (!avaliacaoAtual) {
            mostrarToast("Erro: aluno não encontrado", "erro");
            return;
        }

        clearInterval(timerInterval);
        avaliacaoIniciada = false;

        const respostasCompreensao = coletarRespostasCompreensao(perguntas);

        if (!avaliacaoAtual || !avaliacaoAtual.aluno) {
            console.error("Aluno não encontrado no AppState:", avaliacaoAtual);
            mostrarToast("Erro: aluno não selecionado", "erro");
            return;
        }

        console.log("Estado da avaliação:", avaliacaoAtual);
        console.log("Aluno:", avaliacaoAtual?.aluno);
        console.log("Teste:", testeAtual);
        
        const payload = {

            alunoId: avaliacaoAtual.aluno.id,
            testeId: testeAtual.id,

            prosodia: prosodia.value,

            palavrasLidas: palavraParou || 0,
            palavrasErro: erros.size,

            velocidade: Number(velocidadeEl.textContent),
            precisao: Number(precisaoEl.textContent),

            compreensao: respostasCompreensao,

            data: new Date().toISOString()
        };

        console.log("Payload enviado:", payload);

        try {

            await AvaliacaoService.registrarAvaliacao(payload);

            console.log("Avaliação enviada para API");

            mostrarToast("Avaliação registrada com sucesso!", "sucesso");

            voltarParaSelecao();

        } catch (err) {

            console.error("Erro ao registrar avaliação:", err);

            mostrarToast("Erro ao registrar avaliação", "erro");
        }
    }


    voltarBtn.addEventListener("click", () => {

        clearInterval(timerInterval);

        avaliacaoIniciada = false;

        AppState.limparAvaliacao();

        voltarParaSelecao();
    });


    return { iniciarAvaliacaoUI };
}