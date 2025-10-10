document.addEventListener("DOMContentLoaded", () => {
  const spinner = document.getElementById("spinner");
  const lessonsList = document.getElementById("lessons-list");
  const refreshBtn = document.getElementById("refresh-btn");
  const collapseEl = document.getElementById("lessonsCollapse");
  const chevronIcon = document.querySelector("h5 a i.bi-chevron-down");

  // Crear instancia del collapse una sola vez
  const collapse = new bootstrap.Collapse(collapseEl, { toggle: false });

  // Listener para cambiar el ícono
  collapseEl.addEventListener("show.bs.collapse", () => {
    chevronIcon.classList.replace("bi-chevron-down", "bi-chevron-up");
  });
  collapseEl.addEventListener("hide.bs.collapse", () => {
    chevronIcon.classList.replace("bi-chevron-up", "bi-chevron-down");
  });

  async function loadRecommendation() {
    try {
      // Siempre cerrar el collapse cuando traigo un curso nuevo
      collapse.hide();

      spinner.classList.remove("d-none");

      const res = await fetch("http://api.eduvid.lan:8080/courses/api/recomendacion");
      if (!res.ok) throw new Error("Error obteniendo recomendación");

      const course = await res.json();

      // Llenar info principal
      document.getElementById("course-title").textContent = course.nombre;
      document.getElementById("course-category").textContent = course.category || "Sin categoría";
      document.getElementById("course-title").dataset.id = course.id;
      document.getElementById("course-instructor").textContent = `ID ${course.instructorId}`;
      document.getElementById("course-description").textContent = course.descripcion || "";
      document.getElementById("course-lessons-count").textContent = course.lessons.length;
      document.getElementById("course-lessons-total").textContent = course.lessons.length;

      // Miniatura
      const thumbnail = document.querySelector(".col-md-5 img");
      thumbnail.src = course.videoUrl || "https://via.placeholder.com/600x400";
      thumbnail.alt = `Miniatura de ${course.nombre}`;

      // Si agregas un campo de precio en tu HTML, aquí puedes rellenarlo:
      // document.getElementById("course-price").textContent = "$29.99";

      // Lecciones (3 primeras)
      lessonsList.innerHTML = "";
      course.lessons.slice(0, 3).forEach((lesson) => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `
          <span><i class="bi bi-play-btn text-primary"></i> ${lesson.title}</span>
          <span class="badge bg-secondary">${lesson.duration || "--"} min</span>
        `;
        lessonsList.appendChild(li);
      });

      // Botón "Ver todas"
      if (course.lessons.length > 3) {
        const more = document.createElement("li");
        more.className = "list-group-item text-center text-primary fw-semibold";
        more.style.cursor = "pointer";
        more.innerHTML = `Ver todas las lecciones <i class="bi bi-arrow-right"></i>`;
        lessonsList.appendChild(more);

        more.addEventListener("click", () => {
          lessonsList.innerHTML = "";
          course.lessons.forEach((lesson) => {
            const li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center";
            li.innerHTML = `
              <span><i class="bi bi-play-btn text-primary"></i> ${lesson.title}</span>
              <span class="badge bg-secondary">${lesson.duration || "--"} min</span>
            `;
            lessonsList.appendChild(li);
          });
        });
      }
    } catch (err) {
      console.error("❌ Error cargando recomendación:", err);
    } finally {
      spinner.classList.add("d-none");
    }
  }

  // Evento para refrescar recomendación
  refreshBtn.addEventListener("click", loadRecommendation);

  // Cargar al inicio
  loadRecommendation();
});


// Botón inscribirme
const enrollBtn = document.getElementById("enroll-btn");

enrollBtn.addEventListener("click", async () => {
  try {
    // Obtener JWT
    const token = localStorage.getItem("jwt");
    if (!token) {
      alert("⚠️ No estás autenticado");
      return;
    }

    // Decodificar el JWT para obtener el studentId
    const payload = JSON.parse(atob(token.split(".")[1]));
    const studentId = payload.id;

    // Obtener datos del curso cargado actualmente
    const courseId = document.getElementById("course-title").dataset.id;
    const instructorId = document.getElementById("course-instructor").textContent.replace("ID ", "");

    // Petición al backend
    const res = await fetch("http://api.eduvid.lan:8080/enrollment/api/enrollUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // opcional si tu backend valida JWT
      },
      body: JSON.stringify({
        studentId,
        instructorId,
        courseId,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      alert(`❌ Error: ${error.message}`);
      return;
    }

    const data = await res.json();
    alert(`✅ Inscripción exitosa en el curso ${data.courseId}`);
  } catch (err) {
    console.error("❌ Error inscribiendo:", err);
    alert("Error en el servidor");
  }
});
