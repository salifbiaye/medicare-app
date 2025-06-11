'use client'
import { ChevronLeft, ChevronRight, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface CalendarHeaderProps {
  currentDate: Date
  currentView: "day" | "month" | "year"
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
  onViewChange: (view: "day" | "month" | "year") => void
}

export function CalendarHeader({
                                 currentDate,
                                 currentView,
                                 onPrevious,
                                 onNext,
                                 onToday,
                                 onViewChange
                               }: CalendarHeaderProps) {
  const getCalendarTitle = () => {
    if (currentView === "year") {
      return format(currentDate, 'yyyy', { locale: fr })
    } else if (currentView === "month") {
      return format(currentDate, 'MMMM yyyy', { locale: fr })
    } else {
      return format(currentDate, 'EEEE d MMMM yyyy', { locale: fr })
    }
  }

  return (
      <div className={cn(
          "p-4 flex items-center justify-between ",
          "bg-gray-600 dark:bg-zinc-900/80 rounded-lg p-4 backdrop-blur-sm sticky top-0 z-10",
          "border-border"
      )}>
        <div className="flex items-center gap-1">
          <Button
              variant="ghost"
              size="icon"
              onClick={onPrevious}
              className="dark:text-white text-muted hover:text-primary hover:bg-primary/10 transition-all duration-200"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button
              variant="ghost"
              size="icon"
              onClick={onNext}
              className="dark:text-white text-muted hover:text-primary hover:bg-primary/10 transition-all duration-200"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          <h2 className="text-xl font-semibold ml-2 dark:text-white text-muted">
            {getCalendarTitle()}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className={cn(
              "flex rounded-lg p-1 space-x-1",
              "bg-gray-700 dark:bg-muted/50"
          )}>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewChange("day")}
                className={cn(
                    "rounded-md px-3 py-1 text-sm font-medium transition-all duration-200",
                    currentView === "day"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
            >
              Jour
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewChange("month")}
                className={cn(
                    "rounded-md px-3 py-1 text-sm font-medium transition-all duration-200",
                    currentView === "month"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
            >
              Mois
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewChange("year")}
                className={cn(
                    "rounded-md px-3 py-1 text-sm font-medium transition-all duration-200",
                    currentView === "year"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
            >
              Année
            </Button>
          </div>

          <Button
              variant="outline"
              size="sm"
              onClick={onToday}
              className={cn(
                  "transition-all duration-200 flex items-center gap-1",
                  "border-border text-muted-foreground hover:text-foreground",
                  "hover:border-primary/30 hover:bg-primary/10"
              )}
          >
            <Clock className="h-4 w-4" />
            <span>Aujourd'hui</span>
          </Button>
        </div>
      </div>
  )
}