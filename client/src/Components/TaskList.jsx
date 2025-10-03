import { FaPen } from "react-icons/fa6";
import { GrCompliance } from "react-icons/gr";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import AddTaskForm from "./AddTaskForm";

function TaskList() {

    const [showAddForm, setShowAddForm] = useState("");

    function handleTaskForm() {
        console.log(`handle + ${showAddForm}`);
        if (showAddForm == "") {
            setShowAddForm("active");
        } else {
            setShowAddForm("");
        }
    }

    return (
        <div className="task-list-wrapper">
            <ul className="task-list">
                <li className="task-item">
                    <div className="task-item-time">12:00</div>
                    <div className="task-item-main">
                        <div>Зайцев Дмитрий Евгеньевич, +375447033927</div>
                        <div>Регистрация земельного участка</div>
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
                <li className="task-item">
                    <div className="task-item-time">12:00</div>
                    <div className="task-item-main">
                        <div>Зайцев Дмитрий Евгеньевич, +375447033927</div>
                        <div>Регистрация земельного участка</div>
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
            </ul>
            <button onClick={handleTaskForm} className="add-new-task-btn">Добавить Запись</button>
            <AddTaskForm onButtonClick={handleTaskForm} showStatus={showAddForm}/>
        </div>
    )
}

export default TaskList