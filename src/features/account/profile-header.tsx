"use client"

import type React from "react"

import { useState } from "react"
import type { User } from "@prisma/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {Camera, Check, Loader2, Mail, Phone, MapPin, Users} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getRoleLabel, getRoleBadgeVariant } from "@/lib/role-utils"
import {AnimatedHeader, AnimatedLayout} from "@/components/animations/animated-layout";
import {ParticlesBackground} from "@/components/animations/particles-background";

type ProfileHeaderProps = {
  user: User
}

export function ProfileHeader({ user }: ProfileHeaderProps) {

  return (
    <Card className="overflow-hidden bg-background">

        <AnimatedLayout className={"rounded-none"} >
          <ParticlesBackground />
            <div className={"h-30"}>

            </div>

        </AnimatedLayout>

      <CardContent className="relative px-6 pb-6 pt-0 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 -mt-12 sm:-mt-16">
            <div className="relative">
              <Avatar className="h-24 w-24 sm:h-32 sm:w-32  z-30 rounded-xl">
                <AvatarImage src={user.image || ""} alt={user.name} />
                <AvatarFallback className="text-2xl bg-accent dark:bg-primary/50 border-2 border-accent dark:border-primary text-primary dark:text-primary-foreground">
                  {user.name.split(" ").map((name) => name[0]).join("").toUpperCase()}
                </AvatarFallback>
              </Avatar>




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

        </div>
      </CardContent>
    </Card>
  )
}
