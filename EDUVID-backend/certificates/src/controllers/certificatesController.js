// src/controllers/certificatesController.js
// ------------------------------
// Controlador del servicio Certificates.
// Endpoints exportados:
// - listCertificates(req): GET /certificates?userId=
// - generateCertificate(req): POST /certificates/generate  { userId, courseId }
// - downloadCertificate(req): GET /certificates/:id/download  -> sirve HTML desde DB
// - simulateEvent(req): POST /certificates/simulate-event  -> helper para pruebas (simula evento de progress)
// ------------------------------

const axios = require("axios"); // usado para consultar Users/Courses si se configuran sus URLs
const model = require("../models/certificatesModel");
const eurekaClient = require ("../config/eureka");

// =========================
// 🔎 Validar usuario en USER-SERVICE
// =========================
async function validateUserExists(userId) {
    try {
        const userServiceUrl = getServiceUrl("USER-SERVICE");
        console.log(`📡 [validateUserExists] Consultando: ${userServiceUrl}/api/validate-user/${userId}`);

        const { data } = await axios.get(`${userServiceUrl}/api/validate-user/${userId}`);
        console.log("📥 [validateUserExists] Respuesta:", data);

        if (data.exists) {
            console.log("✅ [validateUserExists] Usuario válido");
            return data.user; // devolver datos si los necesitas
        }
        throw new Error("El usuario no existe en el sistema");
    } catch (error) {
        console.error("❌ [validateUserExists] Error:", error.message);
        throw new Error("Error validando usuario en USER-SERVICE");
    }
}

// 🔎 Función auxiliar: obtener URL de un servicio desde Eureka
function getServiceUrl(appName) {
    console.log(`🌍 [getServiceUrl] Buscando instancias para: ${appName}`);
    const instances = eurekaClient.getInstancesByAppId(appName);
    console.log(`[getServiceUrl] Instancias encontradas:`, instances);

    if (!instances || instances.length === 0) {
        throw new Error(`❌ No hay instancias para ${appName}`);
    }

    const instance = instances[0];
    const url = `http://${instance.hostName}:${instance.port.$}`;
    console.log(`✅ [getServiceUrl] URL construida para ${appName}: ${url}`);
    return url;
}

/*  =========================
    Helper: pedir info a Users
    ========================= */
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

/*  =========================
    Helper: pedir info a Courses
    ========================= */
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
    ========================= */
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
    ========================= */
async function listCertificates(req, res) {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: "userId requerido" });

    try {
        const rows = await model.getCertificatesByUser(userId);
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
    ========================= */
async function generateCertificate(req, res) {
    const { userId, courseId } = req.body;
    if (!userId || !courseId)
        return res.status(400).json({ error: "userId y courseId requeridos" });

    try {
        // 🔎 Validar usuario en USER-SERVICE
        await validateUserExists(userId);

        // Obtener datos de Users/Courses
        const [userInfo, courseInfo] = await Promise.all([
            fetchUserInfo(userId),
            fetchCourseInfo(courseId),
        ]);

        const id = await model.createCertificate(userId, courseId, null, null);
        const html = buildCertificateHtml(id, userInfo, courseInfo);

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
        res.status(500).json({ error: err.message || "Error generando certificado" });
    }
}

/*  =========================
    GET /certificates/:id/download
    ========================= */
async function downloadCertificate(req, res) {
    const id = req.params.id;
    if (!id) return res.status(400).send("id requerido");

    try {
        const cert = await model.getCertificateContentById(id);
        if (!cert)
            return res.status(404).json({ error: "Certificado no encontrado" });

        const filename = `certificate-${id}.html`;
        const content = cert.content || "<p>Sin contenido</p>";

        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.send(content);
    } catch (err) {
        console.error("Error downloadCertificate:", err);
        res.status(500).json({ error: "Error sirviendo certificado" });
    }
}

/*  =========================
    POST /certificates/simulate-event
    ========================= */
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
