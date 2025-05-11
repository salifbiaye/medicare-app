"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { format, subDays, subMonths } from "date-fns"
import { fr } from "date-fns/locale"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getUsersByDateRangeAction } from "@/actions/user.action"
import { Skeleton } from "@/components/ui/skeleton"

type UserChartData = {
  date: string
  total: number
  completed: number
  incomplete: number
}

const chartConfig = {
  total: {
    label: "Total",
    color: "hsl(221.2 83.2% 53.3%)",
  },
  completed: {
    label: "Emails Vérifiés",
    color: "hsl(210 98% 78%)",
  },
  incomplete: {
    label: "Emails Non Vérifiés",
    color: "hsl(212 95% 68%)",
  },
} satisfies ChartConfig

export function UsersChart() {
  const [timeRange, setTimeRange] = React.useState("90d")
  const [chartData, setChartData] = React.useState<UserChartData[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const endDate = new Date()
        let startDate: Date

        switch (timeRange) {
          case "7d":
            startDate = subDays(endDate, 7)
            break
          case "30d":
            startDate = subDays(endDate, 30)
            break
          default:
            startDate = subMonths(endDate, 3)
        }

        const result = await getUsersByDateRangeAction({
          startDate,
          endDate,
        })

        if (result.success && result.data) {
          // Grouper les utilisateurs par date
          const groupedData = result.data.users.reduce((acc: { [key: string]: UserChartData }, user) => {
            const date = format(new Date(user.createdAt), "yyyy-MM-dd")
            if (!acc[date]) {
              acc[date] = {
                date,
                total: 0,
                completed: 0,
                incomplete: 0,
              }
            }
            acc[date].total++
            if (user.emailVerified) {
              acc[date].completed++
            } else {
              acc[date].incomplete++
            }
            return acc
          }, {})

          // Convertir en tableau et trier par date
          const sortedData = Object.values(groupedData).sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
          )

          setChartData(sortedData)
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [timeRange])

  if (isLoading) {
    return (
        <Card className="bg-muted dark:bg-muted/30 overflow-hidden relative">
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-pulse-slow"></div>

          <CardHeader className="flex bg-gray-600 text-white dark:bg-muted items-center gap-2 space-y-0 border-b py-5 sm:flex-row relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
            <div className="grid flex-1 gap-1 text-center sm:text-left">
              <Skeleton className="h-6 w-48 bg-gray-500/30 dark:bg-gray-700/30" />
              <Skeleton className="h-4 w-64 mt-1 bg-gray-500/20 dark:bg-gray-700/20" />
            </div>
            <div className="w-[160px] h-10 rounded-lg bg-gray-700 dark:bg-gray-800 sm:ml-auto flex items-center justify-center">
              <Skeleton className="h-4 w-24 bg-gray-600/50 dark:bg-gray-700/50" />
            </div>
          </CardHeader>

          <CardContent className="px-2 pt-8 sm:px-6 sm:pt-6">
            {/* Chart skeleton */}
            <div className="h-[250px] w-full rounded-lg relative">
              {/* X-axis */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200 dark:bg-gray-700"></div>
              {/* Y-axis */}
              <div className="absolute top-0 bottom-0 left-0 w-px bg-gray-200 dark:bg-gray-700"></div>

              {/* Grid lines */}
              {[...Array(5)].map((_, i) => (
                  <div
                      key={i}
                      className="absolute left-0 right-0 h-px bg-gray-100 dark:bg-gray-800"
                      style={{ top: `${(i + 1) * 20}%` }}
                  ></div>
              ))}

              {/* Animated area */}
              <div className="absolute inset-x-0 bottom-0 h-2/3 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent"></div>
                <div
                    className="absolute inset-0 bg-gradient-to-t from-blue-300/10 to-transparent"
                    style={{ top: "30%" }}
                ></div>
                <div
                    className="absolute inset-0 bg-gradient-to-t from-blue-200/10 to-transparent"
                    style={{ top: "60%" }}
                ></div>
              </div>

              {/* Legend skeleton */}
              <div className="absolute top-0 right-0 flex gap-4 p-2">
                {Object.keys(chartConfig).map((key, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: Object.values(chartConfig)[i].color }}
                      ></div>
                      <Skeleton className="h-3 w-16 bg-gray-200/50 dark:bg-gray-700/50" />
                    </div>
                ))}
              </div>

              {/* Animated loading indicator */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
                  <span className="text-xs text-blue-600">Chargement du graphique...</span>
                </div>
              </div>
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between pt-4">
              {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-3 w-12 bg-gray-200/50 dark:bg-gray-700/50" />
              ))}
            </div>
          </CardContent>
        </Card>
    )
  }

  return (
      <Card className={"bg-muted dark:bg-muted/30"}>
        <CardHeader className="flex bg-gray-600 text-white dark:bg-muted items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle>Évolution des Utilisateurs</CardTitle>
            <CardDescription>Visualisation des utilisateurs sur la période sélectionnée</CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
                className="w-[160px] rounded-lg bg-gray-700 border-gray-700 sm:ml-auto"
                aria-label="Sélectionner une période"
            >
              <SelectValue placeholder="3 derniers mois" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                3 derniers mois
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                30 derniers jours
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                7 derniers jours
              </SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-total)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-total)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-completed)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-completed)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillIncomplete" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-incomplete)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-incomplete)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return format(date, "dd MMM", { locale: fr })
                  }}
              />
              <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                        labelFormatter={(value) => {
                          return format(new Date(value), "dd MMMM yyyy", { locale: fr })
                        }}
                        indicator="dot"
                    />
                  }
              />
              <Area
                  dataKey="incomplete"
                  type="natural"
                  fill="url(#fillIncomplete)"
                  stroke="var(--color-incomplete)"
                  stackId="a"
              />
              <Area
                  dataKey="completed"
                  type="natural"
                  fill="url(#fillCompleted)"
                  stroke="var(--color-completed)"
                  stackId="a"
              />
              <Area dataKey="total" type="natural" fill="url(#fillTotal)" stroke="var(--color-total)" stackId="a" />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
  )
}
