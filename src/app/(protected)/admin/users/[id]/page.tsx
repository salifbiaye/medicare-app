import { notFound } from "next/navigation"
import { UserRepository } from "@/repository/user.repository"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

interface UserPageProps {
  params: {
    id: string
  }
}

export default async function UserPage({ params }: UserPageProps) {
  const user = await UserRepository.getUserById(params.id)

  if (!user) {
    notFound()
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
        </div>

        <Card className="border-0 bg-background shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center gap-6 p-6">
            <Avatar className="h-20 w-20 ring-2 ring-offset-2 ring-offset-background">
              <AvatarImage src={user.image || undefined} alt={user.name} />
              <AvatarFallback className="text-lg">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <CardTitle className="text-2xl font-semibold tracking-tight">{user.name}</CardTitle>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </CardHeader>
          <div className="px-6">
            <Separator />
          </div>
          <CardContent className="p-6">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold tracking-tight">Basic Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Role</span>
                    <Badge variant={user.role === "ADMIN" ? "default" : "secondary"} className="font-medium">
                      {user.role}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Gender</span>
                    <span className="font-medium">{user.gender}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Profile Status</span>
                    <Badge variant={user.profileCompleted ? "success" : "destructive"} className="font-medium">
                      {user.profileCompleted ? "Completed" : "Incomplete"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold tracking-tight">Account Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Created At</span>
                    <span className="font-medium">
                      {format(new Date(user.createdAt), "PPP")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Updated At</span>
                    <span className="font-medium">
                      {format(new Date(user.updatedAt), "PPP")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Email Verified</span>
                    <Badge variant={user.emailVerified ? "success" : "destructive"} className="font-medium">
                      {user.emailVerified ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 