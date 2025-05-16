import { notFound } from "next/navigation"
import { UserRepository } from "@/repository/user.repository"

import EditUserPage from "@/features/admin/users/edit-user";
import EditPersonnelPage from "@/features/director/personnels/edit-personnel";
import {getUserWithRelationsAction} from "@/actions/user.action";

interface UserEditPageProps {
  params: {
    id: string
  }
}

export default async function UserEditPage({ params }: UserEditPageProps) {
  const param = await params
  const { success, data: user, error } = await getUserWithRelationsAction(param.id)

  if (!user) {
    notFound()
  }

  return (
    <div className=" py-10">



            <EditPersonnelPage user={user}/>

    </div>
  )
} 