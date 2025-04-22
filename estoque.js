let produtos = [];

function adicionarProduto() {
  const nome = document.getElementById("produto").value.trim();
  const quantidade = parseInt(document.getElementById("quantidade").value);
  const valor = parseFloat(document.getElementById("valor").value);

  if (!nome || isNaN(quantidade) || isNaN(valor)) return;

  produtos.push({ nome, quantidade, valor });
  atualizarTabela();
  limparCampos();
}

function atualizarTabela() {
  const tabela = document.getElementById("tabelaEstoque");
  tabela.innerHTML = "";

  let totalEstoque = 0;

  produtos.forEach((produto, index) => {
    const valorTotal = produto.quantidade * produto.valor;
    totalEstoque += valorTotal;

    const row = `
      <tr>
        <td>${produto.nome}</td>
        <td>${produto.quantidade}</td>
        <td>R$ ${produto.valor.toFixed(2)}</td>
        <td>R$ ${valorTotal.toFixed(2)}</td>
        <td><button onclick="removerProduto(${index})" style="background:none; border:none; color:red; cursor:pointer;">✖</button></td>
      </tr>
    `;
    tabela.innerHTML += row;
  });

  document.getElementById("valorTotalEstoque").textContent =
    "Valor Total: R$ " + totalEstoque.toFixed(2);
}

function removerProduto(index) {
  produtos.splice(index, 1);
  atualizarTabela();
}

function limparCampos() {
  document.getElementById("produto").value = "";
  document.getElementById("quantidade").value = "";
  document.getElementById("valor").value = "";
}
