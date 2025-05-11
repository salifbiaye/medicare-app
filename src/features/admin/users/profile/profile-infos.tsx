import { Card, CardContent } from "@/components/ui/card"
import { User } from "@prisma/client"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "lucide-react"
import { CheckCircle } from "lucide-react"

const ProfileInfo = ({ user }: { user: User }) => {
    return (
      <Card className="border-0 bg-background">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Information</h2>
        
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Email</h3>
            <p className="font-medium">{user.email}</p>
          </div>
  
          <Separator />
  
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Goals</h3>
            <p>{user.goals || "No goals defined"}</p>
          </div>
  
          <Separator />
  
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Member since</h3>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <p>{new Date(user.createdAt).toISOString().split('T')[0]}</p>
            </div>
          </div>
  
          <Separator />
  
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Profile status</h3>
            {user.profileCompleted ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span>Profile completed</span>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Complete your profile to unlock all features
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  export default ProfileInfo