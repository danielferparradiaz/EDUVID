// src/controllers/certificatesController.js
// ------------------------------
// Controlador del servicio Certificates.
// Endpoints exportados:
// - listCertificates(req): GET /certificates?userId=
// - generateCertificate(req): POST /certificates/generate  { userId, courseId }
// - downloadCertificate(req): GET /certificates/:id/download  -> sirve HTML desde DB
// - simulateEvent(req): POST /certificates/simulate-event  -> helper para pruebas (simula evento de Progress)
// ------------------------------

const axios = require("axios"); // usado para consultar Users/Courses si se configuran sus URLs
const model = require("../models/certificatesModel");

/*  =========================
    Helper: pedir info a Users
    =========================
    - Si process.env.USERS_SERVICE_URL está definido, hace una llamada HTTP:
    GET {USERS_SERVICE_URL}/users/{userId}
    - Si no está definido, devuelve un "mock" ligero con nombre/email.
    !- Cuando se integre con el microservicio Users real, configurar USERS_SERVICE_URL en .env.
    ?- Comentario para el equipo: aquí podríamos añadir caching simple (TTL) si hay muchas llamadas.
*/
async function fetchUserInfo(userId) {
    const usersUrl = process.env.USERS_SERVICE_URL;
    if (usersUrl && usersUrl.trim() !== "") {
        try {
            const res = await axios.get(
                `${usersUrl.replace(/\/$/, "")}/users/${userId}`
            );
            return res.data;
        } catch (err) {
            // Warning intencional: no rompemos el flujo si Users no está disponible (modo mock).
            console.warn("Users service error:", err.message);
        }
    }
    // Mock simple (útil cuando los compañeros todavía no tienen el servicio)
    return {
        id: userId,
        name: `Usuario ${userId}`,
        email: `user${userId}@example.com`,
    };
}

/*  =========================
    Helper: pedir info a Courses
    =========================
    !- Igual que fetchUserInfo pero para COURSES_SERVICE_URL.
*/
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

/*  =========================
    Builder: arma el HTML del certificado en memoria
    =========================
    - Devuelve el HTML como string.
    - Mantener simple: la plantilla se genera en el servidor (no viene del usuario).
    - Si más tarde se requiere internacionalización o logos, añadir variables aquí.
*/
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

/*  =========================
    GET /certificates?userId=
    - Devuelve metadatos y un downloadUrl por cada certificado.
    - Nota: el downloadUrl apunta a /certificates/:id/download que servirá content desde la DB.
*/
async function listCertificates(req, res) {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: "userId requerido" });

    try {
        const rows = await model.getCertificatesByUser(userId);

        // Construye URL pública usando PUBLIC_BASE_URL (configurable en .env).
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

/*  =========================
    POST /certificates/generate
    - Body esperado: { userId, courseId }
    - Flujo:
        1. Obtener userInfo y courseInfo (o mock si no hay servicios).
        2. Insertar fila en DB para obtener id.
        3. Generar HTML en memoria con dicho id.
        4. Actualizar DB con file_url y content (HTML).
        5. Devolver metadata (id, file_url, ...).
    - Observación: insertamos primero para "fijar" el id que se mostrará en el certificado.
*/
async function generateCertificate(req, res) {
    const { userId, courseId } = req.body;
    if (!userId || !courseId)
        return res.status(400).json({ error: "userId y courseId requeridos" });

    try {
        // Obtener datos de Users/Courses (o mock)
        const [userInfo, courseInfo] = await Promise.all([
            fetchUserInfo(userId),
            fetchCourseInfo(courseId),
        ]);

        // Insert inicial para obtener id
        const id = await model.createCertificate(userId, courseId, null, null);

        // Generar HTML en memoria
        const html = buildCertificateHtml(id, userInfo, courseInfo);

        // Construir file_url (metadato) y actualizar la fila con content (HTML)
        const base =
            process.env.PUBLIC_BASE_URL &&
            process.env.PUBLIC_BASE_URL.trim() !== ""
                ? process.env.PUBLIC_BASE_URL.replace(/\/$/, "")
                : `http://localhost:${process.env.PORT || 3006}`;
        const fileUrl = `${base}/certificates/${id}/download`;
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

/*  =========================
    GET /certificates/:id/download
    - Sirve el contenido (HTML) guardado en la DB como attachment.
    - No lee/escribe en disco: todo va por memoria.
*/
async function downloadCertificate(req, res) {
    const id = req.params.id;
    if (!id) return res.status(400).send("id requerido");

    try {
        const cert = await model.getCertificateContentById(id);
        if (!cert)
            return res.status(404).json({ error: "Certificado no encontrado" });

        const filename = `certificate-${id}.html`;
        const content = cert.content || "<p>Sin contenido</p>";

        // Forzamos tipo HTML y sugerimos un nombre para la descarga. El navegador decide si abrir o guardar.
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

/*  =========================
    POST /certificates/simulate-event
    - Endpoint de pruebas: simula que Progress emitió un evento course_completed.
    - En producción: Progress debería notificar a este servicio (via HTTP o, preferible, via bus de eventos).
    - Comentario para el equipo: cuando integremos Rabbit/Kafka, reemplazar este endpoint por un consumidor/subscriptor.
*/
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
