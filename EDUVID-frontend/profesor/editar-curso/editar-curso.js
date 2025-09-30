document.addEventListener("DOMContentLoaded", async () => {
  const formCurso = document.getElementById("form-editar-curso");
  const formLeccion = document.getElementById("form-leccion");
  const tabCurso = document.getElementById("tab-curso");
  const tabLeccion = document.getElementById("tab-leccion");
  const spinner = document.getElementById("spinner");

  const btnGuardarCurso = document.getElementById("btn-guardar");
  const btnEliminarCurso = document.getElementById("btn-eliminar");
  const btnGuardarLeccion = document.getElementById("btn-guardar-leccion");
  const btnEliminarLeccion = document.getElementById("btn-eliminar-leccion");

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
  });

  // 📥 Precargar curso
  try {
    const res = await fetch(`http://localhost:8095/api/info-curso/${cursoId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Error cargando curso");

    const curso = await res.json();
    document.getElementById("nombre").value = curso.nombre || "";
    document.getElementById("descripcion").value = curso.descripcion || "";
    document.getElementById("videoUrl").value = curso.videoUrl || "";
    document.getElementById("category").value = curso.category || "";

    spinner.classList.add("d-none");
    formCurso.classList.remove("d-none");
  } catch (err) {
    console.error("❌ Error cargando curso:", err);
    alert("No se pudo cargar el curso");
  }

  // 📌 Guardar curso
  btnGuardarCurso.addEventListener("click", async () => {
    const nombre = document.getElementById("nombre").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const videoUrl = document.getElementById("videoUrl").value.trim();
    const category = document.getElementById("category").value.trim();

    const res = await fetch(`http://localhost:8095/api/actualizar-curso/${cursoId}`, {
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

    const res = await fetch(`http://localhost:8095/api/eliminar-curso/${cursoId}`, {
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

    const res = await fetch(`http://localhost:5003/lessons`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ courseId: cursoId, title })
    });

    if (!res.ok) return alert("Error creando lección");
    alert("✅ Lección creada correctamente");
  });

  // 📌 Eliminar lección (ejemplo: deberías pasar el id de la lección)
  btnEliminarLeccion.addEventListener("click", async () => {
    const lessonId = prompt("Ingrese el ID de la lección a eliminar:");
    if (!lessonId) return;

    const res = await fetch(`http://localhost:5003/lessons/${lessonId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) return alert("Error eliminando lección");
    alert("🗑️ Lección eliminada correctamente");
  });
});
