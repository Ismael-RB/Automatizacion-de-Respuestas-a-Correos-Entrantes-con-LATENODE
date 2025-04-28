 export default async function run({ execution_id, input, data }) {
    // Obtener el contenido y el asunto del mensaje
    const decodedContent = data["{{1.`data`.`decodedContent`}}"];
    const subject = data["{{1.`data`.`subject`}}"];

    // Unir el contenido y el asunto en un solo texto
    const rawText = (decodedContent + ' ' + subject).toLowerCase();
    const cleanText = rawText.replace(/[^\w\s]/g, ''); // Elimina signos de puntuación

    // Verificar si el correo contiene "ESOSOFTWARE" o "ESO SOFTWARE"
    if (!cleanText.includes('esosoftware') && !cleanText.includes('eso software')) {
        return null;  // Si no contiene "ESOSOFTWARE" ni "ESO SOFTWARE", no procede (retorna null)
    }

    // Lista de malas palabras
    const badWords = [
        "pendejo", "puta", "estúpido", "mierda", "imbécil", "chingada", "idiota",
        "hijo de puta", "mamadas", "cabron", "culero", "perra", "malparido",
        "zorra", "maldita", "mierdero", "cagada", "coño", "gilipollas", "carajo",
        "estupida", "marica", "jodido", "joder", "pajero", "pelotudo", "retrasado",
        "imbecil", "anormal", "pichazo", "verga", "chingar", "chingón", "culiado",
        "huevón", "guevón", "pito", "picha", "pedo", "cojudo", "boludo",
        "fuck", "shit", "bitch", "asshole", "dick", "bastard", "faggot", "slut",
        "whore", "cunt", "motherfucker", "retard", "suck", "jerk", "prick",
        "douche", "pussy", "cock", "blowjob", "damn", "hell", "bullshit",
        "arse", "moron"
    ];

    // Función para censurar malas palabras
    const censorBadWords = (text, wordsList) => {
        wordsList.forEach(word => {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            const censoredWord = word.replace(/\w/g, '*'); // Reemplaza cada letra por un *
            text = text.replace(regex, censoredWord);
        });
        return text;
    };

    // Censurar el texto por malas palabras
    let censoredText = censorBadWords(cleanText, badWords);

    // Lista extendida de palabras clave buenas agrupadas por nivel de urgencia
    const goodWordsUrgency = {
        alta: [
            "urgent", "asap", "immediately", "right away", "straight away", "critical", "emergency", "important",
            "right now", "respond fast", "fast", "very urgent", "immediate attention", "emergency case", "top priority",
            "time-sensitive", "high priority", "cannot wait", "resolve now", "act quickly", "extremely urgent",
            "as soon as possible", "resolve immediately", "unacceptable delay",
            "urgente", "muy urgente", "lo antes posible", "lo más pronto posible", "atención inmediata", "caso crítico", 
            "prioridad alta", "resolver ya", "responder ahora", "sin demora"
        ],
        media: [
            "help", "support", "assistance", "customer support", "client support", "technical support", 
            "technical issue", "billing", "charge", "charged", "double charge", "payment", "transaction", 
            "invoice", "factura", "issue with invoice", "error on invoice", "legal", "refund", "reimbursement", 
            "request refund", "report", "open case", "open ticket", "reclamation", "dispute", "problem", 
            "claim", "conflict", "trouble", "cannot log in", "no access", "locked account", "suspended", 
            "reactivate", "suspension", "contract", "change request", "facturación", "soporte técnico", "reembolso", 
            "problema", "queja", "cobro duplicado", "no puedo acceder", "cuenta bloqueada", "suspendida", 
            "desbloquear cuenta", "cancelación", "actualización de datos", "problema de acceso", 
            "problema de cobro", "ayuda urgente", "error de sistema"
        ],
        baja: [
            "information", "more info", "details", "question", "checking", "specifics", "numbers", 
            "figures", "guidance", "consultation", "data", "feedback", "inquiry", "follow-up", 
            "status update", "request update", "availability", "schedule", "program", "appointment", 
            "just wondering", "looking for", "consulta", "información", "pregunta", "estado", "seguimiento", 
            "disponibilidad", "solicito información", "me gustaría saber", "actualización", "duda", 
            "podrían decirme", "quisiera saber", "saber más", "quiero saber"
        ]
    };

    // Función para buscar la primera coincidencia
    const findMatch = (text, wordList) => {
        return wordList.find(word => text.includes(word));
    };

    // Buscar malas palabras primero
    const matchedBad = findMatch(censoredText, badWords);
    if (matchedBad) {
        return {
            result: "NO",
            matched_word: matchedBad
        };
    }

    // Buscar palabras clave buenas según nivel de urgencia
    for (const [nivel, lista] of Object.entries(goodWordsUrgency)) {
        const matchedGood = findMatch(censoredText, lista);
        if (matchedGood) {
            const urgencia = nivel === 'alta' ? 'Alta' : nivel === 'media' ? 'Media' : 'Baja';
            return {
                result: "YES",
                matched_word: matchedGood,
                urgencia
            };
        }
    }

    // Si no se encontró ninguna palabra clave ni mala palabra
    return null;  // Si no se encontró nada relevante, no hacer nada
}
