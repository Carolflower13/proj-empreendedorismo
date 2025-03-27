let chartInstance = null; // Instância do gráfico
let quantidadeProdutos = [];
let nomesProdutos = [];

const atualizarGrafico = (produto) => {
    // Adiciona ou atualiza os dados do gráfico
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

    // Cria uma nova instância do gráfico
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
                    beginAtZero: true,
                    ticks: {
                        stepSize: 5 // Ajuste a escala conforme a quantidade de produtos
                    }
                }
            }
        }
    });
};

// Exemplo inicial de gráfico (sem dados)
atualizarGrafico({ nome: "Produto Exemplo", quantidade: 10 });

// Função para atualizar o gráfico quando um produto for atualizado
const socket = io(); // Conectar ao servidor Socket.io

socket.on("estoque-baixo", (produto) => {
    alert(`Alerta: O produto "${produto.nome}" está com o estoque baixo!`);
    atualizarGrafico(produto);
});
