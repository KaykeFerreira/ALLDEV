// Firebase config e inicialização (pode estar no HTML, como você fez)
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-cadastro');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log("Formulário enviado");

    // Captura dos campos
    const nome = document.getElementById('nome').value.trim();
    const sobrenome = document.getElementById('sobrenome').value.trim();
    const cpf = document.getElementById('cpf').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('password-field').value;

    // Validação básica
    if (!nome || !sobrenome || !cpf || !telefone || !email || !senha) {
      alert("Preencha todos os campos corretamente.");
      return;
    }

    try {
      // Cria usuário no Firebase Authentication
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, senha);
      const user = userCredential.user;

      // Salva os dados no Firestore
      await db.collection("usuarios").doc(user.uid).set({
        nome,
        sobrenome,
        cpf,
        telefone,
        email,
        uid: user.uid,
        criadoEm: firebase.firestore.FieldValue.serverTimestamp()
      });

      alert("Cadastro realizado com sucesso!");
      form.reset();
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      let mensagemErro = "Erro ao cadastrar usuário.";

      if (error.code === 'auth/email-already-in-use') {
        mensagemErro = "Este e-mail já está em uso.";
      } else if (error.code === 'auth/weak-password') {
        mensagemErro = "A senha deve ter pelo menos 6 caracteres.";
      } else if (error.code === 'auth/invalid-email') {
        mensagemErro = "E-mail inválido.";
      }

      alert(mensagemErro);
    }
  });
});
