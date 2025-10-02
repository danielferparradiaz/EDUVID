const urlParams = new URLSearchParams(window.location.search);
const courseId = urlParams.get("id");      // viene de ?id=...
const studentId = urlParams.get("student"); // ahora viene también en la URL

console.log("🔎 Parámetros recibidos -> courseId:", courseId, "studentId:", studentId);



const courseInfo = document.getElementById("course-info");
const lessonsList = document.getElementById("lessons-list");

async function loadCourse() {
  try {
    console.log("🔎 Iniciando carga del curso. courseId:", courseId, "studentId:", studentId);

    // 1. Datos del curso
    console.log(`➡️ Fetch curso: http://localhost:8095/api/info-curso/${courseId}`);
    const res = await fetch(`http://localhost:8095/api/info-curso/${courseId}`);
    console.log("✅ Response curso status:", res.status);
    const courseText = await res.text();
    console.log("📦 Raw curso response:", courseText);
    const course = JSON.parse(courseText);

    courseInfo.innerHTML = `
      <div class="card shadow-sm">
        <div class="card-body">
          <h3 class="fw-bold">${course.nombre}</h3>
          <p class="text-muted">${course.descripcion || "Sin descripción."}</p>
        </div>
      </div>
    `;

    // 2. Obtener lecciones del curso
    const lessonRes = await fetch(`http://localhost:5003/lessons?courseId=${courseId}`);
    console.log("✅ Response lessons status:", lessonRes.status);
    const lessonsText = await lessonRes.text();
    console.log("📦 Raw lessons response:", lessonsText);
    const lessons = JSON.parse(lessonsText);

    // 3. Obtener progreso del estudiante en este curso
    console.log(`➡️ Fetch progreso: http://localhost:8097/api/${studentId}/${courseId}`);
    const progRes = await fetch(`http://localhost:8097/api/${studentId}/${courseId}`);
    console.log("✅ Response progreso status:", progRes.status);
    const progressText = await progRes.text();
    console.log("📦 Raw progreso response:", progressText);
    const progress = JSON.parse(progressText);

    const completedLessons = progress?.completedLessons || [];

    // 4. Renderizar lista de lecciones
    lessonsList.innerHTML = lessons.map(lesson => `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <div>
          <input type="checkbox" class="form-check-input me-2" 
            data-lesson-id="${lesson.lessonId}"
            ${completedLessons.includes(lesson.lessonId) ? "checked" : ""}>
          ${lesson.title}
        </div>
        <button class="btn btn-sm btn-outline-primary">
          <i class="bi bi-play-circle"></i>
        </button>
      </li>
    `).join("");

    // 5. Manejar clicks en los checkboxes
    document.querySelectorAll("input[type=checkbox]").forEach(cb => {
      cb.addEventListener("change", async (e) => {
        const lessonId = e.target.getAttribute("data-lesson-id");
        const completed = e.target.checked;

        console.log(`📌 Lección ${lessonId} marcada como ${completed ? "completada" : "pendiente"}`);

        try {
          const updateRes = await fetch("http://localhost:8097/api/progress/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ studentId, courseId, lessonId, completed })
          });
          console.log("✅ Update progreso status:", updateRes.status);
        } catch (err) {
          console.error("❌ Error al actualizar progreso", err);
        }
      });
    });

  } catch (err) {
    console.error("❌ Error cargando curso:", err);
    courseInfo.innerHTML = `<p class="text-danger">Error cargando curso.</p>`;
  }
}

loadCourse();
