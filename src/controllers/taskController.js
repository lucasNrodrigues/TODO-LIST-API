// Arquivo: src/controllers/taskController.js

const db = require('../database/db');

// --- CREATE: Criar uma nova tarefa dentro de uma lista ---
const createTask = async (req, res) => {
  const { title, description, due_date, priority, listId } = req.body;
  const userId = req.userId;

  if (!title || !listId) {
    return res.status(400).json({ error: 'O título e o ID da lista são obrigatórios.' });
  }

  try {
    // Medida de segurança: Verifica se a lista pertence ao usuário logado
    const listOwner = await db.query('SELECT user_id FROM task_lists WHERE id = $1', [listId]);
    if (listOwner.rowCount === 0 || listOwner.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Acesso negado. A lista não pertence a este usuário.' });
    }

    // Se a segurança passar, cria a tarefa
    const newTask = await db.query(
      'INSERT INTO tasks (task_list_id, title, description, due_date, priority) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [listId, title, description, due_date, priority || 'media']
    );
    res.status(201).json(newTask.rows[0]);
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// --- READ: Buscar todas as tarefas de uma lista específica ---
const getTasksInList = async (req, res) => {
  const { listId } = req.params;
  const userId = req.userId;

  try {
    // A mesma verificação de segurança da criação
    const listOwner = await db.query('SELECT user_id FROM task_lists WHERE id = $1', [listId]);
    if (listOwner.rowCount === 0 || listOwner.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    const tasks = await db.query('SELECT * FROM tasks WHERE task_list_id = $1 ORDER BY created_at ASC', [listId]);
    res.status(200).json(tasks.rows);
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// --- UPDATE: Atualizar uma tarefa ---
const updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { title, description, due_date, priority, status } = req.body;
  const userId = req.userId;

  try {
    // Segurança: Verifica se a tarefa que o usuário quer editar realmente pertence a ele.
    // Fazemos isso verificando o dono da lista à qual a tarefa pertence.
    const taskOwner = await db.query(
      'SELECT tl.user_id FROM tasks t JOIN task_lists tl ON t.task_list_id = tl.id WHERE t.id = $1',
      [taskId]
    );
    if (taskOwner.rowCount === 0 || taskOwner.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    // Pega os dados atuais da tarefa para não sobrescrever campos não enviados
    const currentTask = await db.query('SELECT * FROM tasks WHERE id = $1', [taskId]);

    // Atualiza os campos
    const updatedTask = await db.query(
      `UPDATE tasks SET 
        title = $1, 
        description = $2, 
        due_date = $3, 
        priority = $4, 
        status = $5 
       WHERE id = $6 RETURNING *`,
      [
        title || currentTask.rows[0].title,
        description || currentTask.rows[0].description,
        due_date || currentTask.rows[0].due_date,
        priority || currentTask.rows[0].priority,
        status || currentTask.rows[0].status,
        taskId
      ]
    );

    res.status(200).json(updatedTask.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// --- DELETE: Apagar uma tarefa ---
const deleteTask = async (req, res) => {
  const { taskId } = req.params;
  const userId = req.userId;

  try {
    // A mesma verificação de segurança do UPDATE
    const taskOwner = await db.query(
      'SELECT tl.user_id FROM tasks t JOIN task_lists tl ON t.task_list_id = tl.id WHERE t.id = $1',
      [taskId]
    );
    if (taskOwner.rowCount === 0 || taskOwner.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    await db.query('DELETE FROM tasks WHERE id = $1', [taskId]);
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar tarefa:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

module.exports = {
  createTask,
  getTasksInList,
  updateTask,
  deleteTask,
};
