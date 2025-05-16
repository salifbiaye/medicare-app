import { NextResponse } from 'next/server';

// URL du serveur Orthanc
const ORTHANC_SERVER_URL = 'http://localhost:8042';

export async function GET(request: Request) {
  console.log("Vérification de la disponibilité du serveur Orthanc");
  
  try {
    // Ajouter un timeout pour éviter les attentes trop longues
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 secondes de timeout
    
    const response = await fetch(`${ORTHANC_SERVER_URL}/system`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`Serveur Orthanc non disponible: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      return new NextResponse(errorText, {
        status: response.status,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }

    console.log("Serveur Orthanc disponible");
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erreur de connexion à Orthanc :", error);
    
    // Message d'erreur spécifique pour le timeout
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Délai d\'attente dépassé lors de la connexion au serveur Orthanc' },
        { status: 504 }
      );
    }
    
    return NextResponse.json(
      { error: 'Erreur de connexion à Orthanc', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// Route pour récupérer la liste des instances
export async function POST(request: Request) {
  try {
    const { path, method = 'GET', body } = await request.json();
    
    if (!path) {
      return NextResponse.json(
        { error: 'Le paramètre "path" est requis' },
        { status: 400 }
      );
    }

    console.log(`Requête Orthanc: ${method} ${path}`);
    const url = `${ORTHANC_SERVER_URL}${path}`;
    
    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    };

    // Ajouter le body si nécessaire
    if (body && (method === 'POST' || method === 'PUT')) {
      if (typeof body === 'object') {
        fetchOptions.headers = {
          ...fetchOptions.headers,
          'Content-Type': 'application/json',
        };
        fetchOptions.body = JSON.stringify(body);
      } else {
        fetchOptions.body = body;
      }
    }

    const response = await fetch(url, fetchOptions);

    // Si la réponse est un fichier binaire (comme un fichier DICOM)
    const contentType = response.headers.get('Content-Type');
    if (contentType && (contentType.includes('application/dicom') || contentType.includes('application/octet-stream'))) {
      const buffer = await response.arrayBuffer();
      console.log(`Fichier binaire récupéré: ${buffer.byteLength} octets`);
      return new NextResponse(buffer, {
        status: response.status,
        headers: {
          'Content-Type': contentType,
        },
      });
    }

    // Pour les réponses JSON
    if (!response.ok) {
      console.error(`Erreur Orthanc: ${response.status} ${response.statusText}`);
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
  } catch (error) {
    console.error("Erreur lors de la requête à Orthanc :", error);
    return NextResponse.json(
      { error: 'Erreur lors de la requête à Orthanc', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 