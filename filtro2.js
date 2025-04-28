export default async function run({ execution_id, input, data }) {
    const resultNodo3 = data["{{3.result}}"];

    let content;
    if (resultNodo3 === "YES") {
        content = data["{{4.result.choices.[0].message.content}}"];
    } else if (resultNodo3 === "NO") {
        content = data["{{21.result.choices.[0].message.content}}"];
    }

    try {
        let parsedContent = JSON.parse(content);
        content = parsedContent.respuesta || parsedContent.urgencia || content;
    } catch (error) {
        console.log('No es un JSON válido, continuamos con el contenido original');
    }

    if (content) {
        content = cleanAndFormatText(content);
        content = content.replace(/\\"/g, '"');
    } else {
        content = "";
    }

    let subjectOriginal = data["{{1.data.subject}}"] || "";
    let subjectSinESO = subjectOriginal.replace(/eso\s*software/gi, '').trim();

    return {
        content: content,
        subject_sin_eso: subjectSinESO
    };
}

function cleanAndFormatText(input) {
    return input.replace(/\n/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
}
