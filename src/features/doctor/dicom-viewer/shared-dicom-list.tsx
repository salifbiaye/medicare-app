'use client'

import { useState } from 'react'
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Calendar, User } from "lucide-react"
import Link from "next/link"

interface SharedDicomListProps {
  sharedDicoms: {
    id: string
    sharingDate: Date
    dicomImage: {
      id: string
      orthanc_id: string
      type: string
      description?: string | null
      uploadDate: Date
    }
    sourceDoctor: {
      id: string
      user: {
        name: string
      }
    }
  }[]
}

export function SharedDicomList({ sharedDicoms }: SharedDicomListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {sharedDicoms.length === 0 ? (
        <Card className="col-span-full">
          <CardContent className="pt-6 text-center text-muted-foreground">
            Aucune image DICOM partagée avec vous pour le moment.
          </CardContent>
        </Card>
      ) : (
        sharedDicoms.map((shared) => (
          <Card key={shared.id} className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg">Image DICOM</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {shared.dicomImage.type}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-2 text-sm">
                  <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Partagé par</p>
                    <p className="text-muted-foreground">{shared.sourceDoctor.user.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-sm">
                  <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Date de partage</p>
                    <p className="text-muted-foreground">
                      {format(new Date(shared.sharingDate), "PPP", { locale: fr })}
                    </p>
                  </div>
                </div>

                {shared.dicomImage.description && (
                  <p className="text-sm text-muted-foreground">
                    {shared.dicomImage.description}
                  </p>
                )}

                <div className="pt-4">
                  <Link href={`/doctor/dicom-viewer?id=${shared.dicomImage.orthanc_id}`}>
                    <Button className="w-full gap-2">
                      <Eye className="h-4 w-4" />
                      Visualiser
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
} 