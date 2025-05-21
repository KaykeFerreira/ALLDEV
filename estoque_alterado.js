let produtos = [];

function adicionarProduto() {
  const nome = document.getElementById("// estoque_alterado.js

// Importações necessárias para o SDK modular do Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyCJxWjqnfCvfWDmcfjYY7Ho69nUp79slBM",
    authDomain: "alldevestoque.firebaseapp.com",
    projectId: "alldevestoque",
    storageBucket: "alldevestoque.firebasestorage.app",
    messagingSenderId: "716462776590",
    appId: "1:716462776590:web:931c1b547797b36a3bb75f",
    measurementId: "G-40YJ5R47QZ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Função para adicionar um novo produto ao Firestore
async function adicionarProduto() {
    const nome = document.getElementById("produto").value.trim();
    const quantidade = parseInt(document.getElementById("quantidade").value);
    const valor = parseFloat(document.getElementById("valor").value);

    // Verificação reforçada para garantir que quantidade e valor são números válidos
    if (!nome || isNaN(quantidade) || isNaN(valor) || quantidade < 0 || valor < 0) { // Adicionado verificação de números negativos
        alert("Por favor, preencha todos os campos corretamente com valores válidos (números positivos para quantidade e valor).");
        return;
    }

    try {
        await addDoc(collection(db, "produtos"), {
            nome: nome,
            quantidade: quantidade,
            valor: valor
        });
        console.log("Produto salvo no Firestore!");
        await atualizarTabela();
        limparCampos();
    } catch (error) {
        console.error("Erro ao salvar no Firestore: ", error);
        alert("Erro ao adicionar produto: " + error.message);
    }
}

// Função para atualizar a tabela com os dados do Firestore
async function atualizarTabela() {
    const tabela = document.getElementById("tabelaEstoque");
    tabela.innerHTML = "";

    let totalEstoque = 0;

    try {
        const querySnapshot = await getDocs(collection(db, "produtos"));
        querySnapshot.forEach((documento) => {
            const produto = documento.data();
            const id = documento.id;

            // **VERIFICAÇÃO ADICIONAL AQUI:**
            // Garante que 'quantidade' e 'valor' são números antes de usá-los
            const quantidadeNumerica = typeof produto.quantidade === 'number' ? produto.quantidade : 0;
            const valorNumerico = typeof produto.valor === 'number' ? produto.valor : 0;

            // Se ainda assim o valor for NaN (ex: se o Firebase retornou algo que não é número nem string), force 0
            const finalQuantidade = isNaN(quantidadeNumerica) ? 0 : quantidadeNumerica;
            const finalValor = isNaN(valorNumerico) ? 0 : valorNumerico;

            const valorTotal = finalQuantidade * finalValor;
            totalEstoque += valorTotal;

            const row = tabela.insertRow();
            row.insertCell(0).innerText = produto.nome || "N/A"; // Exibe "N/A" se nome estiver faltando
            row.insertCell(1).innerText = finalQuantidade;
            row.insertCell(2).innerText = "R$ " + finalValor.toFixed(2);
            row.insertCell(3).innerText = "R$ " + valorTotal.toFixed(2);

            const cellRemover = row.insertCell(4);
            const btnRemover = document.createElement('button');
            btnRemover.innerText = '✖';
            btnRemover.style.cssText = 'background:none; border:none; color:red; cursor:pointer; font-size:18px;';
            btnRemover.onclick = () => removerProduto(id);
            cellRemover.appendChild(btnRemover);
        });

        document.getElementById("valorTotalEstoque").textContent =
            "Valor Total: R$ " + totalEstoque.toFixed(2);
    } catch (error) {
        console.error("Erro ao buscar produtos: ", error);
        alert("Erro ao carregar estoque: " + error.message);
    }
}

async function removerProduto(idDoDocumento) {
    try {
        await deleteDoc(doc(db, "produtos", idDoDocumento));
        console.log("Produto removido do Firestore!");
        atualizarTabela();
    } catch (error) {
        console.error("Erro ao remover produto: ", error);
        alert("Erro ao remover produto: " + error.message);
    }
}

function limparCampos() {
    document.getElementById("produto").value = "";
    document.getElementById("quantidade").value = "";
    document.getElementById("valor").value = "";
}

window.onload = () => {
    // Garante que o event listener seja aplicado após o DOM estar totalmente carregado
    const adicionarBtn = document.querySelector('button[onclick="adicionarProduto()"]');
    if (adicionarBtn) {
        adicionarBtn.onclick = adicionarProduto;
    }
    atualizarTabela();
};produto").value;
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

