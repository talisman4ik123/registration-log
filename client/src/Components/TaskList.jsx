import { FaPen } from "react-icons/fa6";
import { GrCompliance } from "react-icons/gr";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import AddTaskForm from "./AddTaskForm";
import { useEffect } from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import ChangeForm from "./ChangeForm";

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

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/currentNotes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: dateString }),
            });
            
            if (!response.ok) {
                const errorMessage = await response.json();
                setError('Ошибка во время получения записей!' || errorMessage.message);
                setData([]);
                return;
            }
            
            const jsonData = await response.json();
            setData(jsonData);
            setError(null);
        } catch (err) {
            setError('Ошибка сервера!' || err.message);
        } finally {
            setLoading(false);
        }
    };

    // При первоначальной загрузке
    useEffect(() => {
        fetchData();
    }, [dateString]);

    const refreshData = () => {
        fetchData();
    };

    // Обработчик удаления записи
    const handleDelete = async (noteTime) => {
        const confirmDelete = window.confirm('Вы действительно хотите удалить эту запись?');
        if (!confirmDelete) return;

        try {
            const response = await fetch('http://localhost:5000/api/delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date: dateString, time: noteTime }),
            });
            
            if (!response.ok) {
            const errorMsg = await response.json();
            alert('Ошибка при удалении записи' || errorMsg.message);
            return;
            }

            // После успешного удаления обновляем список
            refreshData();

        } catch (err) {
            alert('Ошибка сервера' || err.message);
        }
    };


    const handleComplete = async (noteTime) => {
        try {
            const response = await fetch('http://localhost:5000/api/complete', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date: dateString, time: noteTime }),
            });
            
            if (!response.ok) {
            const errorMsg = await response.json();
            alert('Ошибка при изменении статуса' || errorMsg.message);
            return;
            }

            // После успешного удаления обновляем список
            refreshData();
        } catch (err) {
            alert('Ошибка сервера' || err.message);
        }
    }

    const [changeForm, setChangeForm] = useState("");
    const [currentNote, setCurrentNote] = useState({});
    const [nodeId, setNodeId] = useState(null);
    
    function handleChange(noteTime, name, phone, comment, id) {
        if (changeForm == "") {
            setChangeForm("active");
            const [hours, minutes] = noteTime.split(":");
            const obj = {
                hours,
                minutes,
                name,
                phone,
                comment
            }
            setNodeId(id);
            setCurrentNote(obj);
        } else {
            setChangeForm("");
            setCurrentNote({});
        }
    }

    return (
        <div className="task-list-wrapper">
            {loading ? <p className="task-list-loading">Загрузка Данных...</p> : 
            error ? <p className="task-list-error">{error}</p> :
            data.length == 0 ? <p className="happy-text">Записей на сегодня нет🤗</p> : 
            <ul className="task-list">
                {data.map(note => (
                    <li className={`task-item task-${note.status}`} key={note.id}>
                        <div className="task-item-time">{note.time}</div>
                        <div className="task-item-main">
                            <div>{note.name}, {note.phone}</div>
                            <div>{note.comment}</div>
                        </div>
                        {note.status === "active" ? 
                        <div className="task-item-btns">
                            <button className="btn-change" onClick={() => handleChange(note.time, note.name, note.phone, note.comment, note.id)}>
                                <span>Изменить</span>
                                <FaPen />
                            </button>
                            <button className="btn-complete" onClick={() => handleComplete(note.time)}>
                                <span>Выполнено</span>
                                <GrCompliance />
                            </button>
                            <button  className="btn-delete" onClick={() => handleDelete(note.time)}>
                                <span>Удалить</span>
                                <FaTrash />
                            </button>
                        </div>  : <div className="checked-status"><BsCheckCircleFill /></div>}
                    </li>
                ))}
            </ul>
}
            <button onClick={handleTaskForm} className="add-new-task-btn">Добавить Запись</button>
            <AddTaskForm onButtonClick={handleTaskForm} showStatus={showAddForm} currentDate={currentDate} onAddSuccess={refreshData}/>
            <ChangeForm onButtonClick={handleChange} showStatus={changeForm} currentDate={currentDate} onAddSuccess={refreshData} currentNote={currentNote} nodeId={nodeId}/>
        </div>
    )
}

export default TaskList