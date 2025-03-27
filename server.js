const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware para fazer o parsing do corpo da requisição em formato JSON
app.use(express.json());

// Servir arquivos estáticos (como HTML, CSS, JS)
app.use(express.static('public')); 

// API de atualização de produto (simulação de um banco de dados)
let produtos = [
    { id: 1, nome: "Produto 1", quantidade: 10, estoqueMinimo: 5 },
    { id: 2, nome: "Produto 2", quantidade: 20, estoqueMinimo: 5 }
];

// Rota para atualizar o estoque de um produto
app.put("/api/produto/:id", (req, res) => {
    const produto = produtos.find(p => p.id === parseInt(req.params.id));
    if (!produto) return res.status(404).send("Produto não encontrado.");

    produto.quantidade = req.body.quantidade;  // Atualiza a quantidade do produto

    if (produto.quantidade < produto.estoqueMinimo) {
        // Emite evento para o frontend quando o estoque estiver baixo
        io.emit("estoque-baixo", produto);  // Emitir evento de estoque baixo
    }

    res.json(produto);
});

// Inicia o servidor na porta 3000
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
