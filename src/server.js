// Arquivo: src/server.js

const express = require('express');
require('dotenv').config();

// Importa as rotas
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const listRoutes = require('./routes/listRoutes');

const app = express();


// --- PRIMEIRO MIDDLEWARE DE DEPURAÇÃO ---
// Este middleware vai rodar ANTES de o Express tentar ler o corpo da requisição.
app.use((req, res, next) => {
  console.log(`--- [LOG 1: ANTES DO PARSE] Recebida requisição ${req.method} para a URL ${req.url}`);
  next(); // Passa para o próximo middleware
});


// Middleware essencial para que o Express consiga interpretar o corpo das requisições em formato JSON.
app.use(express.json());


// --- SEGUNDO MIDDLEWARE DE DEPURAÇÃO ---
// Este middleware vai rodar DEPOIS de o Express tentar ler o corpo.
app.use((req, res, next) => {
  console.log('--- [LOG 2: DEPOIS DO PARSE] O corpo da requisição (req.body) é:', req.body);
  next(); // Passa para as rotas
});


// Rota de "saúde" da API
app.get('/', (req, res) => {
  res.status(200).send('API de Tarefas - Projeto de Sistemas Distribuídos');
});

// Rotas públicas
app.use('/auth', authRoutes);

// Rotas privadas
app.use('/tasks', taskRoutes);
app.use('/lists', listRoutes);

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta http://localhost:${PORT}`);
});
