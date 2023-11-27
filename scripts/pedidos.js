const baseUrl = 'http://localhost:8080/pedidos';

document.addEventListener('DOMContentLoaded', function () {
    // Fazendo fetch dos dados da API para um cliente específico
    const idCliente = localStorage.getItem('id');
    fetch(baseUrl + `/porCliente/${idCliente}`)
        .then(response => response.json())
        .then(data => {
            const pedidosContainer = document.getElementById('pedidosContainer');

            // Organizando os pedidos por data da mais recente para a mais antiga
            const pedidosPorData = {};
            data.forEach(pedidoDTO => {
                const dataFormatada = new Date(pedidoDTO.pedido.dataPedido);
                if (!pedidosPorData[dataFormatada]) {
                    pedidosPorData[dataFormatada] = [];
                }
                pedidosPorData[dataFormatada].push(pedidoDTO);
            });

            // Ordenando as datas da mais recente para a mais antiga
            const datasOrdenadas = Object.keys(pedidosPorData).sort((a, b) => new Date(b) - new Date(a));

            // Iterando sobre as datas ordenadas
            datasOrdenadas.forEach((data, index) => {
                const pedidos = pedidosPorData[data];
                console.log(pedidosPorData)

                // Ordenando os pedidos pelo ID do maior para o menor
                const pedidosOrdenados = pedidos.sort((a, b) => b.idPedido - a.idPedido);

                // Criando divisão por data
                const divisaoHTML = `
                    <div class="mt-3">
                        <h3>${new Date(pedidos[0].pedido.dataPedido).toLocaleDateString()}</h3>
                        <div class="card-deck">
                            ${pedidosOrdenados.map(pedidoDTO => `
                                <div class="card mb-3">
                                    <div class="card-body">
                                        <h5 class="card-title">Pedido ${pedidoDTO.pedido.idPedido}</h5>
                                        <p class="card-text">Status do Pedido: ${pedidoDTO.pedido.statusPedido}</p>
                                        <button class="btn btn-primary" onclick="mostrarDetalhesPedido(${pedidoDTO.pedido.idPedido})">Detalhes</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
                pedidosContainer.innerHTML += divisaoHTML;
            });
        })
        .catch(error => console.error('Erro ao buscar dados:', error));
});

function mostrarDetalhesPedido(idPedido) {
    // Fazer fetch dos detalhes do pedido pelo ID
    fetch(baseUrl + `/detalhes/${idPedido}`)
        .then(response => response.json())
        .then(data => {
            // Criar o HTML com os detalhes do pedido
            const detalhesHTML = `
                <h4>Detalhes do Pedido ${data.pedido.idPedido}</h4>
                <ul>
                    <li><strong>Data do Pedido:</strong> ${new Date(data.pedido.dataPedido).toLocaleDateString()}</li>
                    <li><strong>Status do Pedido:</strong>${data.pedido.statusPedido}</li>
                    <li><strong>Total do Pedido:</strong> ${data.pedido.totalPedido.toFixed(2)}</li>
                </ul>

                <h4>Itens do Pedido</h4>
                <div class="list-group">
                    ${data.itensPedido.map(item => `
                        <div class="list-group-item">
                            <h5 class="mb-1"><strong> ${item.produtos.nomeProduto}</strong></h5>
                            <p class="mb-1"><strong>Descrição:</strong> ${item.produtos.descricao}</p>
                            <p class="mb-1"><strong>Preço Unitário:</strong> R$ ${item.precoUnitario.toFixed(2)}</p>
                        </div>
                    `).join('')}
                </div>
            `;

            detalhesPedidoModalBody.innerHTML = detalhesHTML;

            // Mostrar o modal
            $('#detalhesPedidoModal').modal('show');
        })
        .catch(error => console.error('Erro ao buscar detalhes do pedido:', error));
}
