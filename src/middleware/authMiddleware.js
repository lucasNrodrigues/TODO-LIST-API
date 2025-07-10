// Arquivo: src/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // 1. Pega o cabeçalho 'Authorization' da requisição
  const authHeader = req.headers['authorization'];

  // 2. Verifica se o cabeçalho existe
  if (!authHeader) {
    // Se não existir, o usuário não enviou o token. Acesso negado.
    return res.status(401).json({ error: 'Acesso negado. Nenhum token fornecido.' });
  }

  // 3. O cabeçalho vem no formato "Bearer <token>". Vamos separar o token.
  // O split(' ') divide a string em um array ["Bearer", "<token>"]
  const token = authHeader.split(' ')[1];

  if (!token) {
    // Se não houver nada depois de "Bearer", o formato está incorreto.
    return res.status(401).json({ error: 'Token mal formatado.' });
  }

  // 4. Verifica se o token é válido
  try {
    // jwt.verify tenta decodificar o token usando nosso segredo.
    // Se o token for inválido ou expirado, ele vai gerar um erro.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Se o token for válido, adicionamos o ID do usuário à requisição.
    // Assim, as próximas funções (os controllers) saberão qual usuário está logado.
    req.userId = decoded.userId;

    // 6. Chama a próxima função na cadeia (deixa a requisição continuar)
    next();

  } catch (error) {
    // Se jwt.verify falhar, o token é inválido.
    return res.status(401).json({ error: 'Token inválido.' });
  }
};

module.exports = authMiddleware;
