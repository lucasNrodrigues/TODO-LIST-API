// Arquivo: src/server.js

const express = require('express');
require('dotenv').config();

// Importa as rotas
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const listRoutes = require('./routes/listRoutes');

const app = express();

// --- CORREÇÃO AQUI ---
// Middleware essencial para que o Express consiga interpretar o corpo das requisições em formato JSON.
// IMPORTANTE: Esta linha DEVE vir ANTES da definição das rotas (app.use('/auth', ...)).
app.use(express.json());


// Rota de "saúde" da API, para verificar se está online
app.get('/', (req, res) => {
  res.status(200).send('API de Tarefas - Projeto de Sistemas Distribuídos');
});

// Rotas públicas (não precisam de token)
app.use('/auth', authRoutes);

// Rotas privadas (protegidas por middleware)
app.use('/tasks', taskRoutes);
app.use('/lists', listRoutes);

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta http://localhost:${PORT}`);
});
