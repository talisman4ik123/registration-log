import { FaPen } from "react-icons/fa6";
import { GrCompliance } from "react-icons/gr";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import AddTaskForm from "./AddTaskForm";
import { useEffect } from "react";

// eslint-disable-next-line react/prop-types
function TaskList({currentDate}) {

    const [showAddForm, setShowAddForm] = useState("");


    function handleTaskForm() {
        if (showAddForm == "") {
            setShowAddForm("active");
        } else {
            setShowAddForm("");
        }
    }


    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(null);
    const dateObj = new Date(currentDate); // ваша дата
    const options = { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' };
    const dateString = dateObj.toLocaleDateString('en-US', options).replace(',', '');
    const [data, setData] = useState([]);

    useEffect(() => {
    const fetchData = async () => {
        try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/currentNotes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({date: dateString}),
        });

        if (!response.ok) {
            const errorMessage = await response.json();
            setError(errorMessage.message || 'Ошибка во время получения записей!');
            return;
        }

        setData(await response.json());

        setError(null);

        } catch (err) {
        setError(err || 'Ошибка сервера!');
        } finally {
        setLoading(false);
        }
    };

    fetchData();
    }, [currentDate]);

    return (
        <div className="task-list-wrapper">
            {data.length == 0 ? <p className="happy-text">Записей на сегодня нет🤗</p> : 
            <ul className="task-list">
                {data.map(note => (
                    <li className="task-item" key={note.id}>
                        <div className="task-item-time">{note.time}</div>
                        <div className="task-item-main">
                            <div>{note.name}, {note.phone}</div>
                            <div>{note.comment}</div>
                        </div>
                        <div className="task-item-btns">
                            <button className="btn-change">
                                <span>Изменить</span>
                                <FaPen />
                            </button>
                            <button className="btn-complete">
                                <span>Выполнено</span>
                                <GrCompliance />
                            </button>
                            <button className="btn-delete">
                                <span>Удалить</span>
                                <FaTrash />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
}
            <button onClick={handleTaskForm} className="add-new-task-btn">Добавить Запись</button>
            <AddTaskForm onButtonClick={handleTaskForm} showStatus={showAddForm} currentDate={currentDate}/>
        </div>
    )
}

export default TaskList