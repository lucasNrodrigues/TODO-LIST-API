// Arquivo: src/controllers/userController.js

const db = require('../database/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- FUNÇÃO DE REGISTRO (COMPLETA) ---
const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
  }
  try {
    const existingUser = await db.query('SELECT email FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Este email já está em uso.' });
    }
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = await db.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, passwordHash]
    );
    return res.status(201).json(newUser.rows[0]);
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
  }
};


// --- FUNÇÃO DE LOGIN (COMPLETA COM DEBUG) ---
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  try {
    const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    
    // --- DEBUG LOG 1 ---
    console.log('--- INICIANDO TENTATIVA DE LOGIN ---');
    console.log('Resultado da busca no BD:', userResult.rows);

    if (userResult.rows.length === 0) {
      console.log('DEBUG: Usuário não encontrado no banco de dados.');
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }
    
    const user = userResult.rows[0];

    // --- DEBUG LOG 2 ---
    console.log('Usuário encontrado:', user.email);
    console.log('Senha recebida na requisição:', password);
    console.log('Hash salvo no banco:', user.password_hash);

    // Compara a senha enviada com o hash salvo no banco
    const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);

    // --- DEBUG LOG 3 ---
    console.log('Resultado da comparação (bcrypt.compare):', isPasswordCorrect);

    if (!isPasswordCorrect) {
      console.log('DEBUG: As senhas não bateram.');
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    console.log('DEBUG: Senhas bateram! Gerando token...');
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return res.status(200).json({
      message: 'Login bem-sucedido!',
      token: token,
    });

  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
  }
};


// --- EXPORTAÇÃO CORRETA NO FINAL DO ARQUIVO ---
module.exports = {
  register,
  login,
};
