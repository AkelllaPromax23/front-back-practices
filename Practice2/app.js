const express = require('express');
const app = express();
const port = 3000;

// =================== НАЧАЛЬНЫЕ ДАННЫЕ ===================
let products = [
    { id: 1, name: 'Ноутбук', price: 75000 },
    { id: 2, name: 'Смартфон', price: 45000 },
    { id: 3, name: 'Наушники', price: 5000 }
];

// =================== MIDDLEWARE ===================
// Для парсинга JSON в запросах (чтобы работал req.body)
app.use(express.json());

// Собственное middleware для логирования запросов
app.use((req, res, next) => {
    console.log(`📥 [${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next(); // Передаём управление дальше
});

// =================== ГЛАВНАЯ СТРАНИЦА ===================
app.get('/', (req, res) => {
    res.send(`
        <h1>🛒 Product API</h1>
        <p>Доступные маршруты:</p>
        <ul>
            <li><b>GET /products</b> - список всех товаров</li>
            <li><b>GET /products/:id</b> - товар по ID</li>
            <li><b>POST /products</b> - создать товар (нужен JSON)</li>
            <li><b>PUT /products/:id</b> - полностью обновить товар</li>
            <li><b>PATCH /products/:id</b> - частично обновить товар</li>
            <li><b>DELETE /products/:id</b> - удалить товар</li>
        </ul>
        <p>Пример JSON для POST/PUT/PATCH:</p>
        <pre>{
    "name": "Планшет",
    "price": 30000
}</pre>
    `);
});

// =================== CRUD ОПЕРАЦИИ ===================

/**
 * CREATE (Создание товара)
 * POST /products
 * Тело запроса: { "name": "Товар", "price": 1000 }
 */
app.post('/products', (req, res) => {
    const { name, price } = req.body;
    
    // Валидация
    if (!name || !price) {
        return res.status(400).json({ 
            error: 'Не указаны name или price',
            example: { name: 'Товар', price: 1000 }
        });
    }
    
    if (isNaN(price) || price <= 0) {
        return res.status(400).json({ error: 'price должно быть положительным числом' });
    }
    
    // Создаём новый товар
    const newProduct = {
        id: Date.now(), // Уникальный ID на основе времени
        name,
        price: Number(price)
    };
    
    products.push(newProduct);
    res.status(201).json(newProduct);
});

/**
 * READ ALL (Получить все товары)
 * GET /products
 */
app.get('/products', (req, res) => {
    res.json(products);
});

/**
 * READ ONE (Получить товар по ID)
 * GET /products/:id
 */
app.get('/products/:id', (req, res) => {
    const id = Number(req.params.id);
    const product = products.find(p => p.id === id);
    
    if (!product) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    
    res.json(product);
});

/**
 * UPDATE FULL (Полное обновление товара)
 * PUT /products/:id
 * Тело запроса: { "name": "Новое название", "price": 2000 }
 */
app.put('/products/:id', (req, res) => {
    const id = Number(req.params.id);
    const { name, price } = req.body;
    
    // Валидация
    if (!name || !price) {
        return res.status(400).json({ 
            error: 'Для PUT нужны name и price',
            example: { name: 'Новый товар', price: 1000 }
        });
    }
    
    if (isNaN(price) || price <= 0) {
        return res.status(400).json({ error: 'price должно быть положительным числом' });
    }
    
    const index = products.findIndex(p => p.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    
    // Полностью заменяем товар
    products[index] = {
        id: id, // ID оставляем прежним
        name,
        price: Number(price)
    };
    
    res.json(products[index]);
});

/**
 * UPDATE PARTIAL (Частичное обновление товара)
 * PATCH /products/:id
 * Тело запроса: { "name": "Новое название" } или { "price": 2000 } или оба
 */
app.patch('/products/:id', (req, res) => {
    const id = Number(req.params.id);
    const { name, price } = req.body;
    
    const product = products.find(p => p.id === id);
    
    if (!product) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    
    // Валидация цены, если она передана
    if (price !== undefined) {
        if (isNaN(price) || price <= 0) {
            return res.status(400).json({ error: 'price должно быть положительным числом' });
        }
        product.price = Number(price);
    }
    
    // Обновляем имя, если оно передано
    if (name !== undefined) {
        product.name = name;
    }
    
    res.json(product);
});

/**
 * DELETE (Удаление товара)
 * DELETE /products/:id
 */
app.delete('/products/:id', (req, res) => {
    const id = Number(req.params.id);
    const initialLength = products.length;
    
    products = products.filter(p => p.id !== id);
    
    if (products.length === initialLength) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    
    res.json({ message: 'Товар успешно удалён' });
});

// =================== ЗАПУСК СЕРВЕРА ===================
app.listen(port, () => {
    console.log(`
    ╔════════════════════════════════════════╗
    ║  🚀 Сервер запущен!                    ║
    ║  📡 http://localhost:${port}             ║
    ║                                        ║
    ║  📦 Product API готов к работе         ║
    ╚════════════════════════════════════════╝
    `);
});