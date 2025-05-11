"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Pencil, Lock } from "lucide-react"
import { ProfileFormData, PasswordFormData, UserProfileProps } from "./types"
import { Gender, Role, User } from "@prisma/client"
import ProfileForm from "./forms/profile-form"
import PasswordForm from "./forms/password-form"
import ProfileInfo from "./profile-infos"
import { cn } from "@/lib/utils"
import { zoomInPulse } from "@/components/animations"
import { CreateProgramForm } from "../program/create-program-form"

const ProfileHeader = ({
  user,
  onEditClick,
  editState
}: {
  user: User
  onEditClick: (state: 'profile' | 'password' | 'none') => void
  editState: 'profile' | 'password' | 'none'
}) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-0 bg-background">
        <CardHeader className="pb-0 pt-6">
          <div className="flex flex-col items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Avatar className="h-20 w-20 border border-border">
                <AvatarImage src={user.image || ""} alt={user.name} />
                <AvatarFallback className="text-2xl bg-muted text-muted-foreground">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
            </motion.div>
            <div className="mt-4 text-center">
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <div className="flex items-center justify-center gap-2 mt-1">
                <Badge variant="secondary">{user.gender === Gender.MALE ? "Male" : "Female"}</Badge>
                {user.role !== Role.USER && <Badge variant="outline">{user.role}</Badge>}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4 flex flex-wrap justify-center gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="sm" onClick={() => onEditClick('profile')} className={cn(editState === 'profile' && "hidden")}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="sm" onClick={() => onEditClick('password')} className={cn(editState === 'password' && "hidden")}>
                <Lock className="h-4 w-4 mr-2" />
                Change Password
              </Button>
            </motion.div>
            <CreateProgramForm userId={user.id} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function UserProfile({ user }: UserProfileProps) {
  
  const [editState, setEditState] = useState<'profile' | 'password' | 'none'>('none')

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ProfileHeader
        user={user}
        onEditClick={(state) => setEditState(state)}
        editState={editState}
      />

      <AnimatePresence mode="wait">
        {editState === 'profile' && (
          <motion.div key="profile-form" {...zoomInPulse}>
            <ProfileForm
              initialData={{
                name: user.name,
                goals: user.goals || "",
                gender: user.gender,
              }}
              onCancel={() => setEditState('none')}
            />
          </motion.div>
        )}

        {editState === 'password' && (
          <motion.div key="password-form" {...zoomInPulse}>
            <PasswordForm
              onCancel={() => setEditState('none')}
            />
          </motion.div>
        )}

        {editState === 'none' && (
          <motion.div key="profile-info" {...zoomInPulse}>
            <ProfileInfo user={user} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
