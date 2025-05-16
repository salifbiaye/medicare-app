'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Image, ZoomIn, ZoomOut, RotateCw, RotateCcw, Maximize, Minimize, Loader2 } from 'lucide-react';
import './simpleDicomViewer.css';
import { useTheme } from 'next-themes';
import { convertDicomToImage } from "@/features/doctor/dicomviewer/convertDcmToImage";

interface DicomViewerProps {
  onFilesLoad?: (files: File[]) => void;
  fileInputId?: string;
  hideFileInput?: boolean;
}

// Une version simplifiée du viewer DICOM qui ne dépend pas de bibliothèques complexes
export default function SimpleDicomViewer({ onFilesLoad, fileInputId = 'dicom-file-input', hideFileInput = false }: DicomViewerProps) {
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loadedFile, setLoadedFile] = useState<File | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dicomInfo, setDicomInfo] = useState<{ [key: string]: string }>({});

  // Contrôles d'image
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);

  // Gérer le plein écran
  const toggleFullscreen = () => {
    if (!viewerRef.current) return;

    if (!document.fullscreenElement) {
      viewerRef.current.requestFullscreen().catch(err => {
        console.error(`Erreur lors du passage en plein écran: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Surveiller les changements de plein écran
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);

      // Ajuster le zoom en mode plein écran pour remplir l'écran
      if (document.fullscreenElement) {
        setZoom(1.5); // Zoom plus fort en plein écran
      } else {
        setZoom(1); // Revenir au zoom normal
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Gérer le chargement des fichiers
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    processFile(file);
  };

  // Gérer le drag and drop
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    processFile(file);
  };

  // Traiter le fichier DICOM
  const processFile = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setLoadedFile(file);

    try {
      // Notifier le composant parent
      if (onFilesLoad) {
        onFilesLoad([file]);
      }

      // Extraire des informations basiques du fichier pour affichage
      const basicInfo = {
        'Nom du fichier': file.name,
        'Taille': `${(file.size / 1024).toFixed(2)} Ko`,
        'Type': file.type || 'application/dicom',
        'Date de dernière modification': new Date(file.lastModified).toLocaleString()
      };

      setDicomInfo(basicInfo);

      // Convertir le fichier DICOM en image JPG pour l'affichage
      const result = await convertDicomToImage(file);
      if (result && result.imageUrl) {
        setImageData(result.imageUrl);
        setDicomInfo({ ...basicInfo, ...result.metadata });
      } else {
        throw new Error('Échec de la conversion du fichier DICOM');
      }

    } catch (err) {
      console.error('Erreur lors du traitement du fichier DICOM:', err);
      setError(`Erreur: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour améliorer l'apparence de l'image
  const applyImageEnhancements = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Récupérer les données de l'image actuelle
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Calculer l'histogramme pour déterminer la plage de valeurs
    const histogram = new Array(256).fill(0);
    for (let i = 0; i < data.length; i += 4) {
      histogram[data[i]]++;
    }

    // Trouver les valeurs min et max significatives (éviter les valeurs extrêmes isolées)
    let min = 0;
    let max = 255;

    // Ignorer les valeurs très rares (moins de 0.01% des pixels)
    const threshold = (width * height) * 0.0001;
    let sum = 0;

    // Trouver la valeur min significative
    for (let i = 0; i < 256; i++) {
      sum += histogram[i];
      if (sum > threshold) {
        min = i;
        break;
      }
    }

    // Trouver la valeur max significative
    sum = 0;
    for (let i = 255; i >= 0; i--) {
      sum += histogram[i];
      if (sum > threshold) {
        max = i;
        break;
      }
    }

    // Éviter la division par zéro
    if (max === min) max = min + 1;

    // Étirer l'histogramme pour améliorer le contraste
    for (let i = 0; i < data.length; i += 4) {
      // Normaliser la valeur
      const value = Math.max(0, Math.min(255, Math.round(
        255 * (data[i] - min) / (max - min)
      )));

      // Appliquer la même valeur aux canaux RGB
      data[i] = value;
      data[i + 1] = value;
      data[i + 2] = value;
    }

    // Mettre à jour l'image
    ctx.putImageData(imageData, 0, 0);
  };

  // Charger un exemple de fichier DICOM
  const loadSampleDicom = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // URL de l'exemple de fichier DICOM
      const sampleUrl = '/assets/test.dcm';

      try {
        // Essayer de télécharger le fichier
        const response = await fetch(sampleUrl);
        if (response.ok) {
          const blob = await response.blob();
          const file = new File([blob], 'sample.dcm', { type: 'application/dicom' });
          await processFile(file);
          return;
        }
      } catch (fetchError) {
        console.warn("Échec du chargement du fichier d'exemple:", fetchError);
      }

      // Si le fichier n'existe pas, créer une image factice
      createFakeDicomImage();

    } catch (err) {
      console.error('Erreur lors du chargement de l\'exemple:', err);
      setError(`Erreur: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Créer une image DICOM factice
  const createFakeDicomImage = () => {
    const fakeFile = new File([], 'example.dcm', { type: 'application/dicom' });
    setLoadedFile(fakeFile);

    if (onFilesLoad) {
      onFilesLoad([fakeFile]);
    }

    // Créer des informations de base
    const basicInfo = {
      'Nom du fichier': 'exemple.dcm',
      'Taille': '10.24 Ko',
      'Type': 'application/dicom',
      'Date de dernière modification': new Date().toLocaleString()
    };

    setDicomInfo(basicInfo);

    // Créer une image factice
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Utiliser des couleurs en fonction du thème
      const isDark = theme === 'dark';
      const bgColor = isDark ? '#1a1a1a' : '#f0f0f0'; 
      const gridColor = isDark ? '#333333' : '#cccccc';
      const textColor = isDark ? '#ffffff' : '#000000';
      
      // Fond
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grille
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      
      // Dessiner la grille
      for (let i = 0; i < canvas.width; i += 32) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      
      for (let i = 0; i < canvas.height; i += 32) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Texte
      ctx.fillStyle = textColor;
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Exemple d\'image DICOM', canvas.width / 2, 50);
      ctx.fillText('Cliquez sur "Choisir un fichier" pour charger', canvas.width / 2, canvas.height / 2 - 20);
      ctx.fillText('votre propre fichier DICOM', canvas.width / 2, canvas.height / 2 + 20);

      // Ajouter un cercle au centre pour simuler un "objet"
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2 + 100, 80, 0, Math.PI * 2);
      ctx.strokeStyle = isDark ? '#6f6fff' : '#0000ff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Ajouter des informations médicales simulées
      ctx.font = '14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('Patient ID: EXEMPLE-12345', 20, canvas.height - 100);
      ctx.fillText('Date: ' + new Date().toISOString().split('T')[0], 20, canvas.height - 80);
      ctx.fillText('Modalité: MR', 20, canvas.height - 60);
      ctx.fillText('Appareil: SIMULATEUR-1000', 20, canvas.height - 40);

      // Convertir le canvas en image
      const imageUrl = canvas.toDataURL('image/jpeg', 0.95);
      setImageData(imageUrl);
    }
  };

  // Fonctions de contrôle d'image
  const zoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const rotateClockwise = () => setRotation(prev => prev + 90);
  const rotateCounterClockwise = () => setRotation(prev => prev - 90);
  const resetView = () => {
    setZoom(1);
    setRotation(0);
  };

  return (
    <Card className="w-full overflow-hidden border-none bg-background shadow-md">
      <CardContent className="p-4">
        {loadedFile ? (
          <div
            ref={containerRef}
            className={`relative rounded-lg ${isFullscreen ? 'fullscreen-container' : ''}`}
          >
            {/* Contrôles en haut */}
            {!hideFileInput && (
              <div className="flex flex-wrap gap-2 mb-4">
                <Button
                  variant="default"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Ouvrir fichier DICOM
                </Button>

                <Button
                  variant="outline"
                  onClick={loadSampleDicom}
                  disabled={isLoading}
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  <Image className="mr-2 h-4 w-4" />
                  Charger l'exemple
                </Button>
              </div>
            )}

            {/* Contrôles d'image */}
            {loadedFile && imageData && !isLoading && (
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 mb-4">
                <Button
                  variant="outline"
                  onClick={zoomIn}
                  className="bg-muted/50 hover:bg-primary/20"
                >
                  <ZoomIn className="mr-2 h-4 w-4" />
                  Zoom +
                </Button>
                <Button
                  variant="outline"
                  onClick={zoomOut}
                  className="bg-muted/50 hover:bg-primary/20"
                >
                  <ZoomOut className="mr-2 h-4 w-4" />
                  Zoom -
                </Button>
                <Button
                  variant="outline"
                  onClick={rotateClockwise}
                  className="bg-muted/50 hover:bg-primary/20"
                >
                  <RotateCw className="mr-2 h-4 w-4" />
                  Rotation +
                </Button>
                <Button
                  variant="outline"
                  onClick={rotateCounterClockwise}
                  className="bg-muted/50 hover:bg-primary/20"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Rotation -
                </Button>
                <Button
                  variant="outline"
                  onClick={resetView}
                  className="bg-muted/50 hover:bg-primary/20"
                >
                  <Maximize className="mr-2 h-4 w-4" />
                  Réinitialiser
                </Button>
                <Button
                  variant={isFullscreen ? "default" : "outline"}
                  onClick={toggleFullscreen}
                  className={isFullscreen ? "bg-primary" : "bg-muted/50 hover:bg-primary/20"}
                >
                  <Maximize className="mr-2 h-4 w-4" />
                  Plein écran
                </Button>
              </div>
            )}

            <div
              ref={viewerRef}
              className={`dicom-viewer-container ${isFullscreen ? 'fullscreen-viewer' : ''}`}
            >
              {imageData ? (
                <div className="dicom-image-container">
                  <img
                    src={imageData}
                    alt="DICOM"
                    className="dicom-image"
                    style={{
                      transform: `scale(${zoom}) rotate(${rotation}deg)`,
                      transition: 'transform 0.3s ease',
                      maxWidth: '100%',
                      maxHeight: '100%'
                    }}
                  />
                  <div className="zoom-controls">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={zoomIn}
                      className="h-8 w-8 rounded-full bg-primary/20 hover:bg-primary/40 border-primary/50"
                      title="Zoom avant"
                    >
                      <ZoomIn size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={zoomOut}
                      className="h-8 w-8 rounded-full bg-primary/20 hover:bg-primary/40 border-primary/50"
                      title="Zoom arrière"
                    >
                      <ZoomOut size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={rotateClockwise}
                      className="h-8 w-8 rounded-full bg-primary/20 hover:bg-primary/40 border-primary/50"
                      title="Rotation horaire"
                    >
                      <RotateCw size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={rotateCounterClockwise}
                      className="h-8 w-8 rounded-full bg-primary/20 hover:bg-primary/40 border-primary/50"
                      title="Rotation anti-horaire"
                    >
                      <RotateCcw size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={resetView}
                      className="h-8 w-8 rounded-full bg-primary/20 hover:bg-primary/40 border-primary/50"
                      title="Réinitialiser"
                    >
                      <Image size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleFullscreen}
                      className="h-8 w-8 rounded-full bg-primary/20 hover:bg-primary/40 border-primary/50"
                      title="Plein écran"
                    >
                      {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="dicom-image-container flex items-center justify-center">
                  <div className="text-muted-foreground text-center">
                    {isLoading ? 'Chargement de l\'image...' : 'Aucune image à afficher'}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 rounded-md bg-muted/40 p-4">
              <h3 className="mb-2 text-lg font-semibold">Informations sur le fichier</h3>
              <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                {Object.entries(dicomInfo).map(([key, value]) => (
                  <div key={key} className="text-sm">
                    <span className="font-medium">{key}:</span> <span className="text-muted-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div 
            className="dicom-drop-zone" 
            onDragOver={(e) => e.preventDefault()}
            onDrop={hideFileInput ? undefined : handleDrop}
            onClick={hideFileInput ? undefined : () => fileInputRef.current?.click()}
            style={{ height: '400px' }}
          >
            {!hideFileInput ? (
              <>
                <Upload size={48} className="mb-4 text-muted-foreground" />
                <p className="text-lg font-medium">Déposez un fichier DICOM ici ou cliquez pour sélectionner</p>
                <p className="text-sm text-muted-foreground mt-2">Format pris en charge: .dcm, .dicom</p>
                <div className="mt-4 flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="border-primary text-primary hover:bg-primary/10"
                  >
                    Choisir un fichier
                  </Button>
                  <Button
                    variant="default"
                    onClick={(e) => {
                      e.stopPropagation();
                      loadSampleDicom();
                    }}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Charger un exemple
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-muted-foreground mb-4" />
                <p className="text-lg font-medium">Chargement de l'image DICOM...</p>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              id={fileInputId}
              className="hidden"
              accept=".dcm,.dicom,application/dicom"
              onChange={handleFileChange}
            />
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-md bg-destructive/10 p-4 text-destructive">
            <p>{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}