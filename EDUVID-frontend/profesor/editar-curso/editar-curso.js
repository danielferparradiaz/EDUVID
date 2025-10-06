document.addEventListener("DOMContentLoaded", async () => {
  const formCurso = document.getElementById("form-editar-curso");
  const formLeccion = document.getElementById("form-leccion");
  const tabCurso = document.getElementById("tab-curso");
  const tabLeccion = document.getElementById("tab-leccion");
  const spinner = document.getElementById("spinner");

  const btnGuardarCurso = document.getElementById("btn-guardar");
  const btnEliminarCurso = document.getElementById("btn-eliminar");
  const btnGuardarLeccion = document.getElementById("btn-guardar-leccion");

  const params = new URLSearchParams(window.location.search);
  const cursoId = params.get("id");

  const token = localStorage.getItem("jwt");

  if (!cursoId || !token) {
    alert("Error: curso no especificado o sesión inválida.");
    window.location.href = "../profesor.html";
    return;
  }

  // 📌 Alternar tabs
  tabCurso.addEventListener("click", () => {
    tabCurso.classList.add("text-primary", "fw-bold");
    tabLeccion.classList.remove("text-primary", "fw-bold");
    formCurso.classList.remove("d-none");
    formLeccion.classList.add("d-none");
  });

  tabLeccion.addEventListener("click", () => {
    tabLeccion.classList.add("text-primary", "fw-bold");
    tabCurso.classList.remove("text-primary", "fw-bold");
    formLeccion.classList.remove("d-none");
    formCurso.classList.add("d-none");

    // cargar listado
    cargarLecciones(cursoId, token);
  });

  // 📥 Precargar curso
  try {
    const res = await fetch(`http://api.eduvid.lan:8080/courses/api/info-curso/${cursoId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Error cargando curso");

    const curso = await res.json();
    document.getElementById("nombre").value = curso.nombre || "";
    document.getElementById("descripcion").value = curso.descripcion || "";
    document.getElementById("videoUrl").value = curso.videoUrl || "";
    document.getElementById("category").value = curso.category || "";
    document.getElementById("curso-nombre-lecciones").textContent = curso.nombre || "";


    spinner.classList.add("d-none");
    formCurso.classList.remove("d-none");
  } catch (err) {
    console.error("❌ Error cargando curso:", err);
    alert("No se pudo cargar el curso");
  }

  async function cargarLecciones(cursoId, token) {
    try {
      const res = await fetch(`http://api.eduvid.lan:8080/content/lessons?courseId=${cursoId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Error cargando lecciones");

      const lecciones = await res.json();
      const lista = document.getElementById("lista-lecciones");
      lista.innerHTML = "";

      if (lecciones.length === 0) {
        lista.innerHTML = `<li class="list-group-item text-muted">Aún no hay lecciones.</li>`;
        return;
      }

      renderLecciones(lecciones);

    } catch (err) {
      console.error("❌ Error cargando lecciones:", err);
      alert("No se pudieron cargar las lecciones");
    }
  }


 window.eliminarLeccion = async function(lessonId) {
  if (!confirm("¿Eliminar esta lección?")) return;

  const res = await fetch(`http://api.eduvid.lan:8080/content/lessons/${lessonId}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  });

  if (!res.ok) return alert("Error eliminando lección");
  alert("🗑️ Lección eliminada correctamente");

  cargarLecciones(cursoId, token);
}



  // 📌 Guardar curso
  btnGuardarCurso.addEventListener("click", async () => {
    const nombre = document.getElementById("nombre").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const videoUrl = document.getElementById("videoUrl").value.trim();
    const category = document.getElementById("category").value.trim();

    const res = await fetch(`http://api.eduvid.lan:8080/courses/api/actualizar-curso/${cursoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ nombre, descripcion, videoUrl, category })
    });

    if (!res.ok) return alert("Error actualizando curso");
    alert("✅ Curso actualizado correctamente");
  });

  // 📌 Eliminar curso
  btnEliminarCurso.addEventListener("click", async () => {
    if (!confirm("¿Eliminar curso?")) return;

    const res = await fetch(`http://api.eduvid.lan:8080/api/eliminar-curso/${cursoId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) return alert("Error eliminando curso");
    alert("🗑️ Curso eliminado correctamente");
    window.location.href = "../profesor.html";
  });

  // 📌 Guardar lección
  btnGuardarLeccion.addEventListener("click", async () => {
    const title = document.getElementById("lesson-title").value.trim();
    if (!title) return alert("⚠️ Escribe un título para la lección");

    const res = await fetch(`http://api.eduvid.lan:8080/content/lessons`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ courseId: cursoId, title })
    });

    if (!res.ok) return alert("Error creando lección");
    alert("✅ Lección creada correctamente");

    document.getElementById("lesson-title").value = "";
    cargarLecciones(cursoId, token);
  });

});


function renderLecciones(lecciones) {
  const lista = document.getElementById("lista-lecciones");
  lista.innerHTML = "";

  lecciones.forEach((l, i) => {
    const div = document.createElement("div");
    div.className = "col-12";

    div.innerHTML = `
       <div class="card shadow-sm border-0">
        <div class="card-body d-flex justify-content-between align-items-center">
          <div id="leccion-view-${l.lessonId}" class="w-100 d-flex justify-content-between align-items-center">
            <h6 class="fw-bold mb-0">Lección ${i + 1}: ${l.title}</h6>
            <div>
              <button class="btn btn-sm btn-outline-primary me-2" onclick="editarLeccion(${l.lessonId}, '${l.title}')">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger" onclick="eliminarLeccion(${l.lessonId})">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>

          <!-- Vista edición oculta -->
          <div id="leccion-edit-${l.lessonId}" class="d-none w-100">
            <div class="d-flex justify-content-between align-items-center">
              <input type="text" id="edit-input-${l.lessonId}" class="form-control me-2" value="${l.title}">
              <button class="btn btn-success btn-sm" onclick="guardarEdicion(${l.lessonId})">
                <i class="bi bi-check2"></i> Guardar
              </button>
              <button class="btn btn-secondary btn-sm ms-2" onclick="cancelarEdicion(${l.lessonId})">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    lista.appendChild(div);
  });
}

// Lógica editar
window.editarLeccion = function(id, title) {
  document.getElementById(`leccion-view-${id}`).classList.add("d-none");
  document.getElementById(`leccion-edit-${id}`).classList.remove("d-none");
}

window.cancelarEdicion = function(id) {
  document.getElementById(`leccion-view-${id}`).classList.remove("d-none");
  document.getElementById(`leccion-edit-${id}`).classList.add("d-none");
}

window.guardarEdicion = async function(id) {
  try {
    const nuevoTitulo = document.getElementById(`edit-input-${id}`).value;

    const res = await fetch(`http://api.eduvid.lan:8080/content/lessons/${id}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("jwt")}` // <-- vuelve a ponerlo
      },
      body: JSON.stringify({ title: nuevoTitulo })
    });

    if (!res.ok) throw new Error("Error al actualizar");

    // ✅ lee la respuesta y úsala
    const updated = await res.json();
    console.log("✅ Lección actualizada:", updated);

    alert("✅ Lección actualizada correctamente");
    await cargarLecciones(cursoId, localStorage.getItem("jwt"));

  } catch (err) {
    console.error("❌ Error en guardarEdicion:", err);
    alert("Error al actualizar la lección ❌");
  }
}




