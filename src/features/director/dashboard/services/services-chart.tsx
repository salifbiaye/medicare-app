"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { format, subDays, subMonths } from "date-fns"
import { fr } from "date-fns/locale"
import { TrendingUp } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { getServicesByDateRangeAction } from "@/actions/service.action"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type ServiceChartData = {
  date: string
  total: number
}

type TimeRange = "7d" | "3m" | "10m"

const chartConfig = {
  total: {
    label: "Total Services",
    color: "hsl(142, 76%, 36%)",
  },
} satisfies ChartConfig

export function ServicesChart() {
  const [chartData, setChartData] = React.useState<ServiceChartData[]>([])
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

      const result = await getServicesByDateRangeAction({
        startDate,
        endDate,
      })

      if (result.success && result.data) {
        // Grouper les services par date
        const groupedData = result.data.reduce((acc: { [key: string]: ServiceChartData }, service) => {
          const date = format(new Date(service.createdAt), "yyyy-MM-dd")
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
        <CardHeader className="bg-gray-600 dark:bg-muted to-white border-b pb-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl p-2 font-bold text-background dark:text-foreground">
                <TrendingUp className="h-5 w-5 text-background dark:text-foreground" />
                Évolution des Services
              </CardTitle>
              <CardDescription className="mt-1 text-white dark:text-muted-foreground">
                Nombre de services créés sur la période sélectionnée
              </CardDescription>
            </div>
            <Tabs
                value={timeRange}
                onValueChange={(v) => setTimeRange(v as TimeRange)}
                className="hidden text-background sm:block"
            >
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
              <div className="px-6 py-8">
                {/* Chart skeleton */}
                <div className="space-y-8">
                  {/* Chart header skeleton with metrics */}
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className="flex flex-col rounded-lg bg-white dark:bg-gray-800 p-3 shadow-sm">
                      <Skeleton className="h-4 w-16 mb-1" />
                      <Skeleton className="h-7 w-12" />
                    </div>
                    <div className="flex flex-col rounded-lg bg-white dark:bg-gray-800 p-3 shadow-sm">
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-7 w-16" />
                    </div>
                  </div>

                  {/* Chart skeleton */}
                  <div className="h-[200px] w-full rounded-lg relative">
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

                    {/* Animated line */}
                    <div className="absolute inset-x-0 bottom-0 h-1/3 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-green-600/10 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-green-600"></div>
                      <div className="absolute bottom-0 left-0 h-1 w-1 rounded-full bg-green-600"></div>
                      <div className="absolute bottom-0 left-1/4 h-12 w-1 rounded-full bg-green-600/20"></div>
                      <div className="absolute bottom-0 left-2/4 h-20 w-1 rounded-full bg-green-600/20"></div>
                      <div className="absolute bottom-0 left-3/4 h-16 w-1 rounded-full bg-green-600/20"></div>
                      <div className="absolute bottom-0 right-0 h-24 w-1 rounded-full bg-green-600/20"></div>
                    </div>

                    {/* Animated loading indicator */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600/20 border-t-green-600"></div>
                        <span className="text-xs text-green-600">Chargement du graphique...</span>
                      </div>
                    </div>
                  </div>

                  {/* X-axis labels */}
                  <div className="flex justify-between pt-2">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-3 w-12" />
                    ))}
                  </div>
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
                        <stop offset="5%" stopColor="rgba(22, 163, 74, 0.8)" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="rgba(22, 163, 74, 0.2)" stopOpacity={0} />
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
                              formatter={(value) => [`${value} services`, "Total"]}
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