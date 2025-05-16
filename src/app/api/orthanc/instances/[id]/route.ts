import { NextResponse } from 'next/server';

// URL du serveur Orthanc
const ORTHANC_SERVER_URL = 'http://localhost:8042';

// Récupérer les détails d'une instance
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const param = await params
    const id = await param.id;
    
    console.log(`Récupération de l'instance DICOM avec ID: ${id}`);
    
    // Vérifier si on demande le fichier DICOM ou les métadonnées
    const url = new URL(request.url);
    const isFileRequest = url.searchParams.get('file') === 'true';
    
    // Vérifier d'abord que le serveur Orthanc est disponible
    try {
      const checkResponse = await fetch(`${ORTHANC_SERVER_URL}/system`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        cache: 'no-store',
      });
      
      if (!checkResponse.ok) {
        console.error(`Serveur Orthanc non disponible: ${checkResponse.status} ${checkResponse.statusText}`);
        return NextResponse.json(
          { error: 'Le serveur Orthanc n\'est pas disponible' },
          { status: 503 }
        );
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du serveur Orthanc:", error);
      return NextResponse.json(
        { error: 'Impossible de se connecter au serveur Orthanc', details: error instanceof Error ? error.message : String(error) },
        { status: 503 }
      );
    }
    
    if (isFileRequest) {
      console.log(`Récupération du fichier DICOM pour l'instance: ${id}`);
      // Récupérer le fichier DICOM
      const response = await fetch(`${ORTHANC_SERVER_URL}/instances/${id}/file`, {
        method: 'GET',
        cache: 'no-store',
      });

      if (!response.ok) {
        console.error(`Erreur lors de la récupération du fichier DICOM: ${response.status} ${response.statusText}`);
        const errorText = await response.text();
        return new NextResponse(errorText, {
          status: response.status,
          headers: {
            'Content-Type': 'text/plain',
          },
        });
      }

      // Récupérer le contenu binaire
      const buffer = await response.arrayBuffer();
      console.log(`Fichier DICOM récupéré avec succès, taille: ${buffer.byteLength} octets`);
      
      // Retourner le fichier DICOM
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/dicom',
          'Content-Disposition': `attachment; filename="orthanc-${id}.dcm"`,
        },
      });
    } else {
      console.log(`Récupération des métadonnées pour l'instance: ${id}`);
      // Récupérer les métadonnées de l'instance
      const response = await fetch(`${ORTHANC_SERVER_URL}/instances/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        console.error(`Erreur lors de la récupération des métadonnées: ${response.status} ${response.statusText}`);
        const errorText = await response.text();
        return new NextResponse(errorText, {
          status: response.status,
          headers: {
            'Content-Type': 'text/plain',
          },
        });
      }

      const data = await response.json();
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de l'instance :", error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'instance', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// Supprimer une instance
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const response = await fetch(`${ORTHANC_SERVER_URL}/instances/${id}`, {
      method: 'DELETE',
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new NextResponse(errorText, {
        status: response.status,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'instance :", error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'instance', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 