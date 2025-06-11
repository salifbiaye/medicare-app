import React from "react"
import { Appointment } from "@prisma/client"
import { getAppointmentColors, formatAppointmentTime, isAppointmentInDay } from "./appointment-utils"

interface MonthViewProps {
  currentDate: Date
  appointments: Appointment[]
  onDayClick: (date: Date) => void
}

export function MonthView({ currentDate, appointments, onDayClick }: MonthViewProps) {
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  const startingDayOfWeek = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const days = Array.from({ length: 42 }, (_, i) => {
    const dayNumber = i - startingDayOfWeek + 1
    if (dayNumber < 1 || dayNumber > daysInMonth) return null
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber)
  })

  const weeks = Array.from({ length: 6 }, (_, i) => days.slice(i * 7, (i + 1) * 7))

  return (
    <div className="grid grid-cols-7 gap-1">
      {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map((day) => (
        <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
          {day}
        </div>
      ))}

      {weeks.map((week, weekIndex) => (
        <React.Fragment key={weekIndex}>
          {week.map((day, dayIndex) => {
            if (!day) return <div key={`empty-${dayIndex}`} className="p-2" />

            const isToday = day.toDateString() === new Date().toDateString()
            const dayAppointments = appointments.filter(apt => isAppointmentInDay(apt, day))

            return (
              <div
                key={day.toISOString()}
                className={`
                  min-h-[100px] p-2 border border-border rounded-lg cursor-pointer
                  hover:bg-muted/50 transition-colors
                  ${isToday ? "bg-primary/5 border-primary/20" : ""}
                `}
                onClick={() => onDayClick(day)}
              >
                <div className="font-medium text-sm mb-1">
                  {day.getDate()}
                </div>
                <div className="space-y-1">
                  {dayAppointments.slice(0, 3).map((appointment) => {
                    const colors = getAppointmentColors(appointment)
                    return (
                      <div
                        key={appointment.id}
                        className={`
                          text-xs p-1 rounded
                          ${colors.bg} ${colors.text} ${colors.border} border
                          truncate
                        `}
                      >
                        {formatAppointmentTime(appointment.date)}
                      </div>
                    )
                  })}
                  {dayAppointments.length > 3 && (
                    <div className="text-xs text-muted-foreground">
                      +{dayAppointments.length - 3} autres
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </React.Fragment>
      ))}
    </div>
  )
}