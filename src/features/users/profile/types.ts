// Types basés sur votre schéma Prisma

import { Gender, User } from "@prisma/client"

export interface UserProfileProps {
  user: User
}

export interface ProfileFormData {
  name: string
  goals?: string
  gender: Gender
}

export interface PasswordFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}