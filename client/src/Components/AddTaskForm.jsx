import { IoMdClose } from "react-icons/io";

// eslint-disable-next-line react/prop-types
function AddTaskForm({showStatus, onButtonClick}) {
    return (
        <div className={`task-form-wrapper ${showStatus}`}>
            <button onClick={onButtonClick} className="close-btn"><IoMdClose /></button>
            <form className="task-form" onSubmit={(e) => e.preventDefault()}>
                <legend>Новая запись</legend>
                <div className="task-form-group">
                    <label htmlFor="addFormHours">Время</label>
                    <select name="hours" id="addFormHours">
                        <option value="">8</option>
                        <option value="">9</option>
                        <option value="">10</option>
                        <option value="">11</option>
                        <option value="">12</option>
                        <option value="">13</option>
                        <option value="">14</option>
                        <option value="">15</option>
                        <option value="">16</option>
                        <option value="">17</option>
                        <option value="">18</option>
                        <option value="">19</option>
                    </select>
                    <select name="minutes">
                        <option value="">00</option>
                        <option value="">10</option>
                        <option value="">20</option>
                        <option value="">30</option>
                        <option value="">40</option>
                        <option value="">50</option>
                    </select>
                </div>
                <div className="task-form-group">
                    <label htmlFor="addFormFIO">ФИО</label>
                    <input type="text" id="addFormFIO"/>
                </div>
                <div className="task-form-group">
                    <label htmlFor="addFormPhone">Телефон</label>
                    <input type="text" id="addFormPhone"/>
                </div>
                <div className="task-form-group">
                    <label htmlFor="addFormInfo">Комментарий</label>
                    <input type="text" id="addFormInfo"/>
                </div>
                <button onClick={onButtonClick}>Добавить</button>
            </form>
        </div>
    )
}

export default AddTaskForm