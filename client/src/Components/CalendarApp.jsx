import { useState } from 'react'
import TaskList from './TaskList'

const CalendarApp = () => {
  const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
  const monthsOfYear = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ]

  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  const currentDay = currentDate.getDate()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  // Изменение: расчет первого дня месяца с понедельника в начале недели
  const firstDayOfMonth = (() => {
    const day = new Date(currentYear, currentMonth, 1).getDay()
    return day === 0 ? 6 : day - 1
  })()

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const handleDayClick = (day) => {
    const newDate = new Date(currentYear, currentMonth, day)
    setCurrentDate(newDate)
  }

  return (
    <div className="calendar-app">
      <h1 className="heading">Журнал предварительной записи</h1>
      <div className='calendar-wrapper'>
        <div className="calendar">
          <div className="navigate-date">
            <h2 className="month">{monthsOfYear[currentMonth]},</h2>
            <h2 className="year">{currentYear}</h2>
            <div className="buttons">
              <i className="bx bx-chevron-left" onClick={prevMonth}></i>
              <i className="bx bx-chevron-right" onClick={nextMonth}></i>
            </div>
          </div>
          <div className="weekdays">
            {daysOfWeek.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          
          <div className="days">
            {/* В начале добавляем пустые ячейки для корректного отображения недели */}
            {[...Array(firstDayOfMonth).keys()].map((_, index) => (
              <span key={`empty-${index}`}></span>
            ))}
            {/* Отрисовка дней месяца */}
            {[...Array(daysInMonth).keys()].map((day) => (
              <span
                key={day + 1}
                className={
                  day + 1 === currentDay && 
                  currentMonth === currentDate.getMonth() && 
                  currentYear === currentDate.getFullYear() 
                    ? 'current-day' 
                    : ''
                }
                onClick={() => handleDayClick(day + 1)}
              >
                {day + 1}
              </span>
            ))}
          </div>
        </div>
        <TaskList currentDate={currentDate}/>
      </div>
    </div>
  )
}

export default CalendarApp