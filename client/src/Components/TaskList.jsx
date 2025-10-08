import { FaPen } from "react-icons/fa6";
import { GrCompliance } from "react-icons/gr";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import AddTaskForm from "./AddTaskForm";
import { useEffect } from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import ChangeForm from "./ChangeForm";
import { server_url } from "./serverUrl";

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

    const [error, setError] = useState(null);

    const dateObj = new Date(currentDate); // ваша дата
    const options = { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' };
    const dateString = dateObj.toLocaleDateString('en-US', options).replace(',', '');
    const [data, setData] = useState([]);

    const fetchData = async () => {
        try {
            const response = await fetch(`${server_url}/api/currentNotes`, {
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
            const response = await fetch(`${server_url}/api/delete`, {
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
            const response = await fetch(`${server_url}/api/complete`, {
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
    
    function handleChange(noteTime, name, phone, comment, id, registr) {
        if (changeForm == "") {
            setChangeForm("active");
            const [hours, minutes] = noteTime.split(":");
            const obj = {
                hours,
                minutes,
                name,
                phone,
                comment,
                registr
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
            {error ? <p className="task-list-error">{error}</p> :
            data.length == 0 ? <p className="happy-text">Записей на сегодня нет🤗</p> : 
            <ul className="task-list">
                {data.map(note => (
                    <li className={`task-item task-${note.status}`} key={note.id}>
                        <div className="task-item-time">{note.time}</div>
                        <div className="task-item-main">
                            <div>{note.name}, {note.phone}</div>
                            <div>{note.comment} / ({note.registr})</div>
                        </div>
                        {note.status === "active" ? 
                        <div className="task-item-btns">
                            <button className="btn-change" onClick={() => handleChange(note.time, note.name, note.phone, note.comment, note.id, note.registr)}>
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