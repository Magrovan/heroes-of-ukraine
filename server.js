const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const uri = process.env.MONGO_URI;

mongoose
    .connect(uri)
    .then(() => console.log("Підключено до MongoDB Atlas"))
    .catch((error) => console.error("Помилка підключення до MongoDB:", error));

const Hero = mongoose.model("Hero", {
    name: String,
    photo: String,
    category: String,
    biography: String,
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

app.post("/upload", upload.single("photo"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "Файл не завантажено" });
    }
    res.json({ filePath: `/images/${req.file.filename}` });
});

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

app.get("/api/heroes", async (req, res) => {
    try {
        const heroes = await Hero.find();
        res.json(heroes);
    } catch (error) {
        console.error("Помилка:", error);
        res.status(500).json({ message: "Помилка сервера" });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер працює на http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
    res.send("Сервер працює! Ви можете почати роботу з API.");
});
console.log("MONGO_URI:", process.env.MONGO_URI);