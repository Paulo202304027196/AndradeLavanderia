document.addEventListener("DOMContentLoaded", function () {
    const usuarioAutenticadoDiv = document.getElementById("usuario-autenticado");

    // Verifica se há um token no localStorage
    const token = localStorage.getItem("token");
    const nome = localStorage.getItem("name");
    const id= localStorage.getItem("id");

    console.log(token + " " + nome + " " + id);
    if (token) {
        // Se houver um token, monta o HTML para o usuário autenticado
        usuarioAutenticadoDiv.innerHTML = `
        <div id="usuario-autenticado" class="container mt-3 text-center">
        <h1>Bem-vindo, <strong id="nome-usuario">${nome}</strong>!</h1>
        <button id="botao-logout" class="btn btn-danger" onclick={logout()}>Logout</button>
        </div>      
        `;
    }
});

function logout() {
    // Limpa o localStorage
    localStorage.clear();
    
    // Redireciona para a página de login
    window.location.href = "login.html";
}
