import { notFound } from "next/navigation"
import { UserRepository } from "@/repository/user.repository"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, MailIcon, UserIcon, ShieldIcon, ClipboardCheckIcon, ClipboardIcon, ArrowLeftIcon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {AnimatedLayout} from "@/components/animations/animated-layout";
import {ParticlesBackground} from "@/components/animations/particles-background";

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

  // Traduire le rôle en français
  const translateRole = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "Administrateur"
      case "USER":
        return "Utilisateur"
      default:
        return role
    }
  }

  // Traduire le genre en français
  const translateGender = (gender: string) => {
    switch (gender) {
      case "MALE":
        return "Masculin"
      case "FEMALE":
        return "Féminin"
      case "OTHER":
        return "Autre"
      default:
        return gender
    }
  }

  return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80 pb-12 pt-6 dark:from-background dark:to-background/95">
        <div className="container mx-auto px-4">
          <AnimatedLayout>
            <ParticlesBackground/>
            <div
                className="text-background dark:text-foreground ">
              <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
                  <Avatar className="h-24 w-24 rounded-xl  ">
                    <AvatarImage src={user.image || undefined} alt={user.name}/>
                    <AvatarFallback
                        className="text-xl font-semibold bg-accent dark:bg-background/50 text-primary ">{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="mt-4 sm:mt-0">
                    <div className="flex items-center gap-2">
                      <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
                    </div>
                    <p className="mt-1 flex items-center gap-1.5 dark:text-muted-foreground">
                      <MailIcon className="h-4 w-4"/>
                      <span>{user.email}</span>
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge variant="outline"
                             className="rounded-md bg-accent dark:bg-primary/5 px-2.5 py-1 font-medium text-primary">
                        ID: {params.id}
                      </Badge>
                      <Badge
                          variant="outline"
                          className="rounded-md bg-accent text-primary dark:bg-accent/10 px-2.5 py-1 font-medium dark:text-accent-foreground"
                      >
                        {translateRole(user.role)}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-col items-end gap-2 sm:mt-0">
                  <div className="flex items-center gap-1.5 text-sm dark:text-muted-foreground">
                    <CalendarIcon className="h-4 w-4"/>
                    <span>Créé le {format(new Date(user.createdAt), "d MMMM yyyy", {locale: fr})}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm dark:text-muted-foreground">
                    <CalendarIcon className="h-4 w-4"/>
                    <span>Mis à jour le {format(new Date(user.updatedAt), "d MMMM yyyy", {locale: fr})}</span>
                  </div>
                </div>
              </div>
            </div>

          </AnimatedLayout>
          <div className="mb-4">
            <Link href="/admin/users" passHref>
              <Button variant="ghost" className="gap-2">
                <ArrowLeftIcon className="h-4 w-4"/>
                Retour à la liste
              </Button>
            </Link>
          </div>


          {/* Contenu principal */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* Informations personnelles */}
            <div
                className="overflow-hidden rounded-xl bg-gray-200  backdrop-blur-sm transition-all hover:shadow-lg dark:bg-card/40">
              <div className="border-b border-border/40 bg-gray-600 p-6 dark:bg-muted">
                <h2 className="flex items-center gap-2 text-xl font-semibold text-background dark:text-foreground">
                  <UserIcon className="h-5 w-5"/>
                  Informations personnelles
                </h2>
              </div>
              <div className="p-6">
                <dl className="space-y-6">
                  <div
                      className="flex flex-col gap-1.5 rounded-lg bg-muted/30 p-4 transition-colors hover:bg-muted/50 dark:hover:bg-muted/40">
                    <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Nom complet</dt>
                    <dd className="text-base font-medium">{user.name}</dd>
                  </div>

                  <div
                      className="flex flex-col gap-1.5 rounded-lg bg-muted/30 p-4 transition-colors hover:bg-muted/50 dark:hover:bg-muted/40">
                    <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</dt>
                    <dd className="text-base font-medium">{user.email}</dd>
                  </div>

                  <div
                      className="flex flex-col gap-1.5 rounded-lg bg-muted/30 p-4 transition-colors hover:bg-muted/50 dark:hover:bg-muted/40">
                    <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Genre</dt>
                    <dd className="text-base font-medium">{translateGender(user.gender)}</dd>
                  </div>

                  <div
                      className="flex flex-col gap-1.5 rounded-lg bg-muted/30 p-4 transition-colors hover:bg-muted/50 dark:hover:bg-muted/40">
                    <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email vérifié
                    </dt>
                    <dd className="flex items-center gap-2">
                      {user.emailVerified ? (
                          <Badge
                              className="rounded-md bg-green-100 px-2.5 py-1 text-sm font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            Vérifié
                          </Badge>
                      ) : (
                          <Badge
                              className="rounded-md bg-red-100 px-2.5 py-1 text-sm font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
                            Non vérifié
                          </Badge>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Informations administratives */}
            <div
                className="overflow-hidden rounded-xl bg-gray-200  backdrop-blur-sm transition-all hover:shadow-lg dark:bg-card/40">
              <div className="border-b border-border/40 bg-gray-600  p-6 dark:bg-muted">
                <h2 className="flex items-center gap-2 text-xl font-semibold text-background dark:text-foreground">
                  <ShieldIcon className="h-5 w-5"/>
                  Informations administratives
                </h2>
              </div>
              <div className="p-6">
                <dl className="space-y-6">
                  <div
                      className="flex flex-col gap-1.5 rounded-lg bg-muted/30 p-4 transition-colors hover:bg-muted/50 dark:hover:bg-muted/40">
                    <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Rôle</dt>
                    <dd className="flex items-center gap-2">
                      <Badge
                          variant="outline"
                          className="rounded-md bg-accent/10 px-2.5 py-1 text-sm font-medium text-accent-foreground"
                      >
                        {translateRole(user.role)}
                      </Badge>
                    </dd>
                  </div>

                  <div
                      className="flex flex-col gap-1.5 rounded-lg bg-muted/30 p-4 transition-colors hover:bg-muted/50 dark:hover:bg-muted/40">
                    <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Date de création
                    </dt>
                    <dd className="flex items-center gap-2 text-base font-medium">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground"/>
                      {format(new Date(user.createdAt), "PPP", {locale: fr})}
                    </dd>
                  </div>

                  <div
                      className="flex flex-col gap-1.5 rounded-lg bg-muted/30 p-4 transition-colors hover:bg-muted/50 dark:hover:bg-muted/40">
                    <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Dernière mise à jour
                    </dt>
                    <dd className="flex items-center gap-2 text-base font-medium">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground"/>
                      {format(new Date(user.updatedAt), "PPP", {locale: fr})}
                    </dd>
                  </div>

                  <div
                      className="flex flex-col gap-1.5 rounded-lg bg-muted/30 p-4 transition-colors hover:bg-muted/50 dark:hover:bg-muted/40">
                    <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Statut du profil
                    </dt>
                    <dd className="flex items-center gap-2">
                      {user.profileCompleted ? (
                          <div className="flex items-center gap-2">
                            <ClipboardCheckIcon className="h-5 w-5 text-green-600 dark:text-green-400"/>
                            <Badge
                                className="rounded-md bg-green-100 px-2.5 py-1 text-sm font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              Complet
                            </Badge>
                          </div>
                      ) : (
                          <div className="flex items-center gap-2">
                            <ClipboardIcon className="h-5 w-5 text-amber-600 dark:text-amber-400"/>
                            <Badge
                                className="rounded-md bg-amber-100 px-2.5 py-1 text-sm font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                              Incomplet
                            </Badge>
                          </div>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}