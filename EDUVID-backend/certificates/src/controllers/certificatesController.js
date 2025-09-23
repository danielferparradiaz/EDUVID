const axios = require("axios");
const model = require("../models/certificatesModel");

/* fetchUserInfo / fetchCourseInfo: iguales que antes (devuelven mock si no config) */
async function fetchUserInfo(userId) {
    const usersUrl = process.env.USERS_SERVICE_URL;
    if (usersUrl && usersUrl.trim() !== "") {
        try {
            const res = await axios.get(
                `${usersUrl.replace(/\/$/, "")}/users/${userId}`
            );
            return res.data;
        } catch (err) {
            console.warn("Users service error:", err.message);
        }
    }
    return {
        id: userId,
        name: `Usuario ${userId}`,
        email: `user${userId}@example.com`,
    };
}

async function fetchCourseInfo(courseId) {
    const coursesUrl = process.env.COURSES_SERVICE_URL;
    if (coursesUrl && coursesUrl.trim() !== "") {
        try {
            const res = await axios.get(
                `${coursesUrl.replace(/\/$/, "")}/courses/${courseId}`
            );
            return res.data;
        } catch (err) {
            console.warn("Courses service error:", err.message);
        }
    }
    return { id: courseId, title: `Curso ${courseId}` };
}

/* Genera el HTML del certificado en memoria */
function buildCertificateHtml(id, userInfo = {}, courseInfo = {}) {
    const issuedAt = new Date().toLocaleString();
    const userName =
        userInfo && userInfo.name
            ? userInfo.name
            : `Usuario ${userInfo.id || ""}`;
    const courseTitle =
        courseInfo && courseInfo.title
            ? courseInfo.title
            : `Curso ${courseInfo.id || ""}`;

    return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>Certificado #${id}</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
          .card { border: 2px solid #333; padding: 40px; display:inline-block; }
          h1 { margin: 0 0 10px 0; }
          .meta { margin-top: 20px; color: #555; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Certificado de finalización</h1>
          <p><strong>${userName}</strong></p>
          <p>ha completado el curso</p>
          <h2>${courseTitle}</h2>
          <div class="meta">Emitido: ${issuedAt}</div>
          <div class="meta">ID Certificado: ${id}</div>
        </div>
      </body>
    </html>
  `;
}

/* GET /certificates?userId=  -> lista (metadatos y downloadUrl) */
async function listCertificates(req, res) {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: "userId requerido" });
    try {
        const rows = await model.getCertificatesByUser(userId);
        // añadir downloadUrl para cada entry
        const base =
            process.env.PUBLIC_BASE_URL &&
            process.env.PUBLIC_BASE_URL.trim() !== ""
                ? process.env.PUBLIC_BASE_URL.replace(/\/$/, "")
                : `http://localhost:${process.env.PORT || 3006}`;
        const result = rows.map((r) => ({
            ...r,
            downloadUrl: `${base}/certificates/${r.id}/download`,
        }));
        res.json(result);
    } catch (err) {
        console.error("Error listCertificates:", err);
        res.status(500).json({ error: "Error del servidor" });
    }
}

/* POST /certificates/generate  body: { userId, courseId } 
   Genera HTML en memoria, guarda content en DB. No escribe disco. */
async function generateCertificate(req, res) {
    const { userId, courseId } = req.body;
    if (!userId || !courseId)
        return res.status(400).json({ error: "userId y courseId requeridos" });

    try {
        const [userInfo, courseInfo] = await Promise.all([
            fetchUserInfo(userId),
            fetchCourseInfo(courseId),
        ]);

        // 1) Insert inicial con content null (opcional) o directamente insertar el contenido
        // Para mantener el mismo id usable en el HTML, primero insertamos sin content para obtener id
        const id = await model.createCertificate(userId, courseId, null, null);

        // 2) Generar el HTML usando ese id
        const html = buildCertificateHtml(id, userInfo, courseInfo);

        // 3) Construir file_url (metadata) y actualizar la fila con content (HTML)
        const base =
            process.env.PUBLIC_BASE_URL &&
            process.env.PUBLIC_BASE_URL.trim() !== ""
                ? process.env.PUBLIC_BASE_URL.replace(/\/$/, "")
                : `http://localhost:${process.env.PORT || 3006}`;
        const fileUrl = `${base}/certificates/${id}/download`; // link que servirá el contenido desde DB
        await model.updateCertificateContent(id, fileUrl, html);

        const certificate = {
            id,
            userId,
            courseId,
            issuedAt: new Date(),
            file_url: fileUrl,
        };
        res.status(201).json(certificate);
    } catch (err) {
        console.error("Error generateCertificate:", err);
        res.status(500).json({ error: "Error generando certificado" });
    }
}

/* GET /certificates/:id/download  -> sirve el contenido desde la DB como archivo descargable */
async function downloadCertificate(req, res) {
    const id = req.params.id;
    if (!id) return res.status(400).send("id requerido");

    try {
        const cert = await model.getCertificateContentById(id);
        if (!cert)
            return res.status(404).json({ error: "Certificado no encontrado" });

        const filename = `certificate-${id}.html`;
        const content = cert.content || "<p>Sin contenido</p>";
        // Headers para forzar descarga o abrir en ventana (browser decide)
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${filename}"`
        );
        res.send(content);
    } catch (err) {
        console.error("Error downloadCertificate:", err);
        res.status(500).json({ error: "Error sirviendo certificado" });
    }
}

/* Endpoint de prueba: POST /certificates/simulate-event -> reusa generateCertificate */
async function simulateEvent(req, res) {
    req.body = req.body || {};
    return await generateCertificate(req, res);
}

module.exports = {
    listCertificates,
    generateCertificate,
    downloadCertificate,
    simulateEvent,
};
