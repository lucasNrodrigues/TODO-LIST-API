// Arquivo: src/routes/listRoutes.js

const express = require('express');
const router = express.Router();

const listController = require('../controllers/listController');
const authMiddleware = require('../middleware/authMiddleware');

// Aplica o middleware de autenticação a TODAS as rotas deste arquivo.
// Ninguém acessa as rotas de lista sem um token válido.
router.use(authMiddleware);

// --- Rotas CRUD para Listas ---

// Rota para CRIAR uma nova lista
// POST /lists
router.post('/', listController.createList);

// Rota para LER todas as listas do usuário
// GET /lists
router.get('/', listController.getMyLists);

// Rota para ATUALIZAR uma lista específica
// PUT /lists/123 (onde 123 é o ID da lista)
router.put('/:listId', listController.updateList);

// Rota para DELETAR uma lista específica
// DELETE /lists/123
router.delete('/:listId', listController.deleteList);

module.exports = router;
