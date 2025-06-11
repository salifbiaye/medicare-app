import React from "react"
import { appointmentColors } from "./appointment-utils"

const getStatusLabel = (status: string) => {
  switch (status) {
    case "SCHEDULED":
      return "Planifié"
    case "COMPLETED":
      return "Terminé"
    case "CANCELLED":
      return "Annulé"
    default:
      return status
  }
}

export function CalendarLegend() {
  return (
    <div className="flex flex-wrap gap-4 p-4 bg-card rounded-lg">
      {Object.entries(appointmentColors).map(([status, colors]) => (
        <div key={status} className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded ${colors.bg} ${colors.border} border`} />
          <span className="text-sm font-medium">
            {getStatusLabel(status)}
          </span>
        </div>
      ))}
    </div>
  )
}
