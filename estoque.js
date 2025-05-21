let produtos = [];

function adicionarProduto() {
  const nome = document.getElementById("produto").value;
  const quantidade = document.getElementById("quantidade").value;
  const preco = document.getElementById("valor").value;

  if (!nome || !quantidade || !preco) {
    alert("Preencha todos os campos!");
    return;
  }

  // Atualiza a tabela na tela
  const tabela = document.getElementById("tabelaEstoque");
  const row = tabela.insertRow();
  row.innerHTML = `
    <td>${nome}</td>
    <td>${quantidade}</td>
    <td>R$ ${parseFloat(preco).toFixed(2)}</td>
    <td>R$ ${(quantidade * preco).toFixed(2)}</td>
    <td><button onclick="removerLinha(this)">Remover</button></td>
  `;

  // Atualiza o total
  atualizarTotal();

  // Envia para o backend (Servlet)
  fetch("/estoque", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `nome=${encodeURIComponent(nome)}&quantidade=${quantidade}&preco=${preco}`
  })
  .then(response => {
    if (response.ok) {
      console.log("Produto salvo no banco!");
    } else {
      console.error("Erro ao salvar no banco.");
    }
  })
  .catch(error => {
    console.error("Erro na requisição:", error);
  });

  // Limpa os campos
  document.getElementById("produto").value = "";
  document.getElementById("quantidade").value = "";
  document.getElementById("valor").value = "";
}

function removerLinha(botao) {
  const row = botao.parentNode.parentNode;
  row.remove();
  atualizarTotal();
}

function atualizarTotal() {
  let total = 0;
  const linhas = document.querySelectorAll("#tabelaEstoque tr");

  linhas.forEach(linha => {
    const valor = linha.cells[3];
    if (valor) {
      total += parseFloat(valor.innerText.replace("R$ ", "").replace(",", "."));
    }
  });

  document.getElementById("valorTotalEstoque").innerText = `Valor Total: R$ ${total.toFixed(2)}`;
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

