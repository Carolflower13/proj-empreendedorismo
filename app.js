const socket = io(); // Conecta ao servidor Socket.io

// Receber notificações de estoque baixo
socket.on("estoque-baixo", (produto) => {
    alert(`Alerta: O produto "${produto.nome}" está com o estoque baixo!`);
    atualizarGrafico(produto);
});

// Função para atualizar o gráfico
let quantidadeProdutos = [];
let nomesProdutos = [];
let chartInstance = null; // Instância do gráfico

const atualizarGrafico = (produto) => {
    if (!nomesProdutos.includes(produto.nome)) {
        nomesProdutos.push(produto.nome);
        quantidadeProdutos.push(produto.quantidade);
    } else {
        const index = nomesProdutos.indexOf(produto.nome);
        quantidadeProdutos[index] = produto.quantidade;
    }

    // Verifica se já existe uma instância do gráfico
    if (chartInstance) {
        chartInstance.destroy();  // Destroi o gráfico anterior
    }

    // Atualiza o gráfico com os novos dados
    chartInstance = new Chart(document.getElementById("grafico-estoque"), {
        type: "bar",
        data: {
            labels: nomesProdutos,
            datasets: [{
                label: "Quantidade no Estoque",
                data: quantidadeProdutos,
                backgroundColor: "#00aaff"
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
};

// Exemplo inicial de gráfico (sem dados)
atualizarGrafico({ nome: "Produto Exemplo", quantidade: 10 });
