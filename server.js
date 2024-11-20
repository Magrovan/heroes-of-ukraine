const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 5000;

// URI для підключення до MongoDB Atlas
const uri = "mongodb+srv://dmitromagrovan:Dmutruk3110@heroesdb.dtgpb.mongodb.net/heroesDB?retryWrites=true&w=majority";

// Підключення до MongoDB Atlas
mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Підключено до MongoDB Atlas"))
    .catch((error) => console.error("Помилка підключення до MongoDB Atlas:", error));

// Модель героя
const Hero = mongoose.model("Hero", {
    name: String,
    photo: String, // Шлях до фото
    category: String,
    biography: String,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images"))); // Статична папка для зображень

// Налаштування Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images/"); // Збереження у папку "images"
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Унікальне ім'я файлу
    },
});

const upload = multer({ storage });

// Ендпоінт для завантаження файлу
app.post("/upload", upload.single("photo"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "Файл не завантажено" });
    }
    res.json({ filePath: `/images/${req.file.filename}` });
});

// Ендпоінт для додавання героя
app.post("/api/heroes", async (req, res) => {
    const { name, photo, category, biography } = req.body;
    try {
        const newHero = new Hero({ name, photo, category, biography });
        await newHero.save();
        res.json(newHero);
    } catch (error) {
        console.error("Помилка:", error);
        res.status(500).json({ message: "Не вдалося додати героя" });
    }
});

// Ендпоінт для отримання героїв
app.get("/api/heroes", async (req, res) => {
    try {
        const heroes = await Hero.find();
        res.json(heroes);
    } catch (error) {
        console.error("Помилка:", error);
        res.status(500).json({ message: "Помилка сервера" });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер працює на http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
    res.send("Сервер працює! Ви можете почати роботу з API.");
});
