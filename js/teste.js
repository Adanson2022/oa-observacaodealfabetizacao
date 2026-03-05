// teste.js
// Testes de integração real com a API
(async function() {
  try {
    // Testa a lista de alunos
    const alunos = await window.buscarAlunos?.();
    if (!alunos || !alunos.length) throw new Error("Função buscarAlunos não encontrada ou retornou vazio");
    console.log("Alunos reais:", alunos);

    // Testa a lista de testes
    const testes = await window.buscarTestes?.();
    if (!testes || !testes.length) throw new Error("Função buscarTestes não encontrada ou retornou vazio");
    console.log("Testes reais:", testes);

    // Testa buscar um teste por ID (substitua pelo ID real)
    const primeiroTesteId = testes[0]?.id;
    if (primeiroTesteId) {
      const testeDetalhes = await window.buscarTestePorId?.(primeiroTesteId);
      if (!testeDetalhes) throw new Error("Função buscarTestePorId retornou vazio");
      console.log("Detalhes do teste:", testeDetalhes);
    } else {
      console.warn("Nenhum teste encontrado para buscar por ID");
    }

  } catch (erro) {
    console.error("Erro na integração real:", erro);
  }
})();