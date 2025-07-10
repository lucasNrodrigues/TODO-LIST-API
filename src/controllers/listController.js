// Arquivo: src/controllers/listController.js

const db = require('../database/db');

// --- CREATE: Criar uma nova lista de tarefas ---
const createList = async (req, res) => {
  const { title } = req.body;
  const userId = req.userId; // Vem do nosso middleware de autenticação

  if (!title) {
    return res.status(400).json({ error: 'O título é obrigatório.' });
  }

  try {
    const newList = await db.query(
      'INSERT INTO task_lists (user_id, title) VALUES ($1, $2) RETURNING *',
      [userId, title]
    );
    res.status(201).json(newList.rows[0]);
  } catch (error) {
    console.error('Erro ao criar lista:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// --- READ: Buscar todas as listas do usuário ---
const getMyLists = async (req, res) => {
  const userId = req.userId;

  try {
    const lists = await db.query('SELECT * FROM task_lists WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    res.status(200).json(lists.rows);
  } catch (error) {
    console.error('Erro ao buscar listas:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// --- UPDATE: Atualizar o título de uma lista ---
const updateList = async (req, res) => {
  const { listId } = req.params; // Pega o ID da lista da URL
  const { title } = req.body;
  const userId = req.userId;

  if (!title) {
    return res.status(400).json({ error: 'O título é obrigatório.' });
  }

  try {
    const updatedList = await db.query(
      // A condição "AND user_id = $3" é a segurança! Garante que um usuário só pode editar suas próprias listas.
      'UPDATE task_lists SET title = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [title, listId, userId]
    );

    if (updatedList.rowCount === 0) {
      // Se rowCount é 0, a lista não foi encontrada ou não pertence ao usuário.
      return res.status(404).json({ error: 'Lista não encontrada.' });
    }

    res.status(200).json(updatedList.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar lista:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// --- DELETE: Apagar uma lista ---
const deleteList = async (req, res) => {
  const { listId } = req.params;
  const userId = req.userId;

  try {
    const result = await db.query(
      // A mesma segurança do UPDATE se aplica aqui.
      'DELETE FROM task_lists WHERE id = $1 AND user_id = $2',
      [listId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Lista não encontrada.' });
    }

    // 204 No Content é a resposta padrão para um DELETE bem-sucedido.
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar lista:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};


module.exports = {
  createList,
  getMyLists,
  updateList,
  deleteList,
};
