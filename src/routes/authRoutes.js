// Arquivo: src/routes/authRoutes.js

const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Rota para registrar um novo usuário
router.post('/register', userController.register);

// --- NOVA ROTA DE LOGIN ---
// Define que uma requisição POST para /login será tratada pela função 'login'
router.post('/login', userController.login);

module.exports = router;
