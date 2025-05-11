"use client"

import type React from "react"

import { useState } from "react"
import type { User } from "@prisma/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Check, Loader2, Mail, Phone, MapPin } from "lucide-react"
import { updateProfileAction } from "@/actions/user.action"
import { useToast } from "@/hooks/use-toast"
import { getRoleLabel, getRoleBadgeVariant } from "@/lib/role-utils"

type ProfileHeaderProps = {
  user: User
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [coverIsUploading, setCoverIsUploading] = useState(false)
  const { toast } = useToast()

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)

      // This would be replaced with your actual image upload logic
      // For example, uploading to a storage service and getting a URL back
      const formData = new FormData()
      formData.append("image", file)

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Update profile with new image URL
      // In a real implementation, you would get the URL from your upload response
      const imageUrl = URL.createObjectURL(file)

      await updateProfileAction({
        id: user.id,
        image: imageUrl,
      })

      toast({
        title: "Image mise à jour",
        description: "Votre photo de profil a été mise à jour avec succès.",
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de votre photo.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Similar implementation as profile image change
    setCoverIsUploading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setCoverIsUploading(false)

    toast({
      title: "Image de couverture mise à jour",
      description: "Votre image de couverture a été mise à jour avec succès.",
      variant: "success",
    })
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5">
        {/* Cover image would go here */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/placeholder.svg?height=400&width=1200')" }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        <Button
          size="sm"
          variant="secondary"
          className="absolute top-4 right-4 flex items-center gap-2 bg-background/80 backdrop-blur-sm"
          disabled={coverIsUploading}
        >
          {coverIsUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Chargement...</span>
            </>
          ) : (
            <>
              <Camera className="h-4 w-4" />
              <span>Modifier la couverture</span>
            </>
          )}
        </Button>

        <input type="file" id="cover-upload" className="hidden" accept="image/*" onChange={handleCoverImageChange} />
      </div>

      <CardContent className="relative px-6 pb-6 pt-0 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 -mt-12 sm:-mt-16">
            <div className="relative">
              <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-background rounded-xl">
                <AvatarImage src={user.image || ""} alt={user.name} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <label
                htmlFor="profile-upload"
                className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
              >
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
              </label>

              <input
                type="file"
                id="profile-upload"
                className="hidden"
                accept="image/*"
                onChange={handleProfileImageChange}
              />
            </div>

            <div className="mt-4 sm:mt-0">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                {user.profileCompleted && (
                  <Badge variant="success" className="flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    <span>Profil Complet</span>
                  </Badge>
                )}
              </div>

              <div className="mt-1 flex items-center gap-2">
                <Badge variant={getRoleBadgeVariant(user.role)}>{getRoleLabel(user.role)}</Badge>

                {user.emailVerified && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Email Vérifié
                  </Badge>
                )}
              </div>

              <div className="mt-3 flex flex-col sm:flex-row gap-3 text-sm text-muted-foreground">
                {user.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                )}

                {user.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    <span>{user.phone}</span>
                  </div>
                )}

                {user.address && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{user.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-0 flex flex-wrap gap-3">
            <Button variant="outline" className="w-full sm:w-auto">
              Exporter les données
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
