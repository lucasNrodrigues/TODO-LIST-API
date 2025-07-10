// Arquivo: src/routes/taskRoutes.js

const express = require('express');
const router = express.Router();

const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

// Protege todas as rotas de tarefas com autenticação
router.use(authMiddleware);

// --- Rotas CRUD para Tarefas ---

// Rota para CRIAR uma nova tarefa
// POST /tasks
router.post('/', taskController.createTask);

// Rota para LER todas as tarefas de uma lista específica
// GET /tasks/in-list/1 (onde 1 é o ID da lista)
router.get('/in-list/:listId', taskController.getTasksInList);

// Rota para ATUALIZAR uma tarefa específica
// PUT /tasks/1 (onde 1 é o ID da tarefa)
router.put('/:taskId', taskController.updateTask);

// Rota para DELETAR uma tarefa específica
// DELETE /tasks/1 (onde 1 é o ID da tarefa)
router.delete('/:taskId', taskController.deleteTask);

module.exports = router;
