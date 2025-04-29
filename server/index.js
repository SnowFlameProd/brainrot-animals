require("dotenv").config()
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const path = require('path');
const authMiddleware = require("./authMiddleware");
const db = require("./db");

const app = express();
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.send("API is working")
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
});


// Регистрация
app.post("/api/signup", async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
        const result = stmt.run(username, hashedPassword);

        const userId = result.lastInsertRowid;
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: "1w",
        });

        res.status(201).json({ token, id: userId, username,});
    } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return res.status(409).json({ message: "Имя пользователя уже занято" });
        }
        console.error(err);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// Логин
app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;

    const stmt = db.prepare("SELECT * FROM users WHERE username = ?");
    const user = stmt.get(username);

    if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(401).json({ message: "Неверный пароль" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1w",
    });

    res.json({ token, id: user.id, username });
});

// Проверка токена
app.get("/api/me", authMiddleware, (req, res) => {
    const stmt = db.prepare("SELECT id, username FROM users WHERE id = ?");
    const user = stmt.get(req.user.userId);

    if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.json(user);
});

app.use('/images', express.static(path.join(__dirname, '/public/images')));
app.use('/sounds', express.static(path.join(__dirname, '/public/sounds')));


// Получение всех вопросов
app.get("/api/questions", (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM questions');
        const rows = stmt.all();

        // Перемешай все вопросы
        const shuffled = rows.sort(() => 0.5 - Math.random());

        // Собери вопросы в нужной форме
        const questions = shuffled.map((correctQuestion) => {
            // Получи 3 случайных неправильных
            const incorrect = shuffled
                .filter(q => q.id !== correctQuestion.id)
                .sort(() => 0.5 - Math.random())
                .slice(0, 3);

            // Объедини и перемешай варианты
            const options = [
                {
                    image_url: correctQuestion.image_url,
                    sound_url: correctQuestion.sound_url,
                    isCorrect: true
                },
                ...incorrect.map((q) => ({
                    image_url: q.image_url,
                    sound_url: q.sound_url,
                    isCorrect: false
                }))
            ].sort(() => 0.5 - Math.random());

            return {
                label: correctQuestion.label,
                options
            };
        });

        res.json(questions);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: 'Database error' });
    }
});

