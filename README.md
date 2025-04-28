**Automatización de Respuestas a Correos Entrantes con LATENODE**  
**Creado por Allan Ortiz e Ismael Reséndiz**

---

#### **Introducción**  
Este flujo de trabajo, implementado en LATENODE, automatiza la gestión de correos electrónicos entrantes mediante un proceso eficiente de clasificación, análisis de urgencia y generación de respuestas personalizadas. Utiliza nodos de JavaScript para el filtrado, un modelo de inteligencia artificial para crear respuestas adaptadas, y Google Sheets para registrar las interacciones, asegurando un seguimiento organizado y una comunicación efectiva con los clientes.

---

#### **Descripción General**  
El sistema está diseñado para procesar correos electrónicos entrantes, identificar su relevancia, clasificar su nivel de urgencia y generar respuestas automáticas según el contexto del mensaje. Sus principales funcionalidades son:  
- **Filtrado de Relevancia**: el sistema analiza el asunto y el contenido del correo para detectar una palabra clave específica, como "ESOSOFTWARE" (o cualquier otra que el usuario configure). Solo los correos que contengan esta palabra clave seguirán el flujo de respuesta automática, evitando contestar correos irrelevantes o de spam.  
- **Clasificación de Urgencia**: analiza palabras clave específicas dentro del correo para determinar si requiere atención **alta**, **media** o **baja**, priorizando así la gestión automática de las respuestas.  
- **Detección de Contenido Inapropiado**: rechaza correos con lenguaje ofensivo y genera mensaje de rechazo.  
- **Generación de Respuestas Personalizadas**: usa un modelo de IA para crear respuestas adaptadas al contenido y urgencia.  
- **Registro de Interacciones**: almacena los datos procesados en Google Sheets para auditoría y seguimiento.

---

#### **Flujo de Trabajo**

##### 1. NUEVOCORREO (Nodo #1)  
**Tipo de Nodo:** Nuevo Correo Electrónico  
**Función:** Desencadena el flujo recibiendo correos vía IMAP y extrayendo:  
- Asunto (`$1.data.subject`)  
- Remitente (`$1.data.from`)  
- Contenido decodificado (`$1.data.decodedContent`)  
**Salida:** Envía estos datos al siguiente nodo.

##### 2. VARIABLES (Nodo #2)  
**Tipo de Nodo:** Establecer Variables  
**Función:** Define contexto y estilo para los nodos de IA:  
- `format: business`  
- `length: 1 paragraph`  
- `role: manager`  
- `R: now`  
**Salida:** Alimenta los nodos YES (#4) y NO (#21).

##### 3. FILTRO1 (Nodo #3)  
**Tipo de Nodo:** JavaScript  
**Función:** Evalúa relevancia, urgencia y lenguaje:  
- Normaliza asunto + contenido.  
- Si no encuentra “ESOSOFTWARE”/“ESO SOFTWARE”, descarta.  
- Detecta insultos; si existen, marca `result: "NO"`.  
- Clasifica urgencia según palabras clave (Alta, Media, Baja).  
**Salida:** `{ result, matched_word, urgencia }`.

##### 4. YES (Nodo #4)  
**Tipo de Nodo:** Autismo Chronos Hermes 13B v2  
**Función:** Si `result: "YES"`, genera respuesta empresarial de 1 párrafo.  
**Salida:** Mensaje en `result.choices[0].message.content`.

##### 5. NO (Nodo #21)  
**Tipo de Nodo:** Autismo Chronos Hermes 13B v2  
**Función:** Si `result: "NO"`, genera mensaje de rechazo adaptado.  
**Salida:** Mensaje en `result.choices[0].message.content`.

##### 6. FILTRO2 (Nodo #17)  
**Tipo de Nodo:** JavaScript  
**Función:** Ajusta contenido y asunto:  
- Selecciona respuesta de YES o NO.  
- Intenta parsear JSON; si falla, usa texto original.  
- Limpia saltos de línea y espacios.  
- Elimina “ESO SOFTWARE” del asunto.  
**Salida:** `{ content, subject_sin_eso }`.

##### 7. RESPONDERCORREO (Nodo #15)  
**Tipo de Nodo:** Responder Correo Electrónico  
**Función:** Envía la respuesta usando SMTP:  
- Asunto: `subject_sin_eso`  
- Cuerpo: `content`  
**Salida:** Correo enviado al remitente.

##### 8. HC (Nodo #28)  
**Tipo de Nodo:** Agregar Fila a Google Sheets  
**Función:** Registra Asunto, Contenido, Palabra Clave, Urgencia, Respuesta y Fecha/Hora.  
**Configuración:**  
- Hoja: “LATENODEV1” → “Sheet1”  
- Encabezados en la primera fila.

---

#### **Flujo Alternativo: Monitoreo de Correos Pendientes**  
- **Trigger:** cada 24 h revisa Google Sheets.  
- **Acción:** busca correos “Alta” sin respuesta.  
- **Notificación:** envía recordatorio al equipo.

---

#### **Requisitos Previos**  
- Cuenta en LATENODE.  
- IMAP/SMTP configurados.  
- Google Sheets API y hoja “LATENODEV1”.  
- Credenciales en LATENODE para IMAP, SMTP y Sheets.

---

#### **Instalación y Configuración**  
1. Crea nuevo flujo en LATENODE con nodos: NUEVOCORREO → VARIABLES → FILTRO1 → YES → NO → FILTRO2 → RESPONDERCORREO → HC.  
2. Agrega credenciales IMAP, SMTP y Google Sheets.  
3. Importa scripts de FILTRO1 y FILTRO2.  
4. Activa y prueba con un correo de prueba.

---

#### **Uso**  
1. Sigue los pasos de instalación.  
2. Verifica credenciales.  
3. Activa el flujo y envía un correo con “urgente” o “soporte”.  
4. Confirma registros en Google Sheets.

---

#### **Estructura del Proyecto**  
```
├── /config/  
│   └── workflow.json  
├── /scripts/  
│   ├── filtro1.js  
│   └── filtro2.js  
├── /docs/  
│   └── README.md  
└── /sheets/  
    └── tracking-sheet.json  
```

---

#### **Limitaciones**  
- Dependencia de APIs de correo y Sheets.  
- Recomendable manejo de errores adicional.  
- El procesamiento de correos entrantes depende del disparo correcto de eventos IMAP en LATENODE; en algunos casos puede requerir activación manual para continuar el flujo.
- Para altos volúmenes, usar base de datos en lugar de Sheets.  
- Respuestas de IA pueden requerir ajustes manuales.

---



  
 
 
https://github.com/user-attachments/assets/61e747ee-75da-46ec-9e18-61f8255cecc6

 


---

#### **Créditos**  
- Allan Ortiz  
- Ismael Reséndiz

---
