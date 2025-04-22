require("dotenv").config()
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const authMiddleware = require("./authMiddleware")

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


let users = [] // временная база пользователей

// Регистрация
app.post("/api/signup", async (req, res) => {
    const { username, password } = req.body;

    const existingUser = users.find((u) => u.username === username);
    if (existingUser) {
        return res.status(409).json({ message: "Имя пользователя уже занято" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now(), username, password: hashedPassword };
    users.push(newUser);

    res.status(201).json({ message: "Пользователь зарегистрирован" });
})

// Логин
app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username);

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
    const user = users.find((u) => u.id === req.user.userId);
    res.json({ id: user.id, username: user.username });
});

