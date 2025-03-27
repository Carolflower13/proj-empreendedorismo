const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.json());

// API de atualização de produto
app.put("/api/produto/:id", async (req, res) => {
    try {
        const produto = await Produto.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (produto && produto.quantidade !== undefined && produto.quantidade < produto.estoqueMinimo) {
            // Enviar notificação para o WhatsApp (exemplo de função fictícia)
            enviarNotificacaoWhatsApp(produto);

            // Enviar notificação em tempo real via Socket.io
            io.emit("estoque-baixo", produto);  // Emitir evento para o cliente

            console.log("🔔 Notificação de estoque baixo enviada!");
        }

        res.json(produto);
    } catch (error) {
        console.error("Erro ao atualizar produto", error);
        res.status(400).json({ message: "Erro ao atualizar produto" });
    }
});

// Inicia o servidor Socket.io
const port = process.env.PORT || 3000;
http.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
