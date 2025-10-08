const db = require("../db");
const os = require('os');

class Controller {
    async createNote(req, res) {
        try {
            const { date, time, name, phone, comment, registr } = req.body;

            const note = await db.query(
                "SELECT * FROM registration WHERE date=$1 AND time=$2",
                [date, time]
            );
            if (note.rows[0]) {
                console.log(`note with date ${date} and time ${time} alredy exist`);
                return res.status(400).json({
                    message: `Запись на ${time} уже существует!`,
                });
            }

            const localIP = Object.values(os.networkInterfaces())
                .flat()
                .find(iface => iface.family === 'IPv4' && !iface.internal)?.address;

            const currentDate = getCurrentDate();
            await db.query(
                "INSERT INTO registration (date, time, name, phone, comment, registr, status, ip, change_date) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
                [date, time, name, phone, comment, registr, "active", localIP, currentDate]
            );

            return res
                .status(200)
                .json({ message: "Запись успешно добавлена!" });
        } catch (error) {
            console.error(`server error during note creation: ${error}`);
            return res.status(500).json({ message: "Серверная ошибка!" });
        }
    }

    async getCurrentNotes(req, res) {
        try {
            const {date} = req.body;

            const note = await db.query("SELECT * FROM registration WHERE date=$1 order by time::TIME", [date]);
            return res.json(note.rows)
        } catch (error) {
            console.error(`server error during receiving notes: ${error}`);
            return res.status(500).json({ message: "Серверная ошибка!" });
        }
    }

    async deleteNote(req, res) {
        try {
            const {date, time} = req.body;
            await db.query("DELETE FROM registration WHERE date=$1 AND time=$2", [date, time]);
            
            const notes = await db.query("SELECT * FROM registration");

            const localIP = Object.values(os.networkInterfaces())
                .flat()
                .find(iface => iface.family === 'IPv4' && !iface.internal)?.address;

            const currentDate = getCurrentDate();
            console.log(`Note ${date}_${time} - delete ${localIP} at ${currentDate}`)

            return res.json(notes.rows);
        } catch (error) {
            console.error(`server error during note deletion: ${error}`);
            return res.status(500).json({ message: "Серверная ошибка!" });
        }
    }

    async completeNote(req, res) {
        try {
            const {date, time} = req.body;
            await db.query("UPDATE registration SET status = 'complete' WHERE date=$1 AND time=$2", [date, time]);

            const notes = await db.query("SELECT * FROM registration");
            return res.json(notes.rows);
        } catch (error) {
            console.error(`server error during note complete: ${error}`);
            return res.status(500).json({ message: "Серверная ошибка!" });
        }
    }

    async updateNote(req, res) {
        try {
            const {id, date, time, name, phone, comment, registr} = req.body;
            const localIP = Object.values(os.networkInterfaces())
                .flat()
                .find(iface => iface.family === 'IPv4' && !iface.internal)?.address;

            const currentDate = getCurrentDate();
            await db.query("UPDATE registration SET date = $1, time = $2, name = $3, phone = $4, comment = $5, registr = $6, ip=$7, change_date=$8 WHERE id = $9", 
                [date, time, name, phone, comment, registr, localIP, currentDate, id]);

            const notes = await db.query("SELECT * FROM registration");
            return res.json(notes.rows);
        } catch (error) {
            console.error(`server error during note update: ${error}`);
            return res.status(500).json({ message: "Серверная ошибка!" });
        }
    }
}

function getCurrentDate() {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, '0'); // Получаем день месяца и добавляем ведущий ноль при необходимости
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0, поэтому добавляем 1, и добавляем ведущий ноль
    const year = now.getFullYear(); // Получаем полный год
    const hours = String(now.getHours()).padStart(2, '0'); // Получаем часы и добавляем ведущий ноль
    const minutes = String(now.getMinutes()).padStart(2, '0'); // Получаем минуты и добавляем ведущий ноль

    const formattedDate = `${day}.${month}.${year} ${hours}:${minutes}`;

    return formattedDate;
}

module.exports = new Controller();