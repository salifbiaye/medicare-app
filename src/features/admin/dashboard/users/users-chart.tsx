"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { format, subDays, subMonths } from "date-fns"
import { fr } from "date-fns/locale"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getUsersByDateRangeAction } from "@/actions/user.action"
import LoaderComponent from "@/components/animations/loader-component";

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
          const sortedData = Object.values(groupedData).sort((a, b) => 
            new Date(a.date).getTime() - new Date(b.date).getTime()
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
      <Card>
        <CardHeader>
          <CardTitle><LoaderComponent/></CardTitle>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className={"bg-muted dark:bg-muted/30"}>
      <CardHeader className="flex bg-gray-600 text-white  dark:bg-muted items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Évolution des Utilisateurs</CardTitle>
          <CardDescription>
            Visualisation des utilisateurs sur la période sélectionnée
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg bg-gray-700 border-gray-700  sm:ml-auto"
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
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-total)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-total)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-completed)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-completed)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillIncomplete" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-incomplete)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-incomplete)"
                  stopOpacity={0.1}
                />
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
            <Area
              dataKey="total"
              type="natural"
              fill="url(#fillTotal)"
              stroke="var(--color-total)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
} 