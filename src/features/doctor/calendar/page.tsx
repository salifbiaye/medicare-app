'use client'
import React, { useState } from "react";
import { CalendarHeader } from "@/features/doctor/calendar/calendar-header";
import { CalendarLegend } from "@/features/doctor/calendar/calendar-legend";
import { DayView } from "@/features/doctor/calendar/day-view";
import { MonthView } from "@/features/doctor/calendar/month-view";
import { YearView } from "@/features/doctor/calendar/year-view";
import { Appointment } from "@prisma/client";

interface CalendarProps {
  appointments: Appointment[]
}

export function Calendar({ appointments }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentView, setCurrentView] = useState<"day" | "month" | "year">("month")

  const handlePrevious = () => {
    const newDate = new Date(currentDate)
    if (currentView === "day") {
      newDate.setDate(newDate.getDate() - 1)
    } else if (currentView === "month") {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setFullYear(newDate.getFullYear() - 1)
    }
    setCurrentDate(newDate)
  }

  const handleNext = () => {
    const newDate = new Date(currentDate)
    if (currentView === "day") {
      newDate.setDate(newDate.getDate() + 1)
    } else if (currentView === "month") {
      newDate.setMonth(newDate.getMonth() + 1)
    } else {
      newDate.setFullYear(newDate.getFullYear() + 1)
    }
    setCurrentDate(newDate)
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const handleViewChange = (view: "day" | "month" | "year") => {
    setCurrentView(view)
  }

  const handleDayClick = (date: Date) => {
    setCurrentDate(date)
    setCurrentView("day")
  }

  const handleMonthClick = (date: Date) => {
    setCurrentDate(date)
    setCurrentView("month")
  }

  return (
      <div className="space-y-4 p-4">
        <CalendarHeader
            currentDate={currentDate}
            currentView={currentView}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onToday={handleToday}
            onViewChange={handleViewChange}
        />
        <CalendarLegend />

        <div className="transition-all bg-muted dark:bg-zinc-900 rounded-lg p-4 duration-200 ease-in-out">
          {currentView === "day" && (
              <DayView currentDate={currentDate} appointments={appointments} />
          )}

          {currentView === "month" && (
              <MonthView
                  currentDate={currentDate}
                  appointments={appointments}
                  onDayClick={handleDayClick}
              />
          )}

          {currentView === "year" && (
              <YearView
                  currentDate={currentDate}
                  appointments={appointments}
                  onMonthClick={handleMonthClick}
              />
          )}
        </div>
      </div>
  )
}