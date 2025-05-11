import { notFound } from "next/navigation"
import { UserRepository } from "@/repository/user.repository"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "@prisma/client"
import { UserForm } from "@/features/users/user-form"

interface UserEditPageProps {
  params: {
    id: string
  }
}

export default async function UserEditPage({ params }: UserEditPageProps) {
  const user = await UserRepository.getUserById(params.id)

  if (!user) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <UserForm user={user} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 