import React from "react"
import { Appointment } from "@prisma/client"
import { getAppointmentColors, formatAppointmentTime, isAppointmentInDay } from "./appointment-utils"
import { Stethoscope } from "lucide-react"

interface DayViewProps {
  currentDate: Date
  appointments: Appointment[]
}

export function DayView({ currentDate, appointments }: DayViewProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const dayAppointments = appointments.filter(apt => isAppointmentInDay(apt, currentDate))

  return (
    <div className="space-y-2">
      {hours.map((hour) => {
        const hourAppointments = dayAppointments.filter(apt => {
          const aptDate = new Date(apt.date)
          return aptDate.getHours() === hour
        })

        return (
          <div key={hour} className="grid grid-cols-[100px_1fr] gap-4">
            <div className="text-sm text-muted-foreground py-2">
              {hour.toString().padStart(2, "0")}:00
            </div>
            <div className="min-h-[60px] border-l border-border pl-4 space-y-2">
              {hourAppointments.map((appointment) => {
                const colors = getAppointmentColors(appointment)
                return (
                  <div
                    key={appointment.id}
                    className={`
                      p-2 rounded-lg border transition-colors
                      ${colors.bg} ${colors.border} ${colors.text} ${colors.hover}
                    `}
                  >
                    <div className="font-medium">
                      {formatAppointmentTime(appointment.date)}
                    </div>
                    <div className="text-sm flex items-center gap-2">
                      <Stethoscope className="h-4 w-4" />
                      Dr. {appointment.doctor.user.name}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
} 