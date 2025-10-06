const urlParams = new URLSearchParams(window.location.search);
const courseId = urlParams.get("id");      
const studentId = urlParams.get("student"); 

console.log("🔎 Parámetros recibidos -> courseId:", courseId, "studentId:", studentId);

const courseInfo = document.getElementById("course-info");
const lessonsList = document.getElementById("lessons-list");
const certButton = document.querySelector("button.btn-outline-primary");

let selectedLessons = []; // guardamos el estado de las lecciones seleccionadas

async function loadCourse() {
  try {
    // 1. Datos del curso
    const res = await fetch(`http://auth.eduvid.lan:8080/courses/api/info-curso/${courseId}`);
    const course = await res.json();

    courseInfo.innerHTML = `
      <div class="card shadow-sm">
        <div class="card-body">
          <h3 class="fw-bold">${course.nombre}</h3>
          <p class="text-muted">${course.descripcion || "Sin descripción."}</p>
        </div>
      </div>
    `;

    // 2. Lecciones
    const lessonRes = await fetch(`http://auth.eduvid.lan:8080/content/lessons?courseId=${courseId}`);
    const lessons = await lessonRes.json();

    // 3. Progreso actual
    const progRes = await fetch(`http://auth.eduvid.lan:8080/progress/api/${studentId}/${courseId}`);
    const progress = await progRes.json();
    const completedLessons = progress?.completedLessons || [];

    // 4. Renderizar lista de lecciones
    lessonsList.innerHTML = lessons.map(lesson => `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <div>
          <input type="checkbox" class="form-check-input me-2 lesson-checkbox" 
            data-lesson-id="${lesson.lessonId}"
            ${completedLessons.includes(lesson.lessonId) ? "checked" : ""}>
          ${lesson.title}
        </div>
        <button class="btn btn-sm btn-outline-primary">
          <i class="bi bi-play-circle"></i>
        </button>
      </li>
    `).join("");

    // Inicializar estado
    selectedLessons = [...completedLessons];

    // Manejar checkboxes
    document.querySelectorAll(".lesson-checkbox").forEach(cb => {
      cb.addEventListener("change", (e) => {
        const lessonId = Number(e.target.getAttribute("data-lesson-id"));
        if (e.target.checked) {
          if (!selectedLessons.includes(lessonId)) {
            selectedLessons.push(lessonId);
          }
        } else {
          selectedLessons = selectedLessons.filter(l => l !== lessonId);
        }
        console.log("✅ Estado actual de selectedLessons:", selectedLessons);
      });
    });

  } catch (err) {
    console.error("❌ Error cargando curso:", err);
    courseInfo.innerHTML = `<p class="text-danger">Error cargando curso.</p>`;
  }
}

// 🔹 Enviar progreso al backend cuando se pida certificado
certButton.addEventListener("click", async () => {
  try {
    console.log("📩 Enviando progreso al backend...");

    for (const lessonId of selectedLessons) {
      const resp = await fetch("http://auth.eduvid.lan:8080/progress/api/complete-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: Number(studentId), 
          courseId: Number(courseId), 
          lessonId 
        })
      });

      console.log(`➡️ POST lessonId=${lessonId} status:`, resp.status);
      const data = await resp.json();
      console.log("📦 Respuesta:", data);
    }

    alert("✅ Progreso guardado. Si terminaste el curso, se generará tu certificado automáticamente.");
  } catch (err) {
    console.error("❌ Error enviando progreso:", err);
    alert("Error al registrar el progreso");
  }
});

loadCourse();
