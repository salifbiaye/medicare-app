'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, RefreshCw, AlertCircle, Image, ScanLine } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSearchParams, useRouter } from 'next/navigation';
import { AnimatedHeader, AnimatedLayout } from "@/components/animations/animated-layout"
import { ParticlesBackground } from "@/components/animations/particles-background"

// Étendre l'interface Window pour TypeScript
declare global {
    interface Window {
        dicomParser: any;
    }
}

// URL de l'API
const API_URL = '/api/orthanc';

// Interface pour les objets Orthanc
interface OrthancInstance {
    ID: string;
    Path: string;
    ParentSeries: string;
    ParentStudy: string;
    ParentPatient: string;
    FileSize: number;
    FileUuid: string;
    IndexInSeries: number;
    MainDicomTags: {
        InstanceNumber: string;
        SOPInstanceUID: string;
        [key: string]: string;
    };
    Type: string;
}

// Import SimpleDicomViewer instead of CornerstoneViewer
const SimpleDicomViewer = dynamic(
  () => import('@/features/doctor/dicomviewer/SimpleDicomViewer'),
  { ssr: false, loading: () => <div className="p-12 text-center">Chargement du visualiseur DICOM...</div> }
);

const DicomViewerPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dicomId = searchParams.get('id');
    
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [orthancInstances, setOrthancInstances] = useState<OrthancInstance[]>([]);
    const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
    const [dicomFile, setDicomFile] = useState<File | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [serverStatus, setServerStatus] = useState<'available' | 'unavailable' | 'checking'>('checking');

    // Pré-remplir la recherche avec l'ID fourni dans l'URL
    useEffect(() => {
        if (dicomId) {
            setSearchTerm(dicomId);
        }
    }, [dicomId]);

    // Vérifier si le serveur Orthanc est disponible
    const checkOrthancServer = async () => {
        try {
            setServerStatus('checking');
            
            const response = await fetch(API_URL);
            
            if (response.ok) {
                setServerStatus('available');
                return true;
            } else {
                setServerStatus('unavailable');
                const errorData = await response.json().catch(() => ({ error: response.statusText }));
                setError(`Le serveur Orthanc a répondu avec une erreur: ${errorData.error || response.statusText}`);
                return false;
            }
        } catch (err) {
            setServerStatus('unavailable');
            setError(`Impossible de se connecter au serveur Orthanc: ${err instanceof Error ? err.message : String(err)}`);
            return false;
        }
    };

    // Vérifier la disponibilité du serveur au chargement de la page
    useEffect(() => {
        const initializeViewer = async () => {
            const isAvailable = await checkOrthancServer();
            
            if (isAvailable) {
                try {
                    await loadOrthancInstances();
                    
                    // Si un ID est fourni dans l'URL, charger cette instance automatiquement
                    if (dicomId) {
                        console.log("Chargement automatique de l'instance DICOM:", dicomId);
                        await loadDicomInstance(dicomId);
                    }
                } catch (err) {
                    console.error("Erreur lors de l'initialisation du visualiseur:", err);
                    setError(`Erreur lors de l'initialisation du visualiseur: ${err instanceof Error ? err.message : String(err)}`);
                }
            }
        };
        
        initializeViewer();
    }, [dicomId]);

    // Fonction pour charger la liste des instances DICOM depuis Orthanc
    const loadOrthancInstances = async () => {
        if (serverStatus !== 'available') {
            const isAvailable = await checkOrthancServer();
            if (!isAvailable) return;
        }
        
        try {
            setIsLoading(true);
            setError(null);
            
            // Récupérer la liste des instances via l'API
            const response = await fetch('/api/orthanc/instances');
            
            if (!response.ok) {
                throw new Error(`Erreur lors de la récupération des instances: ${response.statusText}`);
            }
            
            const instanceIds = await response.json();
            
            // Récupérer les détails de chaque instance
            const instancesDetails = await Promise.all(
                instanceIds.map(async (id: string) => {
                    try {
                        const detailResponse = await fetch(`/api/orthanc/instances/${id}`);
                        
                        if (!detailResponse.ok) {
                            console.error(`Impossible de récupérer les détails de l'instance ${id}`);
                            return null;
                        }
                        
                        return await detailResponse.json();
                    } catch (err) {
                        console.error(`Erreur pour l'instance ${id}:`, err);
                        return null;
                    }
                })
            );
            
            // Filtrer les instances nulles (en cas d'erreur)
            const validInstances = instancesDetails.filter(instance => instance !== null);
            setOrthancInstances(validInstances);
        } catch (err) {
            console.error("Erreur lors du chargement des instances:", err);
            setError(`Erreur lors du chargement des instances: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Charger les instances au chargement de la page et quand refreshTrigger change
    useEffect(() => {
        if (serverStatus === 'available') {
            loadOrthancInstances();
        }
    }, [refreshTrigger, serverStatus]);

    // Fonction pour actualiser la liste
    const refreshInstancesList = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    // Fonction pour reconnecter au serveur Orthanc
    const reconnectToOrthancServer = async () => {
        const isAvailable = await checkOrthancServer();
        if (isAvailable) {
            loadOrthancInstances();
        }
    };


    const loadDicomInstance = async (instanceId: string) => {


        try {
            setIsLoading(true);
            setSelectedInstanceId(instanceId);
            setError(null); // Réinitialiser les erreurs précédentes

            console.log(`Chargement de l'instance DICOM: ${instanceId}`);

            // Vérifier d'abord si l'instance existe
            try {
                const checkResponse = await fetch(`/api/orthanc/instances/${instanceId}`);

                if (!checkResponse.ok) {
                    throw new Error(`L'instance DICOM ${instanceId} n'existe pas ou n'est pas accessible.`);
                }
            } catch (checkErr) {
                // Ne pas afficher d'erreur de serveur si on arrive à contacter l'API
                if (checkErr instanceof Error && !checkErr.message.includes("n'existe pas")) {
                    console.error("Erreur lors de la vérification de l'instance:", checkErr);
                    throw new Error(`Impossible de vérifier l'existence de l'instance DICOM: ${checkErr instanceof Error ? checkErr.message : String(checkErr)}`);
                } else {
                    throw checkErr; // Propager l'erreur si c'est une erreur d'instance non trouvée
                }
            }

            // Récupérer le fichier DICOM via l'API
            const response = await fetch(`/api/orthanc/instances/${instanceId}?file=true`);

            if (!response.ok) {
                throw new Error(`Erreur lors de la récupération du fichier: ${response.statusText}`);
            }

            const blob = await response.blob();
            const file = new File([blob], `orthanc-${instanceId}.dcm`, { type: 'application/dicom' });

            setDicomFile(file);

            // Passer le fichier au visualiseur
            if (file) {
                setSelectedFiles([file]);

                // Utiliser directement le processFile du SimpleDicomViewer
                const fileInput = document.querySelector('#dicom-file-input') as HTMLInputElement;
                if (fileInput) {
                    // Créer un objet FileList contenant notre fichier
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    fileInput.files = dataTransfer.files;

                    // Déclencher l'événement change manuellement
                    const event = new Event('change', { bubbles: true });
                    fileInput.dispatchEvent(event);
                }
            }
        } catch (err) {
            console.error("Erreur lors du chargement du fichier DICOM:", err);
            setError(`Erreur lors du chargement du fichier DICOM: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Fonction pour gérer le chargement de fichiers
    const handleFilesLoad = async (files: File[]) => {
        console.log("Fichiers chargés:", files);
        
        try {
            if (files && files.length > 0) {
                console.log(`Chargé ${files.length} fichier(s):`, files.map(f => f.name).join(', '));
                setSelectedFiles(files);
                setError(null); // Réinitialiser les erreurs précédentes
                
                // Upload the file to Orthanc server via API
                const formData = new FormData();
                formData.append('file', files[0]);
                
                setIsLoading(true);
                
                try {
                    const response = await fetch('/api/orthanc/instances', {
                        method: 'POST',
                        body: formData,
                    });
                    
                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({ error: response.statusText }));
                        throw new Error(`Erreur lors de l'upload: ${errorData.error || response.statusText}`);
                    }
                    
                    const result = await response.json();
                    console.log("Fichier DICOM uploadé avec succès:", result);
                    
                    // Refresh the instances list to show the newly uploaded file
                    refreshInstancesList();
                    
                    // If the upload was successful and returned an ID, select that instance
                    if (result && result.ID) {
                        loadDicomInstance(result.ID);
                    }
                } catch (uploadError) {
                    console.error("Erreur lors de l'upload du fichier DICOM:", uploadError);
                    setError(`Erreur lors de l'upload du fichier DICOM: ${uploadError instanceof Error ? uploadError.message : String(uploadError)}`);
                } finally {
                    setIsLoading(false);
                }
            } else {
                console.warn("Aucun fichier n'a été chargé");
                setSelectedFiles([]);
            }
        } catch (e) {
            console.error("Erreur lors du traitement des fichiers chargés:", e);
            setError(`Erreur lors du traitement des fichiers: ${e instanceof Error ? e.message : String(e)}`);
        }
    };

    // Filtrer les instances en fonction du terme de recherche
    const filteredInstances = orthancInstances.filter(instance => {
        const searchLower = searchTerm.toLowerCase();
        // Rechercher dans l'ID et les tags DICOM principaux
        return (
            instance.ID.toLowerCase().includes(searchLower) ||
            (instance.MainDicomTags && 
             Object.values(instance.MainDicomTags).some(value => 
                value && value.toLowerCase().includes(searchLower)
             ))
        );
    });

    // Fonction pour charger directement une instance par son ID depuis la barre de recherche
    const handleSearchById = () => {
        if (!searchTerm.trim()) {
            setError("Veuillez entrer un ID d'instance DICOM");
            return;
        }
        
        // Rediriger vers la même page avec l'ID en paramètre
        router.push(`/doctor/dicom-viewer?id=${searchTerm.trim()}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/80 pb-12 pt-6 dark:from-background dark:to-background/95">
            <div className="px-4">
                <AnimatedLayout>
                    <ParticlesBackground />
                    <AnimatedHeader>
                        <div className="bg-blue-100 dark:bg-blue-100/10 p-3 rounded-full mr-4">
                            <ScanLine className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl text-background dark:text-foreground font-bold tracking-tight">Visualiseur DICOM</h1>
                            <p className="text-background/80 dark:text-foreground/50">Visualisez et analysez les images médicales</p>
                        </div>
                    </AnimatedHeader>
                </AnimatedLayout>

                <div className="mt-8">
                    <div className="container mx-auto p-4">
                        <h1 className="text-3xl font-bold mb-6">Visualiseur d'images médicales DICOM</h1>
                        
                        {/* Alerte de statut du serveur */}
                        {serverStatus === 'unavailable' && (
                            <Alert variant="destructive" className="mb-6">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Serveur Orthanc non disponible</AlertTitle>
                                <AlertDescription>
                                    <p>Impossible de se connecter au serveur Orthanc. Vérifiez que le serveur est en cours d'exécution.</p>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="mt-2" 
                                        onClick={reconnectToOrthancServer}
                                    >
                                        Réessayer la connexion
                                    </Button>
                                </AlertDescription>
                            </Alert>
                        )}
                        
                        {error && (
                            <div className="mb-6">
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Erreur</AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            </div>
                        )}
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Liste des instances DICOM */}
                            <div className="lg:col-span-1">
                                <Card className="h-full">
                                    <CardHeader>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <CardTitle>Images DICOM disponibles</CardTitle>
                                                <CardDescription>
                                                    Sélectionnez une image à visualiser
                                                </CardDescription>
                                            </div>
                                            <Button 
                                                variant="outline" 
                                                size="icon"
                                                onClick={refreshInstancesList}
                                                disabled={isLoading || serverStatus !== 'available'}
                                                title="Actualiser la liste"
                                            >
                                                <RefreshCw className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Input
                                                placeholder="Rechercher par ID..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="flex-1"
                                                disabled={serverStatus !== 'available' || !!dicomId}
                                                readOnly={!!dicomId}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !dicomId) {
                                                        handleSearchById();
                                                    }
                                                }}
                                            />
                                            <Button 
                                                variant="outline" 
                                                size="icon"
                                                onClick={dicomId ? () => router.push('/doctor/dicom-viewer') : handleSearchById}
                                                disabled={(!searchTerm && !dicomId) || serverStatus !== 'available'}
                                                title={dicomId ? "Effacer la recherche" : "Rechercher"}
                                            >
                                                {dicomId ? (
                                                    <RefreshCw className="h-4 w-4" />
                                                ) : (
                                                    <Search className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {serverStatus === 'checking' ? (
                                            <div className="flex flex-col justify-center items-center h-32">
                                                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                                                <p className="text-muted-foreground">Connexion au serveur Orthanc...</p>
                                            </div>
                                        ) : serverStatus === 'unavailable' ? (
                                            <div className="text-center py-8 text-muted-foreground">
                                                <AlertCircle className="h-8 w-8 mx-auto mb-2 text-destructive" />
                                                <p>Serveur Orthanc non disponible</p>
                                            </div>
                                        ) : isLoading && !dicomFile ? (
                                            <div className="flex justify-center items-center h-32">
                                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                            </div>
                                        ) : orthancInstances.length === 0 ? (
                                            <div className="text-center py-8 text-muted-foreground">
                                                Aucune image DICOM disponible sur le serveur
                                            </div>
                                        ) : (
                                            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                                                {filteredInstances.map((instance) => (
                                                    <div 
                                                        key={instance.ID}
                                                        className={`p-3 rounded-md cursor-pointer transition-colors ${
                                                            selectedInstanceId === instance.ID 
                                                            ? 'bg-primary text-primary-foreground' 
                                                            : 'bg-muted hover:bg-muted/80'
                                                        }`}
                                                        onClick={() => loadDicomInstance(instance.ID)}
                                                    >
                                                        <div className="font-medium truncate">
                                                            {instance.MainDicomTags?.SOPInstanceUID || instance.ID.substring(0, 8)}
                                                        </div>
                                                        <div className="text-xs opacity-80 mt-1">
                                                            ID: {instance.ID.substring(0, 8)}...
                                                        </div>
                                                        <div className="text-xs opacity-80">
                                                            Taille: {Math.round(instance.FileSize / 1024)} Ko
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Visualiseur DICOM */}
                            <div className="lg:col-span-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Visualiseur DICOM</CardTitle>
                                        <CardDescription>
                                            {selectedInstanceId 
                                                ? `Visualisation de l'image: ${selectedInstanceId.substring(0, 8)}...` 
                                                : "Sélectionnez une image DICOM dans la liste pour la visualiser"}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {selectedInstanceId ? (
                                            <div id="dicom-container">
                                                {/* Utiliser la clé pour forcer le rechargement du composant quand l'ID change */}
                                                <SimpleDicomViewer 
                                                    key={selectedInstanceId}
                                                    onFilesLoad={handleFilesLoad}
                                                    fileInputId="dicom-file-input"
                                                    hideFileInput={true}
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                                <Image className="h-16 w-16 text-muted-foreground/50 mb-4" />
                                                <h3 className="text-lg font-medium mb-2">Aucune image sélectionnée</h3>
                                                <p className="text-muted-foreground max-w-md">
                                                    Veuillez sélectionner une image DICOM dans la liste à gauche pour la visualiser.
                                                    {orthancInstances.length === 0 && (
                                                        <span className="block mt-2">
                                                            Aucune image DICOM n'est actuellement disponible sur le serveur.
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DicomViewerPage;