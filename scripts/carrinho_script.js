var baseUrl = 'http://localhost:8080/'; 
// Recupere os itens do carrinho do localStorage
var carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
console.log(carrinho)

// Seletor para a tabela de itens do carrinho
var carrinhoTbody = document.querySelector("tbody");
var totalPedidoElement = document.getElementById("total-pedido");
var totalPedido = 0;

carrinho.forEach(function (item, index){
    var newRow = carrinhoTbody.insertRow();
    var produtoCell = newRow.insertCell(0);
    var precoCell = newRow.insertCell(1);
    var excluirCell = newRow.insertCell(2);

    produtoCell.innerHTML = item.nome;
    precoCell.innerHTML = "R$" + item.precoUnitario.toFixed(2);

    // Botão de excluir
    var excluirButton = document.createElement("button");
    excluirButton.textContent = "Excluir";
    excluirButton.className = "btn btn-danger";
    excluirButton.addEventListener("click", function () {
        // Chamada da função para excluir o item do carrinho
        excluirItemDoCarrinho(index);
    });

    excluirCell.appendChild(excluirButton);

    totalPedido += item.precoUnitario;
})
// Atualize o total do pedido
totalPedidoElement.textContent = "Total do Pedido: R$ " + totalPedido.toFixed(2);

//Funçao para fazer a compra
async function enviarPedido(){
    try{
        var carrinho = JSON.parse(localStorage.getItem('carrinho'));
        
        var dataAtual = new Date().toISOString();
        var totalPedidoFinal = totalPedido.toFixed(2);
        var idCliente = localStorage.getItem('id');
        
        var pedido = {
            dataPedido: dataAtual,
            idUsuario: idCliente,
            statusPedido: "PENDENTE",
            totalPedido: totalPedidoFinal
        }

        var itensPedido = carrinho.map(function (itemCarrinho, index) {
            return {
                idItem: itemCarrinho.idItem,
                precoUnitario: itemCarrinho.precoUnitario || 0,
                produtos: itemCarrinho.idItem || 0
            };
        });

        var dadosPedidos = {
            pedido: pedido,
            itensPedido: itensPedido
        };

        var urlPedido = baseUrl + 'pedidos/checkout';

        var requestOptionsPedido = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json' // Adicione os headers necessários
            },
            body: JSON.stringify(dadosPedidos)
          };

        const response = await fetch(urlPedido, requestOptionsPedido);
        const data = await response.json();

        if (!response.ok) {
        throw new Error('Erro ao cadastrar o pedido: ' + (data.error || response.statusText));
        }

        console.log('Pedido cadastrado com sucesso:', data);
        alert('Pedido registrado com sucesso.');
    
        // Limpar o carrinho após o sucesso do pedido
        limparCarrinho();
    } catch (error) {
        console.error(error);
        alert('Erro ao registrar o pedido, tente novamente.');
  }
}

// Função para excluir um item do carrinho
function excluirItemDoCarrinho(index) {
    carrinho.splice(index, 1); // Remove o item do carrinho
    localStorage.setItem('carrinho', JSON.stringify(carrinho)); // Atualiza o carrinho no localStorage
    location.reload(); // Recarrega a página para atualizar a tabela
}

//Limpar o carrinho por completo
function limparCarrinho() {
    // Limpar o carrinho no localStorage
    localStorage.removeItem('carrinho');
    // Recarregar a página para atualizar a tabela ou realizar outras ações necessárias
    location.reload();
}

// Seletor para o botão "Confirmar Pedido"
var btnEnviarPedido = document.getElementById("btnEnviarPedido");

// Adicione um evento de clique ao botão
btnEnviarPedido.addEventListener("click", function(event) {
    // Evite o comportamento padrão do botão (enviar formulário, no caso de um botão dentro de um formulário)
    event.preventDefault();

    // Recupere os itens do carrinho do localStorage
    var carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    // Verifique se o carrinho não está vazio
    if (!carrinho || carrinho.length === 0) {
        alert("Seu carrinho está vazio. Adicione itens antes de confirmar o pedido.");
    } else {
        enviarPedido();
    }
});
  