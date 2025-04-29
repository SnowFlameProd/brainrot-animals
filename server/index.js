require("dotenv").config()
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
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
        stmt.run(username, hashedPassword);

        res.status(201).json({ message: "Пользователь зарегистрирован" });
    } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return res.status(409).json({ message: "Имя пользователя уже занято" });
        }
        console.error(err);
        res.status(500).json({ message: "Ошибка сервера" });
    }
})

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

    res.json({ token });
});

app.get("/api/me", authMiddleware, (req, res) => {
    const stmt = db.prepare("SELECT id, username FROM users WHERE id = ?");
    const user = stmt.get(req.user.userId);

    if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.json(user);
});

