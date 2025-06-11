import { cn } from "@/lib/utils"
import { Appointment } from "@prisma/client"

interface YearViewProps {
  currentDate: Date
  appointments: Appointment[]
  onMonthClick: (date: Date) => void
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export function YearView({ currentDate, appointments, onMonthClick }: YearViewProps) {
  const year = currentDate.getFullYear()

  // Group appointments by month
  const appointmentsByMonth = appointments.reduce((acc, appointment) => {
    const date = new Date(appointment.date)
    const month = date.getMonth()
    if (!acc[month]) {
      acc[month] = []
    }
    acc[month].push(appointment)
    return acc
  }, {} as Record<number, Appointment[]>)

  const renderMiniMonth = (monthIndex: number) => {
    const firstDay = new Date(year, monthIndex, 1)
    const lastDay = new Date(year, monthIndex + 1, 0)
    const daysInMonth = lastDay.getDate()

    // Adjust for Monday being the first day (1-7, Monday-Sunday)
    let firstDayOfWeek = firstDay.getDay() || 7
    firstDayOfWeek = firstDayOfWeek === 0 ? 7 : firstDayOfWeek

    // Empty cells for days before the first day of the month
    const blanks = Array(firstDayOfWeek - 1)
      .fill(null)
      .map((_, i) => <div key={`blank-${i}`} className="text-center">&nbsp;</div>)

    // Days of the month
    const days = Array(daysInMonth)
      .fill(null)
      .map((_, i) => {
        const date = new Date(year, monthIndex, i + 1)
        const isToday = date.toDateString() === new Date().toDateString()
        const isCurrent =
          currentDate.getDate() === i + 1 && 
          currentDate.getMonth() === monthIndex && 
          currentDate.getFullYear() === year
        const dayAppointments = appointmentsByMonth[monthIndex]?.filter(app => 
          new Date(app.date).toDateString() === date.toDateString()
        ) || []
        const hasAppointments = dayAppointments.length > 0

        return (
          <div
            key={`day-${i}`}
            className={cn(
              "text-center text-xs py-1 cursor-pointer hover:bg-accent dark:hover:bg-gray-800 rounded-full w-6 h-6 mx-auto flex items-center justify-center",
              isToday ? "text-primary" : "text-gray-400",
              hasAppointments ? "bg-accent/30" : "",
              isCurrent ? "bg-primary text-primary-foreground" : "",
            )}
          >
            {i + 1}
          </div>
        )
      })

    return (
      <div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-1">
          {dayNamesShort.map((day, index) => (
            <div key={index}>{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">{[...blanks, ...days]}</div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {monthNames.map((monthName, monthIndex) => (
        <div
          key={monthName}
          className="border dark:border-gray-800 rounded-lg overflow-hidden dark:hover:border-gray-700 cursor-pointer"
          onClick={() => onMonthClick(new Date(year, monthIndex, 1))}
        >
          <div className="bg-accent dark:bg-gray-900 p-2 text-center font-medium dark:border-b dark:border-gray-800">
            {monthName}
          </div>
          <div className="p-2">{renderMiniMonth(monthIndex)}</div>
        </div>
      ))}
    </div>
  )
}
