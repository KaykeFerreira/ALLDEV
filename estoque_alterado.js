// estoque_alterado.js

// Importações necessárias para o SDK modular do Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCJxWjqnfCvfWDmcfjYY7Ho69nUp79slBM",
    authDomain: "alldevestoque.firebaseapp.com",
    projectId: "alldevestoque",
    storageBucket: "alldevestoque.firebasestorage.app",
    messagingSenderId: "716462776590",
    appId: "1:716462776590:web:931c1b547797b36a3bb75f",
    measurementId: "G-40YJ5R47QZ"
};

// Inicializa o app e o Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Adiciona um novo produto ao Firestore
async function adicionarProduto() {
    const nome = document.getElementById("produto").value.trim();
    const quantidade = parseInt(document.getElementById("quantidade").value);
    const valor = parseFloat(document.getElementById("valor").value);

    // Validação dos dados
    if (!nome || isNaN(quantidade) || isNaN(valor) || quantidade < 0 || valor < 0) {
        alert("Por favor, preencha todos os campos corretamente com valores válidos.");
        return;
    }

    try {
        // Insere o documento no Firebase
        await addDoc(collection(db, "produtos"), {
            nome: nome,
            quantidade: quantidade,
            valor: valor
        });

        console.log("Produto salvo no Firestore!");
        await atualizarTabela(); // Atualiza a tabela na interface
        limparCampos(); // Limpa os campos do formulário
    } catch (error) {
        console.error("Erro ao salvar no Firestore: ", error);
        alert("Erro ao adicionar produto: " + error.message);
    }

    /* 
    // Comentário relacionado ao uso com backend Java (Servlet):
    // Se você for usar um Servlet no backend Java, você pode enviar os dados assim:
    fetch("/estoque", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `nome=${encodeURIComponent(nome)}&quantidade=${quantidade}&preco=${valor}`
    })
    .then(response => {
        if (response.ok) {
            console.log("Produto salvo no backend Java!");
        } else {
            console.error("Erro ao salvar no backend.");
        }
    })
    .catch(error => {
        console.error("Erro na requisição:", error);
    });
    */
}

// Atualiza a tabela com dados do Firestore
async function atualizarTabela() {
    const tabela = document.getElementById("tabelaEstoque");
    tabela.innerHTML = ""; // Limpa a tabela

    let totalEstoque = 0;

    try {
        const querySnapshot = await getDocs(collection(db, "produtos"));
        querySnapshot.forEach((documento) => {
            const produto = documento.data();
            const id = documento.id;

            const quantidade = typeof produto.quantidade === 'number' ? produto.quantidade : 0;
            const valor = typeof produto.valor === 'number' ? produto.valor : 0;

            const finalQuantidade = isNaN(quantidade) ? 0 : quantidade;
            const finalValor = isNaN(valor) ? 0 : valor;

            const valorTotal = finalQuantidade * finalValor;
            totalEstoque += valorTotal;

            const row = tabela.insertRow();
            row.insertCell(0).innerText = produto.nome || "N/A";
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

// Remove um produto do Firestore
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

// Limpa os campos do formulário
function limparCampos() {
    document.getElementById("produto").value = "";
    document.getElementById("quantidade").value = "";
    document.getElementById("valor").value = "";
}

// Ao carregar a página, aplica evento ao botão e atualiza a tabela
window.onload = () => {
    const adicionarBtn = document.getElementById("adicionarBtn");
    if (adicionarBtn) {
        adicionarBtn.onclick = adicionarProduto;
    }
    atualizarTabela();
};
