// Funzione per tradurre etichette con fallback di sicurezza
export default function customLabel(label, locale = 'it') {
    const data = {  
        'Approfondisci': {
            'it': 'Approfondisci',
            'en': 'Deepen',
            'fr': 'Approfondir',
            'de': 'Vertiefen',
            'sp': 'Profundizar'
        },
        'Esplora ancora': {
            'it': 'Esplora ancora',
            'en': 'Explore more',
            'fr': 'Explorer encore',
            'de': 'Erkunden Sie noch',
            'sp': 'Explora más'
        },
        'Potrebbe interessarti anche': {
            'it': 'Potrebbe interessarti anche',
            'en': 'You might also like',
            'fr': 'Vous pourriez aussi aimer',
            'de': 'Sie könnten auch gerne',
            'sp': 'También podría interesarte'
        },
        'Nessun risultato trovato': {
            'it': 'Nessun risultato trovato',
            'en': 'No results found',
            'fr': 'Aucun résultat trouvé',
            'de': 'Kein Ergebnis gefunden',
            'sp': 'Ningún resultado encontrado'
        },
        'Grazie!': {
            'it': 'Grazie!',
            'en': 'Thank you!',
            'fr': 'Merci!',
            'de': 'Danke!',
            'sp': '¡Gracias!'
        },
        'Torna alla homepage': {
            'it': 'Torna alla homepage',
            'en': 'Return to homepage',
            'fr': 'Retour à la page d\'accueil',
            'de': 'Zurück zur Startseite',
            'sp': 'Volver a la página de inicio'
        },
        'Newsletter': {
            'it': 'Newsletter',
            'en': 'Newsletter',
            'fr': 'Newsletter',
            'de': 'Newsletter',
            'sp': 'Newsletter'
        },
        'Iscriviti': {
            'it': 'Iscriviti',
            'en': 'Subscribe',
            'fr': 'S\'abonner',
            'de': 'Abonnieren',
            'sp': 'Suscríbete'
        },
        'Elaborazione in corso...': {
            'it': 'Elaborazione in corso...',
            'en': 'Processing...',
            'fr': 'Traitement en cours...',
            'de': 'Verarbeitung läuft...',
            'sp': 'Procesando...'
        },
        'Grazie per averci contattato! Ti risponderemo al più presto.': {
            'it': 'Grazie per averci contattato! Ti risponderemo al più presto.',
            'en': 'Thank you for contacting us! We will get back to you shortly.',
            'fr': 'Merci de nous avoir contactés ! Nous vous répondrons dans les plus brefs délais.',
            'de': 'Vielen Dank für Ihre Kontaktaufnahme! Wir melden uns in Kürze bei Ihnen.',
            'sp': '¡Gracias por contactarnos! Te responderemos lo antes posible.'
        },
        'Si è verificato un errore, riprova tra qualche minuto.': {
            'it': 'Si è verificato un errore, riprova tra qualche minuto.',
            'en': 'An error occurred, please try again in a few minutes.',
            'fr': 'Une erreur s\'est produite, veuillez réessayer dans quelques minutes.',
            'de': 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es in ein paar Minuten erneut.',
            'sp': 'Se ha producido un error, inténtalo de nuevo en unos minutos.'
        },
        'Nome': {
            'it': 'Nome',
            'en': 'First Name',
            'fr': 'Prénom',
            'de': 'Vorname',
            'sp': 'Nombre'
        },
        'Cognome': {
            'it': 'Cognome',
            'en': 'Last Name',
            'fr': 'Nom',
            'de': 'Nachname',
            'sp': 'Apellido'
        },
        'Città': {
            'it': 'Città',
            'en': 'City',
            'fr': 'Ville',
            'de': 'Stadt',
            'sp': 'Ciudad'
        },
        'Email': {
            'it': 'Email',
            'en': 'Email',
            'fr': 'E-mail',
            'de': 'E-Mail',
            'sp': 'Correo electrónico'
        },
        'Privacy Policy': {
            'it': 'Privacy Policy',
            'en': 'Privacy Policy',
            'fr': 'Politique de confidentialité',
            'de': 'Datenschutzrichtlinie',
            'sp': 'Política de Privacidad'
        },
        'Cookie Policy': {
            'it': 'Cookie Policy',
            'en': 'Cookie Policy',
            'fr': 'Politique de cookies',
            'de': 'Cookie-Richtlinie',
            'sp': 'Política de Cookies'
        },
        'Seguici sui social': {
            'it': 'Seguici sui social',
            'en': 'Follow us on social',
            'fr': 'Suivez-nous sur les réseaux sociaux',
            'de': 'Folgen Sie uns in den sozialen Medien',
            'sp': 'Síguenos en redes sociales'
        },
        'Seguici su Instagram': {
            'it': 'Seguici su Instagram',
            'en': 'Follow us on Instagram',
            'fr': 'Suivez-nous sur Instagram',
            'de': 'Folgen Sie uns auf Instagram',
            'sp': 'Síguenos en Instagram'
        },
        'Seguici su Facebook': {
            'it': 'Seguici su Facebook',
            'en': 'Follow us on Facebook',
            'fr': 'Suivez-nous sur Facebook',
            'de': 'Folgen Sie uns auf Facebook',
            'sp': 'Síguenos en Facebook'
        },
        'Carica altro': {
            'it': 'Carica altro',
            'en': 'Load more',
            'fr': 'Charger plus',
            'de': 'Mehr laden',
            'sp': 'Cargar más'
        },
        'Credits HM': {
            'it': 'Prodotto originale frutto delle menti creative e felici di',
            'en': 'Original product from the creative and happy minds of',
            'fr': 'Produit original des esprits créatifs et heureux de',
            'de': 'Originalprodukt aus den kreativen und glücklichen Köpfen von',
            'sp': 'Producto original fruto de las mentes creativas y felices de'
        },
        'Slide successiva': {
            'it': 'Slide successiva',
            'en': 'Next slide',
            'fr': 'Slide suivant',
            'de': 'Nächster Slide',
            'sp': 'Siguiente diapositiva'
        },
        'Slide precedente': {
            'it': 'Slide precedente',
            'en': 'Previous slide',
            'fr': 'Slide précédent',
            'de': 'Vorheriger Slide',
            'sp': 'Diapositiva anterior'
        },
        'Telefono': {
            'it': 'Telefono',
            'en': 'Phone',
            'fr': 'Téléphone',
            'de': 'Telefon',
            'sp': 'Teléfono'
        },
        'Messaggio': {
            'it': 'Messaggio',
            'en': 'Message',
            'fr': 'Message',
            'de': 'Nachricht',
            'sp': 'Mensaje'
        },
        'Data': {
            'it': 'Data',
            'en': 'Date',
            'fr': 'Date',
            'de': 'Datum',
            'sp': 'Fecha'
        },
        'Località': {
            'it': 'Località',
            'en': 'Location',
            'fr': 'Localité',
            'de': 'Ort',
            'sp': 'Ubicación'
        },
        'Orario': {
            'it': 'Orario',
            'en': 'Time',
            'fr': 'Heure',
            'de': 'Zeit',
            'sp': 'Hora'
        },
        'Immagine di': {
            'it': 'Immagine di',
            'en': 'Image of',
            'fr': 'Image de',
            'de': 'Bild von',
            'sp': 'Imagen de'
        },
        'Si è verificato un errore, riprova tra qualche minuto.': {
            'it': 'Si è verificato un errore, riprova tra qualche minuto.',
            'en': 'An error occurred, please try again in a few minutes.',
            'fr': 'Une erreur s\'est produite, veuillez réessayer dans quelques minutes.',
            'de': 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es in ein paar Minuten erneut.',
            'sp': 'Se ha producido un error, inténtalo de nuevo en unos minutos.'
        },
        'Cerca': {
            'it': 'Cerca',
            'en': 'Search',
            'fr': 'Rechercher',
            'de': 'Suchen',
            'sp': 'Buscar'
        },
        'Risultati trovati': {
            'it': ' risultati',
            'en': ' results',
            'fr': ' résultats',
            'de': ' Ergebnisse',
            'sp': ' resultados'
        },
        'Scopri di piu': {
            'it': 'Scopri di più',
            'en': 'Learn more',
            'fr': 'En savoir plus',
            'de': 'Mehr erfahren',
            'sp': 'Aprender más'
        },
        'I nostri clienti': {
            'it': 'I nostri clienti',
            'en': 'Our clients',
            'fr': 'Nos clients',
            'de': 'Unsere Kunden',
            'sp': 'Nuestros clientes'
        },
        'Guarda tutti gli originals': {
            'it': 'Guarda tutti gli originals',
            'en': 'See all originals',
            'fr': 'Voir tous les originals',
            'de': 'Alle Originals ansehen',
            'sp': 'Ver todos los originals'
        }
    };

    // Controlla che l'etichetta esista nel dizionario
    if (!data[label]) {
        console.warn(`Etichetta non trovata: '${label}'`);
        return label; // fallback: restituisci l'etichetta originale
    }

    // Controlla che la lingua sia definita per quell'etichetta
    if (!data[label][locale]) {
        console.warn(`Traduzione non trovata per '${label}' in '${locale}'`);
        return data[label]['it']; // fallback: italiano
    }

    // Ritorna la traduzione corretta
    return data[label][locale];
}
