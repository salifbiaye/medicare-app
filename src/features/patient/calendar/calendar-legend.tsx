import React from "react"
import { appointmentColors } from "./appointment-utils"

export function CalendarLegend() {
  return (
    <div className="flex flex-wrap gap-4 p-4 bg-card rounded-lg">
      {Object.entries(appointmentColors).map(([status, colors]) => (
        <div key={status} className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded ${colors.bg} ${colors.border} border`} />
          <span className="text-sm font-medium">
            {status === "SCHEDULED" && "Planifié"}
            {status === "COMPLETED" && "Terminé"}
            {status === "CANCELLED" && "Annulé"}
          </span>
        </div>
      ))}
    </div>
  )
} 