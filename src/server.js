// Arquivo: src/server.js

const express = require('express');
require('dotenv').config();

// Importa as rotas
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const listRoutes = require('./routes/listRoutes'); // <-- Importa as novas rotas

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('API de Tarefas - Projeto de Sistemas Distribuídos');
});

// Rotas públicas
app.use('/auth', authRoutes);

// Rotas privadas (protegidas por middleware)
app.use('/tasks', taskRoutes);
app.use('/lists', listRoutes); // <-- Usa as novas rotas com o prefixo /lists

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta http://localhost:${PORT}`);
});
