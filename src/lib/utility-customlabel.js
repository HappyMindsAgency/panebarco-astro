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
        'Experience': {
            'it': 'Experience',
            'en': 'Experiences',
            'fr': 'Expériences',
            'de': 'Erfahrungen',
            'sp': 'Experiencias'
        },
        'Plan your trip': {
            'it': 'Plan your trip',
            'en': 'Plan your trip',
            'fr': 'Organisez votre vacances',
            'de': 'Organisieren Sie Ihre Urlaub',
            'sp': 'Planifica tu viaje'
        },
        'Esplora ancora': {
            'it': 'Esplora ancora',
            'en': 'Explore more',
            'fr': 'Explorer encore',
            'de': 'Erkunden Sie noch',
            'sp': 'Explora más'
        },
        'Esplora altri luoghi': {
            'it': 'Esplora altri luoghi',
            'en': 'Explore more places',
            'fr': 'Explorer d\'autres lieux',
            'de': 'Erkunden Sie weitere Orte',
            'sp': 'Explora otros lugares'
        },
        'Potrebbe interessarti anche': {
            'it': 'Potrebbe interessarti anche',
            'en': 'You might also like',
            'fr': 'Vous pourriez aussi aimer',
            'de': 'Sie könnten auch gerne',
            'sp': 'También podría interesarte'
        },
        'Organizzato da': {
            'it': 'Organizzato da',
            'en': 'Organized by',
            'fr': 'Organisé par',
            'de': 'Organisiert von',
            'sp': 'Organizado por'
        },
        'Nessun risultato trovato': {
            'it': 'Nessun risultato trovato',
            'en': 'No results found',
            'fr': 'Aucun résultat trouvé',
            'de': 'Kein Ergebnis gefunden',
            'sp': 'Ningún resultado encontrado'
        },
        'Attività e servizi': {
            'it': 'Attività e servizi',
            'en': 'Activities and services',
            'fr': 'Activités et services',
            'de': 'Aktivitäten und Dienstleistungen',
            'sp': 'Actividades y servicios'
        },
        'Attività di ristorazione': {
            'it': 'Attività di ristorazione',
            'en': 'Dining activities',
            'fr': 'Activités de restauration',
            'de': 'Aktivitäten beim Essen',
            'sp': 'Actividades de restauración'
        },
        'Produttori locali': {
            'it': 'Produttori locali',
            'en': 'Local producers',
            'fr': 'Producteurs locaux',
            'de': 'Lokaler Produzenten',
            'sp': 'Productores locales'
        },
        'Dove dormire': {
            'it': 'Dove dormire',
            'en': 'Where to stay',
            'fr': 'Où dormir',
            'de': 'Wo spazieren',
            'sp': 'Dónde dormir'
        },
        'Strutture ricettive' : {
            'it': 'Strutture ricettive',
            'en': 'Accommodation',
            'fr': 'Hébergement',
            'de': 'Unterkunft',
            'sp': 'Alojamiento'
        },
        'Cosa vedere': {
            'it': 'Cosa vedere',
            'en': 'What to see',
            'fr': 'Ce que voir',
            'de': 'Was zu sehen',
            'sp': 'Qué ver'
        },
        'Cosa fare': {
            'it': 'Cosa fare',
            'en': 'What to do',
            'fr': 'Ce que faire',
            'de': 'Was zu tun',
            'sp': 'Qué hacer'
        },
        'Tutti i luoghi': {
            'it': 'Tutti i luoghi',
            'en': 'All places',
            'fr': 'Tous les lieux',
            'de': 'Alle Orte',
            'sp': 'Todos los lugares'
        },
        'Tutti gli eventi': {
            'it': 'Tutti gli eventi',
            'en': 'All events',
            'fr': 'Tous les événements',
            'de': 'Alle Ereignisse',
            'sp': 'Todos los eventos'
        },
        'Tutte le attività': {
            'it': 'Tutte le attività',
            'en': 'All activities',
            'fr': 'Toutes les activités',
            'de': 'Alle Aktivitäten',
            'sp': 'Todas las actividades'
        },
        'Pagina Experience': {
            'it': 'Pagina Experience',
            'en': 'Experience page',
            'fr': 'Page Experience',
            'de': 'Experience-Seite',
            'sp': 'Página Experience'
        },
        'Dove mangiare': {
            'it': 'Dove mangiare',
            'en': 'Where to eat',
            'fr': 'Où manger',
            'de': 'Wo essen',
            'sp': 'Dónde comer'
        },
        'Attività e servizi': {
            'it': 'Attività e servizi',
            'en': 'Activities and services',
            'fr': 'Activités et services',
            'de': 'Aktivitäten und Dienstleistungen',
            'sp': 'Actividades y servicios'
        },
        'Clima & Meteo': {
            'it': 'Clima & Meteo',
            'en': 'Climate & Weather',
            'fr': 'Climat & Météo',
            'de': 'Klima & Wetter',
            'sp': 'Clima y Tiempo'
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
        News: {
            it: "News",
            en: "News",
            fr: "Actualités",
            de: "Nachrichten",
            sp: "Noticias",
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
        'Informativa Marketing': {
            'it': 'Informativa Marketing',
            'en': 'Marketing Notice',
            'fr': 'Note Marketing',
            'de': 'Marketinginformation',
            'sp': 'Aviso de Marketing'
        },
        'Acconsento al trattamento dei dati personali come definito all\'interno delle': {
            'it': 'Acconsento al trattamento dei dati personali come definito all\'interno delle',
            'en': 'I consent to the processing of personal data as defined in the',
            'fr': 'Je consens au traitement des données personnelles tel que défini dans la',
            'de': 'Ich willige in die Verarbeitung personenbezogener Daten gemäß der',
            'sp': 'Consiento el tratamiento de datos personales como se define en la'
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
        'Materiali utili': {
            'it': 'Materiali utili',
            'en': 'Useful materials',
            'fr': 'Matériaux utiles',
            'de': 'Benutzte Materialien',
            'sp': 'Materiales útiles'
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
        'Torna agli eventi': {
            'it': 'Torna agli eventi',
            'en': 'Back to events',
            'fr': 'Retour aux événements',
            'de': 'Zurück zu den Veranstaltungen',
            'sp': 'Volver a los eventos'
        },
        'Nessun evento trovato': {
            'it': 'Nessun evento trovato',
            'en': 'No events found',
            'fr': 'Aucun événement trouvé',
            'de': 'Kein Ereignis gefunden',
            'sp': 'Ningún evento encontrado'
        },
        'Visualizza su Google Maps': {
            'it': 'Visualizza su Google Maps',
            'en': 'View on Google Maps',
            'fr': 'Voir sur Google Maps',
            'de': 'Auf Google Maps anzeigen',
            'sp': 'Ver en Google Maps'
        },
        'Attività': {
            'it': 'Attività',
            'en': 'Activities',
            'fr': 'Activités',
            'de': 'Aktivitäten',
            'sp': 'Actividades'
        },
        'Eventi': {
            'it': 'Eventi',
            'en': 'Events',
            'fr': 'Evénements',
            'de': 'Veranstaltungen',
            'sp': 'Eventos'
        },
        'Privacy policy': {
            'it': 'Privacy Policy',
            'en': 'Privacy Policy',
            'fr': 'Politique de confidentialité',
            'de': 'Datenschutzrichtlinie',
            'sp': 'Política de Privacidad'
        },
        'Cookie policy': {
            'it': 'Cookie Policy',
            'en': 'Cookie Policy',
            'fr': 'Politique de cookies',
            'de': 'Cookie-Richtlinie',
            'sp': 'Política de Cookies'
        },
        'Credits HM': {
            'it': 'Prodotto originale frutto delle menti creative e felici di',
            'en': 'Original product from the creative and happy minds of',
            'fr': 'Produit original des esprits créatifs et heureux de',
            'de': 'Originalprodukt aus den kreativen und glücklichen Köpfen von',
            'sp': 'Producto original fruto de las mentes creativas y felices de'
        },
        'Info orario': {
            'it': 'alle ',
            'en': 'at ',
            'fr': 'à ',
            'de': 'unter ',
            'sp': 'a las '
        },
        'Continua ad esplorare': {
            'it': 'Continua ad esplorare',
            'en': 'Continue exploring',
            'fr': 'Continuer à explorer',
            'de': 'Weiter erkunden',
            'sp': 'Continúa explorando'
        },
        'Scopri il nostro ecosistema digitale': {
            'it': 'Scopri il nostro ecosistema digitale',
            'en': 'Discover our digital ecosystem',
            'fr': 'Découvrez notre écosystème numérique',
            'de': 'Entdecken Sie unser digitales Ökosystem',
            'sp': 'Descubre nuestro ecosistema digital'
        },
        'Rimani con noi': {
            'it': 'Rimani con noi',
            'en': 'Stay with us',
            'fr': 'Restez avec nous',
            'de': 'Bleiben Sie bei uns',
            'sp': 'Quédate con nosotros'
        },
        'Scopri cosa fare, scegli la tua vacanza': {
            'it': 'Scopri cosa fare, scegli la tua vacanza',
            'en': 'Discover what to do, choose your vacation',
            'fr': 'Découvrez ce que faire, choisissez votre vacances',
            'de': 'Entdecken Sie, was zu tun ist, wählen Sie Ihre Urlaub',
            'sp': 'Descubre qué hacer, elige tu vacaciones'
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
        'Vai alla pagina': {
            'it': 'Vai alla pagina',
            'en': 'Go to page',
            'fr': 'Aller à la page',
            'de': 'Zur Seite',
            'sp': 'Ir a la página'
        },
        'Ti potrebbe interessare anche': {
            'it': 'Ti potrebbe interessare anche',
            'en': 'You might also like',
            'fr': 'Vous pourriez aussi aimer',
            'de': 'Sie könnten auch gerne',
            'sp': 'También podría interesarte'
        },
        'Descrizione': {
            'it': 'Descrizione',
            'en': 'Description',
            'fr': 'Description',
            'de': 'Beschreibung',
            'sp': 'Descripción'
        },
        'Contatti': {
            'it': 'Contatti',
            'en': 'Contacts',
            'fr': 'Contacts',
            'de': 'Kontakte',
            'sp': 'Contactos'
        },
        'Articolo': {
            'it': 'Articolo',
            'en': 'Article',
            'fr': 'Article',
            'de': 'Artikel',
            'sp': 'Artículo'
        },
        'Scopri la sezione': {
            'it': 'Scopri la sezione',
            'en': 'Discover the section',
            'fr': 'Découvrir la section',
            'de': 'Entdecken Sie die Sektion',
            'sp': 'Descubrir la sección'
        },
        'Esplora il borgo': {
            'it': 'Esplora il borgo',
            'en': 'Explore the town',
            'fr': 'Explorer la ville',
            'de': 'Stadt erkunden',
            'sp': 'Explorar la ciudad'
        },
        'Filtra': {
            'it': 'Filtra',
            'en': 'Filter',
            'fr': 'Filtrer',
            'de': 'Filtern',
            'sp': 'Filtrar'
        },
        'Servizi': {
            'it': 'Servizi',
            'en': 'Services',
            'fr': 'Services',
            'de': 'Dienstleistungen',
            'sp': 'Servicios'
        },
        'Nessun risultato trovato con i filtri correnti': {
            'it': 'Nessun risultato trovato con i filtri correnti',
            'en': 'No results found with the current filters',
            'fr': 'Aucun résultat trouvé avec les filtres actuels',
            'de': 'Kein Ergebnis gefunden mit den aktuellen Filtern',
            'sp': 'Ningún resultado encontrado con los filtros actuales'
        },
        'Sito Ufficiale di Informazione Turistica del Comune di San Mauro Pascoli': {
            'it': 'Sito Ufficiale di Informazione Turistica del Comune di San Mauro Pascoli',
            'en': 'Official Information Site for the Municipality of San Mauro Pascoli',
            'fr': 'Site officiel d\'information touristique du commune de San Mauro Pascoli',
            'de': 'Offizielle Informationsseite für die Gemeinde San Mauro Pascoli',
            'sp': 'Sitio oficial de información turística del municipio de San Mauro Pascoli'
        },
        'Contattaci': {
            'it': 'Contattaci',
            'en': 'Contact us',
            'fr': 'Contactez-nous',
            'de': 'Kontaktieren Sie uns',
            'sp': 'Contacta con nosotros'
        },
        'Servizi e caratteristiche': {
            'it': 'Servizi e caratteristiche',
            'en': 'Services and features',
            'fr': 'Services et caractéristiques',
            'de': 'Dienstleistungen und Merkmale',
            'sp': 'Servicios y características'
        },
        'Disponibile dal': {
            'it': 'Disponibile dal',
            'en': 'Available from',
            'fr': 'Disponible depuis',
            'de': 'Verfügbar ab',
            'sp': 'Disponible desde'
        },
        'Disponibile fino al': {
            'it': 'Disponibile fino al',
            'en': 'Available until',
            'fr': 'Disponible jusqu\'à',
            'de': 'Verfügbar bis',
            'sp': 'Disponible hasta'
        },
        'Disponibile nei giorni': {
            'it': 'Disponibile nei giorni',
            'en': 'Available on days',
            'fr': 'Disponible les jours',
            'de': 'Verfügbar am Tagen',
            'sp': 'Disponible los días'
        },
        'Prenotazione obbligatoria': {
            'it': 'Prenotazione obbligatoria',
            'en': 'Mandatory reservation',
            'fr': 'Réservation obligatoire',
            'de': 'Pflichtreservierung',
            'sp': 'Reservación obligatoria'
        },
        'Accessibile alle persone con disabilità': {
            'it': 'Accessibile alle persone con disabilità',
            'en': 'Accessible for people with disabilities',
            'fr': 'Accessible pour les personnes avec des handicaps',
            'de': 'Zugang für Menschen mit Behinderungen',
            'sp': 'Accesible para personas con discapacidades'
        },
        'Consigliato a...': {
            'it': 'Consigliato a...',
            'en': 'Recommended for...',
            'fr': 'Recommandé pour...',
            'de': 'Empfohlen für...',
            'sp': 'Recomendado para...'
        },
        'Servizi Inclusi': {
            'it': 'Servizi Inclusi',
            'en': 'Included services',
            'fr': 'Services inclus',
            'de': 'Inklusive Dienstleistungen',
            'sp': 'Servicios incluidos'
        },
        'Servizi esclusi': {
            'it': 'Servizi esclusi',
            'en': 'Excluded services',
            'fr': 'Services exclus',
            'de': 'Ausgeschlossene Dienstleistungen',
            'sp': 'Servicios excluidos'
        },
        'In caso di maltempo': {
            'it': 'In caso di maltempo',
            'en': 'In case of bad weather',
            'fr': 'En cas de mauvais temps',
            'de': 'Im Falle von schlechter Wetter',
            'sp': 'En caso de mal tiempo'
        },
        'Policy di cancellazione': {
            'it': 'Policy di cancellazione',
            'en': 'Cancellation policy',
            'fr': 'Politique de résiliation',
            'de': 'Stornierungsrichtlinie',
            'sp': 'Política de cancelación'
        },
        'Policy annullamento': {
            'it': 'Policy annullamento',
            'en': 'Cancellation policy',
            'fr': 'Politique de résiliation',
            'de': 'Stornierungsrichtlinie',
            'sp': 'Política de cancelación'
        },
        'Invia una richiesta di informazioni': {
            'it': 'Invia una richiesta di informazioni',
            'en': 'Send a request for information',
            'fr': 'Envoyer une demande d\'informations',
            'de': 'Eine Anfrage für Informationen senden',
            'sp': 'Enviar una solicitud de información'
        },
        'Telefono': {
            'it': 'Telefono',
            'en': 'Phone',
            'fr': 'Téléphone',
            'de': 'Telefon',
            'sp': 'Teléfono'
        },
        'Arrivo': {
            'it': 'Arrivo',
            'en': 'Arrival',
            'fr': 'Arrivée',
            'de': 'Ankunft',
            'sp': 'Llegada'
        },
        'Partenza': {
            'it': 'Partenza',
            'en': 'Departure',
            'fr': 'Départ',
            'de': 'Abfahrt',
            'sp': 'Salida'
        },
        'Messaggio': {
            'it': 'Messaggio',
            'en': 'Message',
            'fr': 'Message',
            'de': 'Nachricht',
            'sp': 'Mensaje'
        },
        'Altre Experience che potrebbero interessarti': {
            'it': 'Altre Experience che potrebbero interessarti',
            'en': 'Other experiences that might interest you',
            'fr': 'Autres expériences qui pourraient vous intéresser',
            'de': 'Andere Erfahrungen, die Sie vielleicht interessieren',
            'sp': 'Otras experiencias que podrían interesarte'
        },
        'Locandina': {
            'it': 'Locandina',
            'en': 'Cover',
            'fr': 'Couverture',
            'de': 'Cover',
            'sp': 'Portada'
        },
        'Categorie evento': {
            'it': 'Categorie evento',
            'en': 'Event categories',
            'fr': 'Catégories d\'événements',
            'de': 'Ereigniskategorien',
            'sp': 'Categorías de eventos'
        },
        'Informazioni principali': {
            'it': 'Informazioni principali',
            'en': 'Main information',
            'fr': 'Informations principales',
            'de': 'Hauptinformationen',
            'sp': 'Información principal'
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
        'Informazioni': {
            'it': 'Informazioni',
            'en': 'Information',
            'fr': 'Information',
            'de': 'Information',
            'sp': 'Información'
        },
        'Informazioni evento': {
            'it': 'Informazioni evento',
            'en': 'Event information',
            'fr': 'Informations sur l\'événement',
            'de': 'Ereignisinformationen',
            'sp': 'Información del evento'
        },
        'Dal': {
            'it': 'Dal',
            'en': 'From',
            'fr': 'Date de début',
            'de': 'Startdatum',
            'sp': 'Fecha de inicio'
        },
        'Al': {
            'it': 'Al',
            'en': 'To',
            'fr': 'Date de fin',
            'de': 'Enddatum',
            'sp': 'Fecha de fin'
        },
        'Indirizzo': {
            'it': 'Indirizzo',
            'en': 'Address',
            'fr': 'Adresse',
            'de': 'Adresse',
            'sp': 'Dirección'
        },
        'Evento gratuito' :{
            'it': 'Evento gratuito',
            'en': 'Free event',
            'fr': 'Événement gratuit',
            'de': 'Freies Ereignis',
            'sp': 'Evento gratuito'
        },
        'Caratteristiche evento': {
            'it': 'Caratteristiche evento',
            'en': 'Event features',
            'fr': 'Caractéristiques de l\'événement',
            'de': 'Ereignismerkmale',
            'sp': 'Características del evento'
        },
        'Accessibile': {
            'it': 'Accessibile',
            'en': 'Accessible',
            'fr': 'Accessible',
            'de': 'Zugänglich',
            'sp': 'Accesible'
        },
        'Invia email a': {
            'it': 'Invia email a',
            'en': 'Send email to',
            'fr': 'Envoyer un email à',
            'de': 'E-Mail an',
            'sp': 'Enviar email a'
        }, 
        'si apre in una nuova finestra': {
            'it': 'si apre in una nuova finestra',
            'en': 'opens in a new window',
            'fr': 's\'ouvre dans une nouvelle fenêtre',
            'de': 'öffnet in einem neuen Fenster',
            'sp': 'se abre en una nueva ventana'
        },
        'Categorie': {
            'it': 'Categorie',
            'en': 'Categories',
            'fr': 'Catégories',
            'de': 'Kategorien',
            'sp': 'Categorías'
        },
        'Dove trovarci': {
            'it': 'Dove trovarci',
            'en': 'Where to find us',
            'fr': 'Où nous trouver',
            'de': 'Wo wir finden',
            'sp': 'Dónde encontrarnos'
        },
        'Informazioni utili': {
            'it': 'Informazioni utili',
            'en': 'Useful information',
            'fr': 'Informations utiles',
            'de': 'Nützliche Informationen',
            'sp': 'Información útil'
        },
        'Pianifica il tuo viaggio': {
            'it': 'Pianifica il tuo viaggio',
            'en': 'Plan your trip',
            'fr': 'Planifiez votre voyage',
            'de': 'Planen Sie Ihre Reise',
            'sp': 'Planifica tu viaje'
        },
        'Come arrivare': {
            'it': 'Come arrivare',
            'en': 'How to get there',
            'fr': 'Comment arriver',
            'de': 'Anreise',
            'sp': 'Cómo llegar'
        },
        'Stabilimenti balneari': {
            'it': 'Stabilimenti balneari',
            'en': 'Beach establishments',
            'fr': 'Établissements balnéaires',
            'de': 'Strandbäder',
            'sp': 'Establecimientos de playa'
        },
        'Vacanze accessibili': {
            'it': 'Vacanze accessibili',
            'en': 'Accessible holidays',
            'fr': 'Vacances accessibles',
            'de': 'Barrierefreier Urlaub',
            'sp': 'Vacaciones accesibles'
        },
        'Brochure': {
            'it': 'Brochure',
            'en': 'Brochure',
            'fr': 'Brochure',
            'de': 'Broschüre',
            'sp': 'Folleto'
        },
        'In ogni stagione, un calendario di emozioni': {
            'it': 'In ogni stagione, un calendario di emozioni',
            'en': 'In every season, a calendar of emotions',
            'fr': 'En chaque saison, un calendrier d\'émotions',
            'de': 'Zu jeder Jahreszeit ein Kalender voller Emotionen',
            'sp': 'En cada temporada, un calendario de emociones'
        },
        'Guarda tutti gli eventi': {
            'it': 'Guarda tutti gli eventi',
            'en': 'See all events',
            'fr': 'Voir tous les événements',
            'de': 'Alle Veranstaltungen ansehen',
            'sp': 'Ver todos los eventos'
        }, 
        'Scarica il brand kit': {
            'it': 'Scarica il brand kit',
            'en': 'Download the brand kit',
            'fr': 'Télécharger le kit de marque',
            'de': 'Brand-Kit herunterladen',
            'sp': 'Descargar el kit de marca'
        },
        'Brand e Media': {
            'it': 'Brand e Media',
            'en': 'Brand and Media',
            'fr': 'Marque et Média',
            'de': 'Marke und Medien',
            'sp': 'Marca y Medios'
        },
        'Scarica': {
            'it': 'Scarica',
            'en': 'Download',
            'fr': 'Télécharger',
            'de': 'Herunterladen',
            'sp': 'Descargar'
        },
        'Trattamento dati personali': {
            'it': 'Acconsento al trattamento dei dati personali come definito all\'interno della',
            'en': 'I consent to the processing of personal data as defined in the',
            'fr': 'Je consens au traitement des données personnelles tel que défini dans la',
            'de': 'Ich willige in die Verarbeitung personenbezogener Daten gemäß der',
            'sp': 'Consiento el tratamiento de datos personales como se define en la'
        },
        '10 MOTIVI PER<br />SCEGLIERE SAN MAURO': {
            'it': '10 MOTIVI PER <br /> SCEGLIERE SAN MAURO',
            'en': '10 reasons to choose San Mauro',
            'fr': '10 raisons de choisir San Mauro',
            'de': '10 Gründe, um San Mauro zu wählen',
            'sp': '10 motivos para elegir San Mauro'
        },
        'Invia una richiesta di informazioni': {
            'it': 'Invia una richiesta di informazioni',
            'en': 'Send a request for information',
            'fr': 'Envoyer une demande d\'informations',
            'de': 'Eine Anfrage für Informationen senden',
            'sp': 'Enviar una solicitud de información'
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
        'Esplora': {
            'it': 'Esplora',
            'en': 'Explore',
            'fr': 'Explorer',
            'de': 'Erkunden',
            'sp': 'Explorar'
        },
        'Pianifica': {
            'it': 'Pianifica',
            'en': 'Plan',
            'fr': 'Planifier',
            'de': 'Planen',
            'sp': 'Planificar'
        },
        'Dove dormire': {
            'it': 'Dove dormire',
            'en': 'Where to sleep',
            'fr': 'Où dormir',
            'de': 'Wo schlafen',
            'sp': 'Dónde dormir'
        },
        'Dove mangiare': {
            'it': 'Dove mangiare',
            'en': 'Where to eat',
            'fr': 'Où manger',
            'de': 'Wo essen',
            'sp': 'Dónde comer'
        },
        'Dove trovarci': {
            'it': 'Dove trovarci',
            'en': 'Where to find us',
            'fr': 'Où nous trouver',
            'de': 'Wo wir finden',
            'sp': 'Dónde encontrarnos'
        },
        'Brand e Media': {
            'it': 'Brand e Media',
            'en': 'Brand and Media',
            'fr': 'Marque et Média',
            'de': 'Marke und Medien',
            'sp': 'Marca y Medios'
        },
        'Vedi tutto su': {
            'it': 'Vedi tutto su',
            'en': 'See all on',
            'fr': 'Voir tout sur',
            'de': 'Alle ansehen auf',
            'sp': 'Ver todos en'
        },
        'Spiagge': {
            'it': 'Spiagge',
            'en': 'Beaches',
            'fr': 'Plages',
            'de': 'Strände',
            'sp': 'Playas'
        },
        'Vacanze in famiglia': {
            'it': 'Vacanze in famiglia',
            'en': 'Family holidays',
            'fr': 'Vacances familiales',
            'de': 'Familienurlaub',
            'sp': 'Vacaciones familiares'
        },
        'Verde e parchi': {
            'it': 'Verde e parchi',
            'en': 'Green and parks',
            'fr': 'Vert et parcs',
            'de': 'Grün und Parks',
            'sp': 'Verde y parques'
        },
        'Sport e wellness': {
            'it': 'Sport e wellness',
            'en': 'Sports and wellness',
            'fr': 'Sports et bien-être',
            'de': 'Sport und Wohlführung',
            'sp': 'Deportes y bienestar'
        },
        'Pet friendly': {
            'it': 'Pet friendly',
            'en': 'Pet friendly',
            'fr': 'Animaux acceptés',
            'de': 'Haustierfreundlich',
            'sp': 'Apto para mascotas'
        },
        'Stabilimenti Balneari': {
            'it': 'Stabilimenti balneari',
            'en': 'Beach establishments',
            'fr': 'Établissements balnéaires',
            'de': 'Strandbäder',
            'sp': 'Establecimientos de playa'
        },
        'Vacanze Accessibili': {
            'it': 'Vacanze accessibili',
            'en': 'Accessible holidays',
            'fr': 'Vacances accessibles',
            'de': 'Barrierefreier Urlaub',
            'sp': 'Vacaciones accesibles'
        },
        'Info e servizi turistici': {
            'it': 'Info e servizi turistici',
            'en': 'Information and tourist services',
            'fr': 'Informations et services touristiques',
            'de': 'Informationen und touristische Dienstleistungen',
            'sp': 'Información y servicios turísticos'
        },
        'Tipologia': {
            'it': 'Tipologia',
            'en': 'Type',
            'fr': 'Type',
            'de': 'Typ',
            'sp': 'Tipo'
        },
        'Categoria': {
            'it': 'Categoria',
            'en': 'Category',
            'fr': 'Catégorie',
            'de': 'Kategorie',
            'sp': 'Categoría'
        },
        'Classificazione': {
            'it': 'Classificazione',
            'en': 'Classification',
            'fr': 'Classification',
            'de': 'Klassifizierung',
            'sp': 'Clasificación'
        },
        'Seleziona una tipologia': {
            'it': 'Seleziona una tipologia',
            'en': 'Select a type',
            'fr': 'Sélectionner un type',
            'de': 'Typ auswählen',
            'sp': 'Seleccionar un tipo'
        },
        'Seleziona una categoria': {
            'it': 'Seleziona una categoria',
            'en': 'Select a category',
            'fr': 'Sélectionner une catégorie',
            'de': 'Kategorie auswählen',
            'sp': 'Seleccionar una categoría'
        },
        'Seleziona una classificazione': {
            'it': 'Seleziona una classificazione',
            'en': 'Select a classification',
            'fr': 'Sélectionner une classification',
            'de': 'Klassifizierung auswählen',
            'sp': 'Seleccionar una clasificación'
        },
        'Desidero iscrivermi alla newsletter': {
            'it': 'Desidero iscrivermi alla newsletter',
            'en': 'I want to subscribe to the newsletter',
            'fr': 'Je veux m\'abonner à la newsletter',
            'de': 'Ich möchte der Newsletter abonnieren',
            'sp': 'Quiero suscribirme a la newsletter'
        },
        'Contattaci': {
            'it': 'Contattaci',
            'en': 'Contact us',
            'fr': 'Nous contacter',
            'de': 'Kontaktieren Sie uns',
            'sp': 'Contactar con nosotros'
        },
        'Inserisci Nome': {
            'it': 'Inserisci Nome',
            'en': 'Enter Name',
            'fr': 'Entrer le nom',
            'de': 'Namen eingeben',
            'sp': 'Introducir nombre'
        },
        'Inserisci Cognome': {
            'it': 'Inserisci Cognome',
            'en': 'Enter Surname',
            'fr': 'Entrer le prénom',
            'de': 'Nachname eingeben',
            'sp': 'Introducir apellido'
        },
        'Inserisci Email': {
            'it': 'Inserisci Email',
            'en': 'Enter Email',
            'fr': 'Entrer l\'email',
            'de': 'Email eingeben',
            'sp': 'Introducir email'
        },
        'Inserisci Telefono': {
            'it': 'Inserisci Telefono',
            'en': 'Enter Phone',
            'fr': 'Entrer le téléphone',
            'de': 'Telefonnummer eingeben',
            'sp': 'Introducir teléfono'
        },
        'Inserisci Città': {
            'it': 'Inserisci Città',
            'en': 'Enter City',
            'fr': 'Entrer la ville',
            'de': 'Stadt eingeben',
            'sp': 'Introducir ciudad'
        },
        'Inserisci messaggio': {
            'it': 'Inserisci Messaggio',
            'en': 'Enter Message',
            'fr': 'Entrer le message',
            'de': 'Nachricht eingeben',
            'sp': 'Introducir mensaje'
        },
        'Invia richiesta': {
            'it': 'Invia richiesta',
            'en': 'Send request',
            'fr': 'Envoyer la demande',
            'de': 'Anfrage senden',
            'sp': 'Enviar solicitud'
        },
        'Nessun periodo specificato': {
            'it': 'Nessun periodo specificato',
            'en': 'No period specified',
            'fr': 'Aucun période spécifiée',
            'de': 'Kein Zeitraum angegeben',
            'sp': 'Ningún periodo especificado'
        },
        'Nessun giorno specificato': {
            'it': 'Nessun giorno specificato',
            'en': 'No day specified',
            'fr': 'Aucun jour spécifié',
            'de': 'Kein Tag angegeben',
            'sp': 'Ningún día especificado'
        },
        'Periodo di apertura': {
            'it': 'Periodo di apertura',
            'en': 'Opening period',
            'fr': 'Période d\'ouverture',
            'de': 'Öffnungszeitraum',
            'sp': 'Periodo de apertura'
        },
        'Giorni di apertura': {
            'it': 'Giorni di apertura',
            'en': 'Opening days',
            'fr': 'Jours d\'ouverture',
            'de': 'Öffnungstage',
            'sp': 'Días de apertura'
        },
        'Booking': {
            'it': 'Booking',
            'en': 'Booking',
            'fr': 'Réservation',
            'de': 'Buchung',
            'sp': 'Reservación'
        },
        'News-testo-1': {
            'it': 'A <strong>San Mauro</strong> le notizie seguono il ritmo del paese e del mare. Raccontano ciò che accade, le novità, le iniziative, i piccoli cambiamenti e le storie che attraversano le stagioni e la vita quotidiana della località.',
            'en': 'A <strong>San Mauro</strong> the news follow the rhythm of the town and the sea. They report what happens, the news, the initiatives, the small changes and the stories that cross the seasons and the daily life of the location.',
            'fr': 'A <strong>San Mauro</strong> les nouvelles suivent le rythme de la ville et de la mer. Elles rapportent ce qui se passe, les nouvelles, les initiatives, les petits changements et les histoires qui traversent les saisons et la vie quotidienne de la localité.',
            'de': 'A <strong>San Mauro</strong> die Nachrichten folgen dem Rhythmus der Stadt und des Meeres. Sie berichten, was passiert, die Nachrichten, die Initiativen, die kleinen Änderungen und die Geschichten, die die Jahreszeiten und das tägliche Leben der Ortschaft durchlaufen.',
            'sp': 'A <strong>San Mauro</strong> las noticias siguen el ritmo de la ciudad y el mar. Informan sobre lo que sucede, las noticias, las iniciativas, los pequeños cambios y las historias que atraviesan las estaciones y la vida cotidiana de la località.'
        },
        'News-testo-2': {
            'it': '<strong>Uno spazio per restare aggiornati</strong> e guardare San Mauro da vicino, tra presente, territorio e persone.',
            'en': 'A <strong>San Mauro</strong> the news follow the rhythm of the town and the sea. They report what happens, the news, the initiatives, the small changes and the stories that cross the seasons and the daily life of the location.',
            'fr': 'A <strong>San Mauro</strong> les nouvelles suivent le rythme de la ville et de la mer. Elles rapportent ce qui se passe, les nouvelles, les initiatives, les petits changements et les histoires qui traversent les saisons et la vie quotidienne de la localité.',
            'de': 'A <strong>San Mauro</strong> die Nachrichten folgen dem Rhythmus der Stadt und des Meeres. Sie berichten, was passiert, die Nachrichten, die Initiativen, die kleinen Änderungen und die Geschichten, die die Jahreszeiten und das tägliche Leben der Ortschaft durchlaufen.',
            'sp': 'A <strong>San Mauro</strong> las noticias siguen el ritmo de la ciudad y el mar. Informan sobre lo que sucede, las noticias, las iniciativas, los pequeños cambios y las historias que atraviesan las estaciones y la vida cotidiana de la localidad.'
        },
        'Risultati ricerca': {
            'it': 'Cerca sul portale',
            'en': 'Search on Visit San Mauro Mare',
            'fr': 'Rechercher sur Visit San Mauro Mare',
            'de': 'Suchen auf Visit San Mauro Mare',
            'sp': 'Buscar en Visit San Mauro Mare'
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
        'Tutti': {
            'it': 'Tutti',
            'en': 'All',
            'fr': 'Tous',
            'de': 'Alle',
            'sp': 'Todos'
        },
        'Prossimi eventi': {
            'it': 'Prossimi eventi',
            'en': 'Next events',
            'fr': 'Prochains événements',
            'de': 'Nächste Ereignisse',
            'sp': 'Próximos eventos'
        },
        'Archivio': {
            'it': 'Eventi passati',
            'en': 'Past events',
            'fr': 'Événements passés',
            'de': 'Vergangene Ereignisse',
            'sp': 'Eventos pasados'
        },
        'Inserisci una parola per cercare': {
            'it': 'Inserisci una parola per cercare',
            'en': 'Enter a word to search',
            'fr': 'Entrer un mot pour rechercher',
            'de': 'Einen Wort eingeben, um zu suchen',
            'sp': 'Introducir una palabra para buscar'
        },
        'Durata': {
            'it': 'Durata',
            'en': 'Duration',
            'fr': 'Durée',
            'de': 'Dauer',
            'sp': 'Duración'
        },
        'Luoghi': {
            'it': 'Luoghi',
            'en': 'Places',
            'fr': 'Lieux',
            'de': 'Orte',
            'sp': 'Lugares'
        },
        'Strutture': {
            'it': 'Strutture',
            'en': 'Structures',
            'fr': 'Structures',
            'de': 'Strukturen',
            'sp': 'Estructuras'
        },
        'Struttura': {
            'it': 'Struttura',
            'en': 'Place',
            'fr': 'Lieu',
            'de': 'Ort',
            'es': 'Lugar'
        },
        'Articoli': {
            'it': 'Articoli',
            'en': 'Articles',
            'fr': 'Articles',
            'de': 'Artikel',
            'sp': 'Artículos'
        },
        'Pagine': {
            'it': 'Pagine',
            'en': 'Pages',
            'fr': 'Pages',
            'de': 'Seiten',
            'sp': 'Páginas'
        },
        'Scopri di piu': {
            'it': 'Scopri di piu',
            'en': 'Learn more',
            'fr': 'En savoir plus',
            'de': 'Mehr erfahren',
            'sp': 'Descubrir mas'
        },
        'Scopri gli originals': {
            'it': 'Scopri gli originals',
            'en': 'Explore the originals',
            'fr': 'Decouvrir les originals',
            'de': 'Originals entdecken',
            'sp': 'Descubrir los originals'
        },
        'I nostri clienti': {
            'it': 'I nostri clienti',
            'en': 'Our clients',
            'fr': 'Nos clients',
            'de': 'Unsere Kunden',
            'sp': 'Nuestros clientes'
        },
        'Parliamone': {
            'it': 'Parliamone',
            'en': 'Let us talk',
            'fr': 'Parlons-en',
            'de': 'Sprechen wir daruber',
            'sp': 'Hablemos'
        },
        'Accedi ora': {
            'it': 'Accedi ora',
            'en': 'Access now',
            'fr': 'Acceder maintenant',
            'de': 'Jetzt offnen',
            'sp': 'Accede ahora'
        },
        'Pensieri che ci frullano in testa': {
            'it': 'Pensieri che ci frullano in testa',
            'en': 'Thoughts spinning in our heads',
            'fr': 'Pensees qui nous trottent dans la tete',
            'de': 'Gedanken, die uns im Kopf herumgehen',
            'sp': 'Pensamientos que nos rondan la cabeza'
        },
        'Progetti speciali': {
            'it': 'Progetti speciali',
            'en': 'Special projects',
            'fr': 'Projets speciaux',
            'de': 'Spezialprojekte',
            'sp': 'Proyectos especiales'
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
