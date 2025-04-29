// ————————————————
// Helpers
// ————————————————
const escapeRegExp = str =>
  str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Detecta “eso software” sin importar mayúsculas, espacios o signos intermedios
const KEYWORD_REGEX = /eso\W*software/iu;

// ————————————————
// Listas de palabras
// ————————————————

const BAD_WORDS = [
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

const GOOD_WORDS_URGENCY = {
  alta: [
    "urgent", "asap", "immediately", "right away", "straight away",
    "critical", "emergency", "important", "right now", "respond fast",
    "fast", "very urgent", "immediate attention", "emergency case",
    "top priority", "time-sensitive", "high priority", "cannot wait",
    "resolve now", "act quickly", "extremely urgent", "as soon as possible",
    "resolve immediately", "unacceptable delay", "urgente", "muy urgente",
    "lo antes posible", "lo más pronto posible", "atención inmediata",
    "caso crítico", "prioridad alta", "resolver ya", "responder ahora",
    "sin demora"
  ],
  media: [
    "help", "support", "assistance", "customer support", "client support",
    "technical support", "technical issue", "billing", "charge", "charged",
    "double charge", "payment", "transaction", "invoice", "factura",
    "issue with invoice", "error on invoice", "legal", "refund",
    "reimbursement", "request refund", "report", "open case", "open ticket",
    "reclamation", "dispute", "problem", "claim", "conflict", "trouble",
    "cannot log in", "no access", "locked account", "suspended",
    "reactivate", "suspension", "contract", "change request",
    "facturación", "soporte técnico", "reembolso", "problema", "queja",
    "cobro duplicado", "no puedo acceder", "cuenta bloqueada", "suspendida",
    "desbloquear cuenta", "cancelación", "actualización de datos",
    "problema de acceso", "problema de cobro", "ayuda urgente",
    "error de sistema"
  ],
  baja: [
    "information", "more info", "details", "question", "checking", "specifics",
    "numbers", "figures", "guidance", "consultation", "data", "feedback",
    "inquiry", "follow-up", "status update", "request update", "availability",
    "schedule", "program", "appointment", "just wondering", "looking for",
    "consulta", "información", "pregunta", "estado", "seguimiento",
    "disponibilidad", "solicito información", "me gustaría saber",
    "actualización", "duda", "podrían decirme", "quisiera saber", "saber más",
    "quiero saber"
  ]
};

// ————————————————
// Función principal
// ————————————————
export default async function run({ execution_id, input, data }) {
  const decodedContent = String(data["{{1.`data`.`decodedContent`}}"] || '');
  const subject        = String(data["{{1.`data`.`subject`}}"]           || '');
  const rawText        = `${subject} ${decodedContent}`;

  // 1) Validar palabra clave
  if (!KEYWORD_REGEX.test(rawText)) {
    return null;
  }

  // 2) Buscar malas palabras → “NO”
  for (const palabra of BAD_WORDS) {
    const re = new RegExp(`\\b${escapeRegExp(palabra)}\\b`, 'iu');
    if (re.test(rawText)) {
      return { result: "NO", matched_word: palabra };
    }
  }

  // 3) Buscar palabras buenas por urgencia → “YES”
  for (const nivel of ['alta','media','baja']) {
    for (const palabra of GOOD_WORDS_URGENCY[nivel]) {
      const re = new RegExp(`\\b${escapeRegExp(palabra)}\\b`, 'iu');
      if (re.test(rawText)) {
        const urgencia = nivel === 'alta' ? 'Alta'
                       : nivel === 'media'? 'Media'
                       : 'Baja';
        return { result: "YES", matched_word: palabra, urgencia };
      }
    }
  }

  // 4) Nada relevante
  return null;
}
