import { notFound } from "next/navigation"
import { getUserWithRelationsAction } from "@/actions/user.action"
import EditUserPage from "@/features/admin/users/edit-user";

interface UserEditPageProps {
  params: {
    id: string
  }
}

export default async function UserEditPage({ params }: UserEditPageProps) {
  const { success, data: user, error } = await getUserWithRelationsAction(params.id)

  if (!success || !user) {
    notFound()
  }

  return (
    <div className="py-10">
      <EditUserPage user={user} />
    </div>
  )
} 