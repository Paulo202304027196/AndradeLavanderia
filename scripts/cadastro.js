const myApiUrl = 'http://localhost:8080'

//Realizar cadastro
document.getElementById('formCadastro').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Obtém os dados do formulário
    var formData = new FormData(event.target);

    // Cria um objeto com os dados do formulário
    const novoUsuario = {
        name: formData.get('nome'),
        email: formData.get('email'),
        password: formData.get('senha'),
        endereco: formData.get('endereco'),
        telefone: formData.get('telefone'),
        role: 'USER' // Adiciona automaticamente o papel de USER
    };

    // Adicione console.log para verificar os valores
    console.log('Dados do formulário:', novoUsuario);

    // Faz a solicitação fetch
    fetch(myApiUrl + '/auth/cadastrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(novoUsuario)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao cadastrar. Por favor, tente novamente.');
        }
        return response.text();
    })
    .then(data => {
        console.log('Resposta do servidor:', data);
        alert("Cadastro realizado com sucesso, faça o login para continuar.")
        window.location.href = 'login.html';
    })
    .catch(error => {
        console.error('Erro durante o cadastro:', error.message);
        alert("Erro durante o cadastro");
    });
});

