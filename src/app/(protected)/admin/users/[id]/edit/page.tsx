import { notFound } from "next/navigation"
import { UserRepository } from "@/repository/user.repository"

import EditUserPage from "@/features/admin/users/edit-user";

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



            <EditUserPage user={user}/>

    </div>
  )
} 