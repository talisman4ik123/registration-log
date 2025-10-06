const db = require("../db");
const uuid = require("uuid");

class Controller {
    async createNote(req, res) {
        try {
            const { date, time, name, phone, comment } = req.body;

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

            await db.query(
                "INSERT INTO registration (date, time, name, phone, comment, status) values ($1, $2, $3, $4, $5, $6) RETURNING *",
                [date, time, name, phone, comment, "active"]
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

            const note = await db.query("SELECT * FROM registration WHERE date=$1", [date]);
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
            const {id, date, time, name, phone, comment} = req.body;
            await db.query("UPDATE registration SET date = $1, time = $2, name = $3, phone = $4, comment = $5 WHERE id = $6", [date, time, name, phone, comment, id]);

            const notes = await db.query("SELECT * FROM registration");
            return res.json(notes.rows);
        } catch (error) {
            console.error(`server error during note update: ${error}`);
            return res.status(500).json({ message: "Серверная ошибка!" });
        }
    }
}

module.exports = new Controller();