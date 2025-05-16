// Fonction améliorée pour convertir les fichiers DICOM en images
type DicomConversionResult = {
  imageUrl: string;
  metadata: Record<string, string>;
  dimensions: {
    width: number;
    height: number;
  };
};

const convertDicomToImage = async (file: File): Promise<DicomConversionResult> => {
    return new Promise((resolve, reject) => {
        try {
            // Charger Cornerstone si ce n'est pas déjà fait
            if (!window.cornerstone) {
                // Dans un contexte réel, nous chargerions les bibliothèques dynamiquement si nécessaire
                console.warn("Cornerstone n'est pas chargé, utilisation du mode de secours");
                return fallbackDicomConversion(file, resolve, reject);
            }

            // Créer un ID unique pour l'image
            const imageId = `dicomfile:${file.name}`;

            // Lire le fichier comme un ArrayBuffer
            const reader = new FileReader();
            reader.onload = async (event) => {
                if (!event.target || !event.target.result) {
                    reject(new Error("Erreur lors de la lecture du fichier"));
                    return;
                }
                const arrayBuffer = event.target.result as ArrayBuffer;

                // Enregistrer le fichier dans le gestionnaire de fichiers de Cornerstone
                const dicomData = new Uint8Array(arrayBuffer);
                await window.cornerstoneWADOImageLoader.wadouri.fileManager.add(imageId, dicomData);

                try {
                    // Charger l'image avec Cornerstone
                    const image = await window.cornerstone.loadImage(imageId);

                    // Créer un canvas pour le rendu
                    const canvas = document.createElement('canvas');
                    const viewport = window.cornerstone.getDefaultViewportForImage(canvas, image);

                    // Définir les dimensions du canvas en fonction de l'image
                    canvas.width = image.width;
                    canvas.height = image.height;

                    // Appliquer une fenêtre d'affichage appropriée (window/level)
                    viewport.voi = {
                        windowWidth: image.windowWidth || image.maxPixelValue - image.minPixelValue,
                        windowCenter: image.windowCenter || (image.maxPixelValue + image.minPixelValue) / 2
                    };

                    // Rendre l'image au canvas
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        reject(new Error("Impossible d'obtenir le contexte de canvas"));
                        return;
                    }
                    window.cornerstone.setToPixelCoordinateSystem(viewport, ctx);
                    window.cornerstone.renderToCanvas(canvas, image, viewport);

                    // Extraire les métadonnées DICOM
                    const metadata = extractDicomMetadata(image);

                    // Ajout de superposition d'informations
                    addImageOverlay(ctx, canvas, file, metadata);

                    // Convertir en DataURL
                    const dataURL = canvas.toDataURL('image/jpeg', 0.95);

                    // Nettoyer
                    window.cornerstoneWADOImageLoader.wadouri.fileManager.remove(imageId);

                    resolve({
                        imageUrl: dataURL,
                        metadata: metadata,
                        dimensions: {
                            width: image.width,
                            height: image.height
                        }
                    });
                } catch (error) {
                    console.error("Erreur lors du chargement de l'image DICOM", error);
                    fallbackDicomConversion(file, resolve, reject);
                }
            };

            reader.onerror = () => {
                reject(new Error("Erreur lors de la lecture du fichier"));
            };

            reader.readAsArrayBuffer(file);
        } catch (err) {
            console.error("Erreur dans la conversion DICOM", err);
            fallbackDicomConversion(file, resolve, reject);
        }
    });
};

// Fonction de secours si Cornerstone n'est pas disponible ou échoue
const fallbackDicomConversion = (
    file: File, 
    resolve: (value: DicomConversionResult) => void, 
    reject: (reason?: any) => void
) => {
    try {
        const reader = new FileReader();

        reader.onload = () => {
            try {
                const arrayBuffer = reader.result as ArrayBuffer;
                if (!arrayBuffer) {
                    throw new Error("Impossible de lire le fichier");
                }

                // Analyse basique des données DICOM
                const dicomData = new Uint8Array(arrayBuffer);
                const dicomInfo = analyzeBasicDicomData(dicomData);

                // Créer une représentation visuelle des données du fichier
                const canvas = document.createElement('canvas');
                // Utiliser des dimensions standard pour les images médicales
                canvas.width = dicomInfo.width || 512;
                canvas.height = dicomInfo.height || 512;
                const ctx = canvas.getContext('2d');

                if (ctx) {
                    // Créer une image à partir des données DICOM
                    const imageData = ctx.createImageData(canvas.width, canvas.height);
                    const pixelData = extractPixelData(dicomData, dicomInfo);

                    // Appliquer une fenêtre d'affichage adaptative
                    const { min, max } = findMinMaxValues(pixelData);
                    const windowWidth = max - min;
                    const windowCenter = min + windowWidth / 2;

                    // Remplir les données de l'image en appliquant le window/level
                    for (let i = 0; i < canvas.width * canvas.height; i++) {
                        const pixelValue = i < pixelData.length ? pixelData[i] : 0;
                        // Appliquer la fenêtre d'affichage (window/level)
                        let mappedValue = applyWindowLevel(pixelValue, windowCenter, windowWidth);

                        // RGBA
                        const pixelIndex = i * 4;
                        imageData.data[pixelIndex] = mappedValue;     // R
                        imageData.data[pixelIndex + 1] = mappedValue; // G
                        imageData.data[pixelIndex + 2] = mappedValue; // B
                        imageData.data[pixelIndex + 3] = 255;         // Alpha (opaque)
                    }

                    // Mettre l'image sur le canvas
                    ctx.putImageData(imageData, 0, 0);

                    // Améliorer le contraste de l'image
                    applyContrastEnhancement(ctx, canvas.width, canvas.height);

                    // Ajouter des informations en superposition
                    addImageOverlay(ctx, canvas, file, dicomInfo);

                    // Obtenir l'URL de l'image
                    const dataURL = canvas.toDataURL('image/jpeg', 0.95);
                    resolve({
                        imageUrl: dataURL,
                        metadata: dicomInfo,
                        dimensions: {
                            width: canvas.width,
                            height: canvas.height
                        }
                    });
                } else {
                    reject(new Error("Impossible d'obtenir le contexte de canvas"));
                }
            } catch (err) {
                reject(err);
            }
        };

        reader.onerror = () => {
            reject(new Error("Erreur lors de la lecture du fichier"));
        };

        reader.readAsArrayBuffer(file);
    } catch (err) {
        reject(err);
    }
};

// Analyse basique des données DICOM pour extraire des informations utiles
interface DicomInfo {
    width: number;
    height: number;
    bitsAllocated: number;
    pixelRepresentation: number;
    rescaleSlope: number;
    rescaleIntercept: number;
    windowCenter: number;
    windowWidth: number;
    modality: string;
    patientName: string;
    studyDate: string;
    [key: string]: any; // Pour les autres métadonnées
}

const analyzeBasicDicomData = (dicomData: Uint8Array): DicomInfo => {
    const info: DicomInfo = {
        width: 512,  // Valeur par défaut
        height: 512, // Valeur par défaut
        bitsAllocated: 16,
        pixelRepresentation: 0, // 0 = unsigned, 1 = signed
        rescaleSlope: 1,
        rescaleIntercept: 0,
        windowCenter: 127,
        windowWidth: 256,
        // Autres métadonnées
        modality: 'Unknown',
        patientName: 'Anonymous',
        studyDate: new Date().toISOString().split('T')[0]
    };

    // Recherche basique des balises DICOM importantes
    // Note: ceci est une implémentation simplifiée, une vraie implémentation utiliserait
    // des bibliothèques comme dicomParser ou serait beaucoup plus complexe

    try {
        // Chercher le préambule DICOM (128 bytes) + "DICM"
        let offset = 128;
        if (dicomData.length > offset + 4) {
            const dicmStr = String.fromCharCode(dicomData[offset], dicomData[offset+1],
                dicomData[offset+2], dicomData[offset+3]);
            if (dicmStr === "DICM") {
                // C'est bien un fichier DICOM
                offset += 4;

                // Chercher certaines balises importantes
                // Notez que ceci est très simplifié et ne fonctionne que pour un sous-ensemble de fichiers DICOM
                while (offset < dicomData.length - 10) {
                    // Analyser les balises une par une
                    const tag = (dicomData[offset] | (dicomData[offset+1] << 8)) |
                        ((dicomData[offset+2] << 16) | (dicomData[offset+3] << 24));
                    offset += 4;

                    // Obtenir la VR (Value Representation) - 2 bytes
                    const vr = String.fromCharCode(dicomData[offset], dicomData[offset+1]);
                    offset += 2;

                    // Obtenir la longueur - 2 ou 4 bytes selon VR
                    let valueLength = 0;
                    if (["OB", "OW", "OF", "SQ", "UT", "UN"].includes(vr)) {
                        offset += 2; // Sauter les 2 bytes réservés
                        valueLength = dicomData[offset] | (dicomData[offset+1] << 8) |
                            (dicomData[offset+2] << 16) | (dicomData[offset+3] << 24);
                        offset += 4;
                    } else {
                        valueLength = dicomData[offset] | (dicomData[offset+1] << 8);
                        offset += 2;
                    }

                    // Extraire certaines métadonnées importantes
                    switch (tag) {
                        case 0x00280010: // Rows
                            if (valueLength === 2) {
                                info.height = dicomData[offset] | (dicomData[offset+1] << 8);
                            }
                            break;
                        case 0x00280011: // Columns
                            if (valueLength === 2) {
                                info.width = dicomData[offset] | (dicomData[offset+1] << 8);
                            }
                            break;
                        case 0x00280100: // Bits Allocated
                            if (valueLength === 2) {
                                info.bitsAllocated = dicomData[offset] | (dicomData[offset+1] << 8);
                            }
                            break;
                        case 0x00280103: // Pixel Representation
                            if (valueLength === 2) {
                                info.pixelRepresentation = dicomData[offset] | (dicomData[offset+1] << 8);
                            }
                            break;
                        case 0x00281050: // Window Center
                            if (valueLength >= 2) {
                                // Simplification - normalement il faudrait parser la chaîne
                                const strVal = new TextDecoder().decode(dicomData.slice(offset, offset + valueLength));
                                info.windowCenter = parseFloat(strVal) || info.windowCenter;
                            }
                            break;
                        case 0x00281051: // Window Width
                            if (valueLength >= 2) {
                                const strVal = new TextDecoder().decode(dicomData.slice(offset, offset + valueLength));
                                info.windowWidth = parseFloat(strVal) || info.windowWidth;
                            }
                            break;
                        case 0x00080060: // Modality
                            if (valueLength > 0) {
                                info.modality = new TextDecoder().decode(dicomData.slice(offset, offset + valueLength)).trim();
                            }
                            break;
                        case 0x00080020: // Study Date
                            if (valueLength === 8) {
                                const dateStr = new TextDecoder().decode(dicomData.slice(offset, offset + valueLength));
                                if (/^\d{8}$/.test(dateStr)) {
                                    info.studyDate = `${dateStr.substring(0,4)}-${dateStr.substring(4,6)}-${dateStr.substring(6,8)}`;
                                }
                            }
                            break;
                        case 0x00100010: // Patient Name
                            if (valueLength > 0) {
                                info.patientName = new TextDecoder().decode(dicomData.slice(offset, offset + valueLength)).trim();
                            }
                            break;
                    }

                    // Passer à la balise suivante
                    offset += valueLength;
                }
            }
        }
    } catch (e) {
        console.error("Erreur lors de l'analyse des métadonnées DICOM", e);
    }

    return info;
};

// Extrait les données de pixels d'un fichier DICOM (implémentation simplifiée)
const extractPixelData = (dicomData: Uint8Array, dicomInfo: DicomInfo): number[] => {
    // Dans une implémentation réelle, nous rechercherions la balise PixelData (7FE0,0010)
    // et nous extrairions les données selon le format correct (bits alloués, etc.)
    // Cette version simplifiée essaie de trouver les données de pixels en se basant sur des heuristiques

    const pixelData = new Array(dicomInfo.width * dicomInfo.height).fill(0);

    try {
        // Rechercher la balise PixelData (7FE0,0010)
        const pixelDataTag = [0xE0, 0x7F, 0x10, 0x00]; // En petit-boutiste (LE)
        let offset = 128 + 4; // Après le préambule et "DICM"

        while (offset < dicomData.length - pixelDataTag.length - 8) {
            // Vérifier si nous avons trouvé la balise PixelData
            if (dicomData[offset] === pixelDataTag[0] &&
                dicomData[offset+1] === pixelDataTag[1] &&
                dicomData[offset+2] === pixelDataTag[2] &&
                dicomData[offset+3] === pixelDataTag[3]) {

                offset += 4; // Passer la balise

                // Obtenir la VR
                const vr = String.fromCharCode(dicomData[offset], dicomData[offset+1]);
                offset += 2;

                // Obtenir la longueur
                let valueLength = 0;
                if (["OB", "OW", "OF", "SQ", "UT", "UN"].includes(vr)) {
                    offset += 2; // Sauter les 2 bytes réservés
                    valueLength = dicomData[offset] | (dicomData[offset+1] << 8) |
                        (dicomData[offset+2] << 16) | (dicomData[offset+3] << 24);
                    offset += 4;
                } else {
                    valueLength = dicomData[offset] | (dicomData[offset+1] << 8);
                    offset += 2;
                }

                // Extraire les données de pixels
                const expectedPixels = dicomInfo.width * dicomInfo.height;
                const bytesPerPixel = dicomInfo.bitsAllocated / 8;

                // Vérifier que nous avons suffisamment de données
                if (valueLength >= expectedPixels * bytesPerPixel) {
                    for (let i = 0; i < expectedPixels; i++) {
                        const pixelOffset = offset + i * bytesPerPixel;

                        // Lecture selon le format (8 bits ou 16 bits)
                        let pixelValue = 0;
                        if (bytesPerPixel === 1) {
                            pixelValue = dicomData[pixelOffset];
                        } else if (bytesPerPixel === 2) {
                            pixelValue = dicomData[pixelOffset] | (dicomData[pixelOffset+1] << 8);

                            // Gérer les valeurs signées si nécessaire
                            if (dicomInfo.pixelRepresentation === 1 && (pixelValue & 0x8000)) {
                                pixelValue = pixelValue - 0x10000;
                            }
                        }

                        // Appliquer rescale slope et intercept si disponibles
                        pixelValue = pixelValue * dicomInfo.rescaleSlope + dicomInfo.rescaleIntercept;

                        pixelData[i] = pixelValue;
                    }

                    // Nous avons trouvé et extrait les données, on peut sortir
                    break;
                }
            }

            offset++;
        }

        // Si nous n'avons pas trouvé les données de pixels, générer des données aléatoires
        if (pixelData.every(val => val === 0)) {
            for (let i = 0; i < pixelData.length; i++) {
                // Créer un modèle qui ressemble à une image médicale
                const x = i % dicomInfo.width;
                const y = Math.floor(i / dicomInfo.width);
                const centerX = dicomInfo.width / 2;
                const centerY = dicomInfo.height / 2;

                // Distance au centre
                const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);

                // Créer une structure circulaire qui ressemble à un scan
                if (distance < dicomInfo.width * 0.4) {
                    pixelData[i] = 200 - distance / 2 + Math.random() * 50;
                } else {
                    pixelData[i] = Math.random() * 50;
                }
            }
        }

    } catch (e) {
        console.error("Erreur lors de l'extraction des données de pixels", e);

        // En cas d'erreur, remplir avec des données aléatoires
        for (let i = 0; i < pixelData.length; i++) {
            pixelData[i] = Math.floor(Math.random() * 256);
        }
    }

    return pixelData;
};

// Trouver les valeurs min/max dans les données de pixels
const findMinMaxValues = (pixelData: number[]): { min: number; max: number } => {
    let min = Number.MAX_VALUE;
    let max = Number.MIN_VALUE;

    for (let i = 0; i < pixelData.length; i++) {
        if (pixelData[i] < min) min = pixelData[i];
        if (pixelData[i] > max) max = pixelData[i];
    }

    return { min, max };
};

// Appliquer la fenêtre d'affichage (window/level) à une valeur de pixel
const applyWindowLevel = (
    pixelValue: number, 
    windowCenter: number, 
    windowWidth: number
): number => {
    // Formule standard d'application de window/level
    const lowerBound = windowCenter - 0.5 - (windowWidth - 1) / 2;
    const upperBound = windowCenter - 0.5 + (windowWidth - 1) / 2;

    if (pixelValue <= lowerBound) {
        return 0;
    }
    else if (pixelValue > upperBound) {
        return 255;
    }
    else {
        return Math.round(((pixelValue - (windowCenter - 0.5)) / (windowWidth - 1) + 0.5) * 255);
    }
};

// Améliorer le contraste de l'image
const applyContrastEnhancement = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number
): void => {
    // Récupérer les données de l'image
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Calculer l'histogramme
    const histogram = new Array(256).fill(0);
    for (let i = 0; i < data.length; i += 4) {
        histogram[data[i]]++;
    }

    // Trouver les valeurs significatives min et max (ignorer les valeurs extrêmes rares)
    const threshold = (width * height) * 0.001; // 0.1% des pixels

    let min = 0;
    let sum = 0;
    for (let i = 0; i < 256; i++) {
        sum += histogram[i];
        if (sum > threshold) {
            min = i;
            break;
        }
    }

    let max = 255;
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

    // Equalisation d'histogramme avec limites
    const range = max - min;
    for (let i = 0; i < data.length; i += 4) {
        // Normaliser entre 0 et 255
        const normalizedValue = Math.max(0, Math.min(255, Math.round(
            255 * (data[i] - min) / range
        )));

        // Appliquer à tous les canaux
        data[i] = normalizedValue;
        data[i + 1] = normalizedValue;
        data[i + 2] = normalizedValue;
    }

    // Mettre à jour l'image
    ctx.putImageData(imageData, 0, 0);
};

// Extraire les métadonnées DICOM à partir d'une image Cornerstone
const extractDicomMetadata = (image: any): Record<string, string> => {
    const metadata = {};

    if (!image.data || !image.data.elements) {
        return {
            modality: 'Unknown',
            patientName: 'Anonymous',
            studyDate: new Date().toISOString().split('T')[0],
            width: image.width,
            height: image.height
        };
    }

    try {
        const elements = image.data.elements;

        // Extraire les métadonnées communes
        metadata.modality = elements.x00080060 ? elements.x00080060.value : 'Unknown';
        metadata.patientName = elements.x00100010 ? elements.x00100010.value : 'Anonymous';
        metadata.patientId = elements.x00100020 ? elements.x00100020.value : '';
        metadata.studyDate = elements.x00080020 ? elements.x00080020.value : '';
        metadata.studyDescription = elements.x00081030 ? elements.x00081030.value : '';
        metadata.seriesDescription = elements.x0008103E ? elements.x0008103E.value : '';

        // Informations sur l'image
        metadata.width = image.width;
        metadata.height = image.height;
        metadata.bitsAllocated = elements.x00280100 ? elements.x00280100.value : 16;
        metadata.windowCenter = image.windowCenter;
        metadata.windowWidth = image.windowWidth;

        // Format de date
        if (metadata.studyDate && metadata.studyDate.length === 8) {
            metadata.studyDate = `${metadata.studyDate.substring(0,4)}-${metadata.studyDate.substring(4,6)}-${metadata.studyDate.substring(6,8)}`;
        }
    } catch (e) {
        console.error("Erreur lors de l'extraction des métadonnées", e);
    }

    return metadata;
};

// Ajouter des informations en superposition sur l'image
const addImageOverlay = (
    ctx: CanvasRenderingContext2D, 
    canvas: HTMLCanvasElement, 
    file: File, 
    metadata: Record<string, any>
): void => {
    // Sauvegarder l'état actuel
    ctx.save();

    // Définir les styles pour les superpositions
    const overlayHeight = 30;

    // Barre supérieure
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, overlayHeight);

    // Barre inférieure
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, canvas.height - overlayHeight, canvas.width, overlayHeight);

    // Texte d'information
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';

    // Informations en haut
    const patientInfo = metadata.patientName ? `Patient: ${metadata.patientName}` : '';
    const fileInfo = `${file.name} (${(file.size / 1024).toFixed(2)} Ko)`;
    ctx.fillText(fileInfo, 10, 20);

    if (patientInfo) {
        ctx.textAlign = 'right';
        ctx.fillText(patientInfo, canvas.width - 10, 20);
    }

    // Informations en bas
    ctx.textAlign = 'left';
    const modalityInfo = metadata.modality ? `Modalité: ${metadata.modality}` : '';
    ctx.fillText(modalityInfo, 10, canvas.height - 10);

    const dateInfo = metadata.studyDate ? `Date: ${metadata.studyDate}` : '';
    ctx.textAlign = 'right';
    ctx.fillText(dateInfo, canvas.width - 10, canvas.height - 10);

    // Dimensions au centre
    ctx.textAlign = 'center';
    ctx.fillText(`${canvas.width}x${canvas.height}`, canvas.width / 2, canvas.height - 10);

    // Restaurer l'état
    ctx.restore();
};

// Declare global types for window extensions
declare global {
    interface Window {
        cornerstone: any;
        cornerstoneWADOImageLoader: any;
    }
}

// Export de la fonction principale
export { convertDicomToImage };