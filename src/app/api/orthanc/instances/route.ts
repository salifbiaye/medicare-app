import { NextResponse } from 'next/server';

// URL du serveur Orthanc
const ORTHANC_SERVER_URL = 'http://localhost:8042';

// Récupérer la liste des instances
export async function GET(request: Request) {
  console.log("Récupération de la liste des instances DICOM");
  
  try {
    // Vérifier d'abord que le serveur Orthanc est disponible
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 secondes de timeout
      
      const checkResponse = await fetch(`${ORTHANC_SERVER_URL}/system`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        cache: 'no-store',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!checkResponse.ok) {
        console.error(`Serveur Orthanc non disponible: ${checkResponse.status} ${checkResponse.statusText}`);
        return NextResponse.json(
          { error: 'Le serveur Orthanc n\'est pas disponible' },
          { status: 503 }
        );
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du serveur Orthanc:", error);
      
      if (error instanceof Error && error.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Délai d\'attente dépassé lors de la connexion au serveur Orthanc' },
          { status: 504 }
        );
      }
      
      return NextResponse.json(
        { error: 'Impossible de se connecter au serveur Orthanc', details: error instanceof Error ? error.message : String(error) },
        { status: 503 }
      );
    }
    
    const response = await fetch(`${ORTHANC_SERVER_URL}/instances`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`Erreur lors de la récupération des instances: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      return new NextResponse(errorText, {
        status: response.status,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }

    const data = await response.json();
    console.log(`${data.length} instances DICOM récupérées`);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erreur lors de la récupération des instances :", error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des instances', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// Télécharger une instance DICOM
export async function POST(request: Request) {
  console.log("Téléchargement d'une instance DICOM");
  
  try {
    // Vérifier d'abord que le serveur Orthanc est disponible
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 secondes de timeout
      
      const checkResponse = await fetch(`${ORTHANC_SERVER_URL}/system`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        cache: 'no-store',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!checkResponse.ok) {
        console.error(`Serveur Orthanc non disponible: ${checkResponse.status} ${checkResponse.statusText}`);
        return NextResponse.json(
          { error: 'Le serveur Orthanc n\'est pas disponible' },
          { status: 503 }
        );
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du serveur Orthanc:", error);
      
      if (error instanceof Error && error.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Délai d\'attente dépassé lors de la connexion au serveur Orthanc' },
          { status: 504 }
        );
      }
      
      return NextResponse.json(
        { error: 'Impossible de se connecter au serveur Orthanc', details: error instanceof Error ? error.message : String(error) },
        { status: 503 }
      );
    }
    
    // Récupérer le fichier DICOM depuis la requête
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      console.error("Aucun fichier DICOM fourni dans la requête");
      return NextResponse.json(
        { error: 'Aucun fichier DICOM fourni' },
        { status: 400 }
      );
    }

    console.log(`Fichier reçu: ${file.size} octets`);

    // Convertir le blob en ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Envoyer le fichier DICOM à Orthanc
    const response = await fetch(`${ORTHANC_SERVER_URL}/instances`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/dicom',
      },
      body: arrayBuffer,
    });

    if (!response.ok) {
      console.error(`Erreur lors du téléchargement vers Orthanc: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      return new NextResponse(errorText, {
        status: response.status,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }

    const data = await response.json();
    console.log(`Instance DICOM téléchargée avec succès, ID: ${data.ID}`);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erreur lors du téléchargement de l'instance DICOM :", error);
    return NextResponse.json(
      { error: 'Erreur lors du téléchargement de l\'instance DICOM', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 