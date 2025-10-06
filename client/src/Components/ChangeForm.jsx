import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";

// eslint-disable-next-line react/prop-types
function ChangeForm({ showStatus, onButtonClick, currentDate, onAddSuccess, currentNote, nodeId}) {
    const [hours, setHours] = useState("");
    const [minutes, setMinutes] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Инициализация полей формы при получении currentNote
    useEffect(() => {
        if (currentNote) {
            setHours(currentNote.hours || "8");
            setMinutes(currentNote.minutes || "00");
            setName(currentNote.name || "");
            setPhone(currentNote.phone || "");
            setComment(currentNote.comment || "");
        }
    }, [currentNote]);

    const dateObj = new Date(currentDate);
    const options = { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' };
    const dateString = dateObj.toLocaleDateString('en-US', options).replace(',', '');

    const sendData = async () => {
        if (!name.trim()) {
            setError("ФИО не должно быть пустым!");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/update', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: nodeId,
                    date: dateString,
                    time: `${hours}:${minutes}`,
                    name,
                    phone,
                    comment
                }),
            });

            if (!response.ok) {
                const errorMessage = await response.json();
                setError(errorMessage.message || 'Ошибка во время изменения записи!');
                return;
            }

            // Очистка полей
            setHours("8");
            setMinutes("00");
            setName("");
            setPhone("");
            setComment("");
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
    }

    return (
        <div className={`task-form-wrapper ${showStatus ? 'active' : ''}`}>
            <button onClick={handleCloseBtn} className="close-btn"><IoMdClose /></button>
            <form className="task-form" onSubmit={(e) => e.preventDefault()}>
                <legend>Изменить запись</legend>
                
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

                <span className="error-message">{error}</span>

                <button disabled={loading} type="button" onClick={sendData}>
                    {loading ? "Загрузка..." : "Изменить"}
                </button>
            </form>
        </div>
    )
}

export default ChangeForm;