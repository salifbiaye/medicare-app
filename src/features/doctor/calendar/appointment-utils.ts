import { Appointment } from "@prisma/client"

export const appointmentColors = {
  SCHEDULED: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-800",
    hover: "hover:bg-blue-200 dark:hover:bg-blue-800/50"
  },
  COMPLETED: {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-700 dark:text-green-300",
    border: "border-green-200 dark:border-green-800",
    hover: "hover:bg-green-200 dark:hover:bg-green-800/50"
  },
  CANCELLED: {
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-700 dark:text-red-300",
    border: "border-red-200 dark:border-red-800",
    hover: "hover:bg-red-200 dark:hover:bg-red-800/50"
  }
}

export const getAppointmentColors = (appointment: Appointment) => {
  return appointmentColors[appointment.status as keyof typeof appointmentColors] || appointmentColors.SCHEDULED
}

export const formatAppointmentTime = (date: Date) => {
  return new Date(date).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatAppointmentDate = (date: Date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })
}

export const getAppointmentDuration = (appointment: Appointment) => {
  return appointment.duration || 30 // Durée par défaut de 30 minutes
}

export const isAppointmentInDay = (appointment: Appointment, date: Date) => {
  const appointmentDate = new Date(appointment.date)
  return (
    appointmentDate.getDate() === date.getDate() &&
    appointmentDate.getMonth() === date.getMonth() &&
    appointmentDate.getFullYear() === date.getFullYear()
  )
} 