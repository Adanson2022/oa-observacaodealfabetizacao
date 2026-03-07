export const Router = {

    mostrarTela(idTela) {

        const telas = document.querySelectorAll(".tela");

        telas.forEach(t => t.style.display = "none");

        const tela = document.getElementById(idTela);

        if (tela) tela.style.display = "block";

    }

};