const express = require('express');
const app = express();
const port = 3000;

// Данные из 2-й практики
let users = [
  {id: 1, name: 'Петр', age: 16},
  {id: 2, name: 'Иван', age: 18},
  {id: 3, name: 'Дарья', age: 20},
];

// Middleware для парсинга JSON
app.use(express.json());

// Главная страница
app.get('/', (req, res) => {
  res.send('Главная страница');
});

// GET /users - список пользователей
app.get('/users', (req, res) => {
  res.json(users);
});

// GET /users/:id - пользователь по ID
app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id == req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }
  res.json(user);
});

// POST /users - создать пользователя
app.post('/users', (req, res) => {
  const { name, age } = req.body;
  
  if (!name || !age) {
    return res.status(400).json({ error: 'Имя и возраст обязательны' });
  }

  const newUser = {
    id: users.length + 1,
    name,
    age: Number(age)
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT /users/:id - обновить пользователя
app.put('/users/:id', (req, res) => {
  const user = users.find(u => u.id == req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }

  const { name, age } = req.body;
  
  if (name) user.name = name;
  if (age) user.age = Number(age);

  res.json(user);
});

// DELETE /users/:id - удалить пользователя
app.delete('/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id == req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }

  users.splice(index, 1);
  res.status(204).send();
});

// Запуск сервера
app.listen(port, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${port}`);
  console.log(`📋 Список пользователей: http://localhost:${port}/users`);
});