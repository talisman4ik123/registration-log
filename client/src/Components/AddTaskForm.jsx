import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { server_url } from "./serverUrl";

// eslint-disable-next-line react/prop-types
function AddTaskForm({showStatus, onButtonClick, currentDate, onAddSuccess}) {

    const [hours, setHours] = useState("8");
    const [minutes, setMinutes] = useState("00");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [comment, setComment] = useState("");
    const [registr, setRegistr] = useState("Ярошин");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const dateObj = new Date(currentDate); // ваша дата
    const options = { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' };
    const dateString = dateObj.toLocaleDateString('en-US', options).replace(',', '');

    const sendDate = async () => {
        if (name == "") {
            setError("ФИО не должно быть пустым!");
            return; // добавьте возврат, чтобы не продолжать при ошибке
        }

        const data = {
            date: dateString,
            time: `${hours}:${minutes}`,
            name,
            phone,
            comment,
            registr
        }

        setLoading(true);

        try {
            const response = await fetch(`${server_url}/api/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorMessage = await response.json();
            setError(errorMessage.message || 'Ошибка во время добавления записи!');
            return;
        }

        // Очистка полей
        setHours("8");
        setMinutes("00");
        setName("");
        setPhone("");
        setComment("");
        setRegistr("Ярошин");
        setError(null);

        // Обновление списка записей
        if (onAddSuccess) {
            onAddSuccess();
        }
      
        // Закрыть форму
        onButtonClick();
        } catch (err) {
        setError(err.message || 'Ошибка сервера!');
        } finally {
        setLoading(false);
        }
    };

    function handleCloseBtn() {
        setHours("8");
        setMinutes("00");
        setError(null);
        setName("");
        setPhone("");
        setComment("");
        onButtonClick();
        setRegistr("Ярошин");
    }

    return (
        <div className={`task-form-wrapper ${showStatus}`}>
            <button onClick={handleCloseBtn} className="close-btn"><IoMdClose /></button>
            <form className="task-form" onSubmit={(e) => e.preventDefault()}>
                <legend>Новая запись</legend>
                <div className="task-form-group">
                    <label htmlFor="addFormHours">Время</label>
                    <select name="hours" id="addFormHours" value={hours} onChange={(e) => setHours(e.target.value)}>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                        <option value="13">13</option>
                        <option value="14">14</option>
                        <option value="15">15</option>
                        <option value="16">16</option>
                        <option value="17">17</option>
                        <option value="18">18</option>
                        <option value="19">19</option>
                    </select>
                    <select name="minutes" value={minutes} onChange={(e) => setMinutes(e.target.value)}>
                        <option value="00">00</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="30">30</option>
                        <option value="40">40</option>
                        <option value="50">50</option>
                    </select>
                </div>
                <div className="task-form-group">
                    <label htmlFor="addFormFIO">ФИО</label>
                    <input type="text" required id="addFormFIO" value={name} onChange={(e) => setName(e.target.value)}/>
                </div>
                <div className="task-form-group">
                    <label htmlFor="addFormPhone">Телефон</label>
                    <input type="text" id="addFormPhone" value={phone} onChange={(e) => setPhone(e.target.value)}/>
                </div>
                <div className="task-form-group">
                    <label htmlFor="addFormInfo">Комментарий</label>
                    <input type="text" id="addFormInfo" value={comment} onChange={(e) => setComment(e.target.value)}/>
                </div>
                <div className="task-form-group">
                    <label htmlFor="addFormRegistr">Запись добавил</label>
                    <select name="registr" id="addFormRegistr" value={registr} onChange={(e) => setRegistr(e.target.value)}>
                        <option value="Ярошин">Ярошин</option>
                        <option value="Кутай">Кутай</option>
                        <option value="Андреева">Андреева</option>
                        <option value="Буров">Буров</option>
                        <option value="Савченко">Савченко</option>
                    </select>
                </div>

                <span className="error-message">{error}</span>

            <button disabled={loading} type="button" onClick={sendDate}>
          {loading ? (
            <>
              Загрузка...
            </>
          ) : (
            "Добавить"
          )}
        </button>
            </form>
        </div>
    )
}

export default AddTaskForm