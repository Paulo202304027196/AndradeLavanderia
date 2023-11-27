const myApiUrl = 'http://localhost:8080'

function preencherCardsComDados() {
    fetch(myApiUrl + '/produtos/all')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na requisição.');
            }
            return response.json();
        })
        .then(dadosDaAPI => {
            const cardsContainer = document.getElementById('cardsRow');
            console.log('Dados da API:', dadosDaAPI);

            if (dadosDaAPI && Array.isArray(dadosDaAPI) && dadosDaAPI.length > 0) {
                dadosDaAPI.forEach(item => {
                    const card = document.createElement('div');
                    card.className = 'col-lg-4 mb-4'; // Added mb-4 for margin between cards
                    card.innerHTML = `
                        <div class="card h-100"> <!-- Added h-100 for equal height -->
                            <img src="${item.imagemProduto}" class="card-img-top" alt="${item.nomeProduto}">
                            <div class="card-body">
                                <h5 class="card-title">${item.nomeProduto}</h5>
                                <p class="card-text">${item.descricao}</p>
                                <p class="card-text">R$ ${item.preco.toFixed(2)}</p>
                                <a href="javascript:void(0);" class="btn btn-primary" onclick="adicionarAoCarrinho('${item.idProduto}', '${item.nomeProduto}', '${item.preco}')">
                                    <i class="fa-solid fa-cart-shopping"></i> Adicionar ao Carrinho
                                </a>
                                </a>
                            </div>
                        </div>
                    `;
                    cardsContainer.appendChild(card);
                });
            } else {
                // Se a API estiver vazia, exibe mensagem de sem vendas
                const mensagemVazia = document.createElement('h4');
                mensagemVazia.textContent = "Desculpe, não estamos fazendo vendas hoje! Volte outro dia."
                cardsContainer.appendChild(mensagemVazia);
            }
        })
        .catch(error => {
            console.error(error);
            // Se houver erro na requisição, exibe mensagem de sem vendas
            const cardsContainer = document.getElementById('cardsRow');
            const mensagemVazia = document.createElement('h4');
            mensagemVazia.textContent = "Desculpe, não estamos fazendo vendas hoje! Volte outro dia."
            cardsContainer.appendChild(mensagemVazia);
        });
}

function adicionarAoCarrinho(id, nomeItem, preco) {
    var precoNumber = parseFloat(preco)
    var itemCarrinho = {
        idItem: id,
        nome: nomeItem,
        precoUnitario: precoNumber
    };

    var carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.push(itemCarrinho);
    console.log(carrinho);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    var servicosAdicionados = document.getElementById("servicos-adicionados");
    var listItem = document.createElement("li");
    listItem.textContent = nomeItem + " - R$" +  precoNumber.toFixed(2);
    servicosAdicionados.appendChild(listItem);
}

// Chamando a função quando a página é carregada
document.addEventListener('DOMContentLoaded', preencherCardsComDados);
