"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { format, subDays, subMonths } from "date-fns"
import { fr } from "date-fns/locale"
import { TrendingUp } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { getHospitalsByDateRangeAction } from "@/actions/hospital.action"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type HospitalChartData = {
  date: string
  total: number
}

type TimeRange = "7d" | "3m" | "10m"

const chartConfig = {
  total: {
    label: "Total Hôpitaux",
    color: "hsl(215, 100%, 50%)",
  },
} satisfies ChartConfig

export function HospitalsChart() {
  const [chartData, setChartData] = React.useState<HospitalChartData[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [total, setTotal] = React.useState(0)
  const [timeRange, setTimeRange] = React.useState<TimeRange>("10m")
  const [growth, setGrowth] = React.useState<number>(0)

  const fetchData = React.useCallback(async (range: TimeRange) => {
    setIsLoading(true)
    try {
      const endDate = new Date()
      let startDate: Date

      switch (range) {
        case "7d":
          startDate = subDays(endDate, 7)
          break
        case "3m":
          startDate = subMonths(endDate, 3)
          break
        default:
          startDate = subMonths(endDate, 10)
      }

      const result = await getHospitalsByDateRangeAction({
        startDate,
        endDate,
      })

      if (result.success && result.data) {
        // Grouper les hôpitaux par date
        const groupedData = result.data.reduce((acc: { [key: string]: HospitalChartData }, hospital) => {
          const date = format(new Date(hospital.createdAt), "yyyy-MM-dd")
          if (!acc[date]) {
            acc[date] = {
              date,
              total: 0,
            }
          }
          acc[date].total++
          return acc
        }, {})

        // Convertir en tableau et trier par date
        const sortedData = Object.values(groupedData).sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        )

        // Calculate growth percentage
        if (sortedData.length >= 2) {
          const firstValue = sortedData[0].total
          const lastValue = sortedData[sortedData.length - 1].total
          const growthRate = firstValue > 0 ? ((lastValue - firstValue) / firstValue) * 100 : 0
          setGrowth(Number.parseFloat(growthRate.toFixed(1)))
        }

        setChartData(sortedData)
        setTotal(result.data.length)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchData(timeRange)
  }, [timeRange, fetchData])

  const getTimeRangeLabel = (range: TimeRange) => {
    switch (range) {
      case "7d":
        return "7 jours"
      case "3m":
        return "3 mois"
      case "10m":
        return "10 mois"
    }
  }

  return (
      <Card className="overflow-hidden shadow-sm bg-background">
        <CardHeader className="bg-gray-600 dark:bg-muted  to-white border-b pb-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center  gap-2 text-xl p-2 font-bold text-background dark:text-foreground">
                <TrendingUp className="h-5 w-5 text-background dark:text-foreground" />
                Évolution des Hôpitaux
              </CardTitle>
              <CardDescription className="mt-1 text-white dark:text-muted-foreground">
                Nombre d'hôpitaux créés sur la période sélectionnée
              </CardDescription>
            </div>
            <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)} className="hidden text-background sm:block">
              <TabsList className="bg-background">
                <TabsTrigger value="7d">7 jours</TabsTrigger>
                <TabsTrigger value="3m">3 mois</TabsTrigger>
                <TabsTrigger value="10m">10 mois</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

        </CardHeader>

        <CardContent className="p-0 pt-4">
          {isLoading ? (
              <div className="flex h-[250px] w-full items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
                  <span className="text-sm text-blue-600">Chargement des données...</span>
                </div>
              </div>
          ) : (
              <div className="px-2 pb-4 sm:px-6">
                <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                  <LineChart
                      accessibilityLayer
                      data={chartData}
                      margin={{
                        left: 12,
                        right: 12,
                        bottom: 12,
                      }}
                  >
                    <defs>
                      <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="rgba(37, 99, 235, 0.8)" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="rgba(37, 99, 235, 0.2)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
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
                        stroke="#94a3b8"
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        stroke="#94a3b8"
                        tickFormatter={(value) => value.toString()}
                    />
                    <ChartTooltip
                        cursor={{ stroke: "#94a3b8", strokeWidth: 1, strokeDasharray: "5 5" }}
                        content={
                          <ChartTooltipContent
                              className="rounded-lg border-none bg-background p-3 shadow-lg"
                              nameKey="total"
                              labelFormatter={(value) => {
                                return format(new Date(value), "dd MMMM yyyy", { locale: fr })
                              }}
                              formatter={(value) => [`${value} hôpitaux`, "Total"]}
                          />
                        }
                    />
                    <Line
                        dataKey="total"
                        type="monotone"
                        stroke="var(--color-total)"
                        strokeWidth={3}
                        dot={{ fill: "white", stroke: "var(--color-total)", strokeWidth: 2, r: 4 }}
                        activeDot={{ fill: "var(--color-total)", stroke: "white", strokeWidth: 2, r: 6 }}
                        fillOpacity={1}
                        fill="url(#totalGradient)"
                    />
                  </LineChart>
                </ChartContainer>
              </div>
          )}
        </CardContent>
      </Card>
  )
}
