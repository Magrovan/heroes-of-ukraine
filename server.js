const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const uri = "mongodb+srv://dmitromagrovan:<Dmutruk3110>@heroesdb.dtgpb.mongodb.net/?retryWrites=true&w=majority&appName=heroesDB";

const app = express();
const PORT = 5000;

mongoose
    .connect("mongodb://localhost:27017/heroesDB", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Підключено до MongoDB"))
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

app.use("/images", express.static(path.join(__dirname, "images")));

app.get("/api/heroes", async (req, res) => {
    try {
        const heroes = await Hero.find();
        res.json(heroes);
    } catch (error) {
        console.error("Помилка:", error);
        res.status(500).json({ message: "Помилка сервера" });
    }
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "heroes.html"));
});

app.listen(PORT, () => {
    console.log(`Сервер працює на http://localhost:${PORT}`);
});
