const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const router = require("./router/router");
require("dotenv").config();

const PORT = 5000;
const app = express();

app.use(express.json());
app.use(
    cors({
        origin: '*', // конкретный фронтенд-домен
        credentials: true, // разрешить отправку куки и авторизационных заголовков
    })
);
app.use(cookieParser());

app.use("/api", router);

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));