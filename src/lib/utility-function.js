// Funzione per formattare le date nel formato 'gg MMM aaaa'
export function formatDate(dateString) {
    if (!dateString) return '';
    
    const mesi = [
        'GEN', 'FEB', 'MAR', 'APR', 'MAG', 'GIU',
        'LUG', 'AGO', 'SET', 'OTT', 'NOV', 'DIC'
    ];
    
    try {
        const date = new Date(dateString);
        
        // Verifica che la data sia valida
        if (isNaN(date.getTime())) {
            return dateString; // Restituisce la stringa originale se non è una data valida
        }
        
        const giorno = date.getDate().toString().padStart(2, '0');
        const mese = mesi[date.getMonth()];
        const anno = date.getFullYear();
        
        return `${giorno} ${mese} ${anno}`;
    } catch (error) {
        console.warn('Errore nella formattazione della data:', error);
        return dateString; // Fallback alla stringa originale
    }
}

export function formatDateBadge(dateString) {
    if (!dateString) return null;
    
    const mesi = [
        'GEN', 'FEB', 'MAR', 'APR', 'MAG', 'GIU',
        'LUG', 'AGO', 'SET', 'OTT', 'NOV', 'DIC'
    ];
    
    try {
        const date = new Date(dateString);
        
        // Verifica che la data sia valida
        if (isNaN(date.getTime())) {
            return null;
        }
        
        return {
            giorno: date.getDate().toString().padStart(2, '0'),
            mese: mesi[date.getMonth()],
            anno: date.getFullYear()
        };
    } catch (error) {
        console.warn('Errore nella formattazione della data:', error);
        return null;
    }
}


export function getStrapiMediaUrl(mediaUrlString) {
    if (!mediaUrlString) return '';

    const mediaUrl = String(mediaUrlString).trim();

    if (/^https?:\/\//i.test(mediaUrl)) {
        return mediaUrl;
    }

    if (mediaUrl.startsWith('//')) {
        return `https:${mediaUrl}`;
    }

    const baseUrl = String(import.meta.env.STRAPI_URL || import.meta.env.STRAPI_API_URL || '').replace(/\/+$/, '');
    const normalizedPath = mediaUrl.startsWith('/') ? mediaUrl : `/${mediaUrl}`;

    return `${baseUrl}${normalizedPath}`;
}

/**
 * Ottiene l'URL di un'immagine Strapi nel formato richiesto con fallback automatico
 * @param {Object} image - L'oggetto media di Strapi
 * @param {string} requestedFormat - Il formato richiesto ('large', 'medium', 'small', 'thumbnail')
 * @returns {string} L'URL completo dell'immagine nel formato disponibile
 */
export function getImageFormat(image, requestedFormat) {
    if (!image) return '';
    
    // Se non ci sono formati disponibili, restituisci l'immagine originale
    if (!image.formats) {
        return getStrapiMediaUrl(image.url);
    }

    // Definisce l'ordine dei formati dal più grande al più piccolo
    const formatOrder = ['large', 'medium', 'small', 'thumbnail'];
    
    // Trova l'indice del formato richiesto
    const startIndex = formatOrder.indexOf(requestedFormat);
    
    // Se il formato richiesto non è valido, restituisci l'originale
    if (startIndex === -1) {
        return getStrapiMediaUrl(image.url);
    }
    
    // Cerca il formato richiesto e poi i fallback successivi (più piccoli)
    for (let i = startIndex; i < formatOrder.length; i++) {
        const currentFormat = formatOrder[i];
        if (image.formats[currentFormat]) {
            return getStrapiMediaUrl(image.formats[currentFormat].url);
        }
    }
    
    // Se nessun formato è disponibile, restituisci l'immagine originale
    return getStrapiMediaUrl(image.url);
}
