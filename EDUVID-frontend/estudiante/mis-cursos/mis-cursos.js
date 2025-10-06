function getUserFromToken() {
  const token = localStorage.getItem("jwt");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload; // { id, email, rol, iat, exp }
  } catch (err) {
    console.error("Error decodificando JWT:", err);
    return null;
  }
}

const user = getUserFromToken();
const studentId = user.id; // Simulación de estudiante logueado
const coursesContainer = document.getElementById("courses-container");
const spinner = document.getElementById("spinner");

async function loadCourses() {
  try {
    console.log("🔎 Iniciando carga de cursos para estudiante:", studentId);

    // 🔎 1. Obtener inscripciones del estudiante
    console.log("➡️ Fetch enrollments...");
    const enrollRes = await fetch(`http://api.eduvid.lan:8080/users/api/by-student/${studentId}`);
    console.log("✅ Response enrollments status:", enrollRes.status);

    const enrollments = await enrollRes.json();
    console.log("📦 Enrollments obtenidos:", enrollments);

    if (!enrollments.length) {
      console.warn("⚠️ No hay inscripciones para este estudiante");
      coursesContainer.innerHTML = `<p class="text-center text-muted">No estás inscrito en ningún curso todavía.</p>`;
      spinner.classList.add("d-none");
      coursesContainer.classList.remove("d-none");
      return;
    }

    let html = "";
    for (const enr of enrollments) {
      console.log("➡️ Procesando enrollment:", enr);

      // 🔎 2. Obtener detalles del curso
      console.log(`➡️ Fetch curso ID ${enr.courseId}...`);
      const courseRes = await fetch(`http://api.eduvid.lan:8080/courses/api/info-curso/${enr.courseId}`);
      console.log("✅ Response curso status:", courseRes.status);

      const course = await courseRes.json();
      console.log("📦 Datos curso:", course);

      // 🔎 3. Obtener progreso del estudiante en el curso
      console.log(`➡️ Fetch progreso estudiante=${studentId}, curso=${enr.courseId}...`);
      const progRes = await fetch(`http://api.eduvid.lan:8080/progress/api/${studentId}/${enr.courseId}`);
      console.log("✅ Response progreso status:", progRes.status);

      const progress = await progRes.json();
      console.log("📦 Progreso obtenido:", progress);

      const percent = progress?.percentage || 0;

      html += `
          <div class="col-md-6 col-lg-4">
            <div class="card shadow-sm h-100">
              <img src="${course.videoUrl || 'https://via.placeholder.com/400x200'}" class="card-img-top" alt="Curso">
              <div class="card-body">
                <h5 class="card-title fw-bold">${course.nombre}</h5>
                <p class="card-text text-muted small">${course.descripcion || 'Sin descripción disponible.'}</p>
                <div class="mb-2">
                  <div class="progress" style="height: 8px;">
                    <div class="progress-bar bg-success" role="progressbar" style="width: ${percent}%"
                      aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                  <small class="text-muted">${percent}% completado</small>
                </div>
                <a href="curso/curso.html?id=${course.id}&student=${studentId}" 
   class="btn btn-sm btn-primary w-100">
  <i class="bi bi-play-circle"></i> Continuar curso
</a>

                </a>
              </div>
            </div>
          </div>`;
    }

    coursesContainer.innerHTML = html;
  } catch (error) {
    console.error("❌ Error cargando cursos:", error);
    coursesContainer.innerHTML = `<p class="text-danger text-center">Error al cargar tus cursos.</p>`;
  } finally {
    spinner.classList.add("d-none");
    coursesContainer.classList.remove("d-none");
  }
}

loadCourses();