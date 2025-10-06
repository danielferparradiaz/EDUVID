document.addEventListener("DOMContentLoaded", async () => {
  const spinner = document.getElementById("spinner");
  const container = document.getElementById("coursesContainer");
  const pagination = document.querySelector(".pagination");

  let cursos = [];
  let currentPage = 1;
  const itemsPerPage = 3;

  // 🔹 Obtener ID de profesor desde el JWT
  function getTeacherIdFromJWT() {
    const token = localStorage.getItem("jwt");
    if (!token) return null;

    try {
      const payloadBase64 = token.split(".")[1];
      const payload = JSON.parse(atob(payloadBase64));
      return payload.id || null;
    } catch (e) {
      console.error("Error decodificando JWT:", e);
      return null;
    }
  }

  // 🔹 Renderizar cursos por página
  function renderCursos(page) {
    container.innerHTML = "";

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageCursos = cursos.slice(start, end);

    if (pageCursos.length === 0) {
      renderEmptyState();
      return;
    }

    pagination.classList.remove("d-none");

    pageCursos.forEach(curso => {
      const card = document.createElement("div");
      card.className = "col-md-4 mt-3";
      card.innerHTML = `
        <div class="card border-secondary shadow-sm h-100">
          <img src="https://aulasenvivo.com/wp-content/uploads/2020/06/videoclasesgrabadas.jpg"
               class="card-img-top rounded-top" 
               alt="Imagen curso" style="height: 150px; object-fit: cover;">
          <div class="card-body text-center">
            <h5 class="card-title text-uppercase fw-bold">${curso.nombre}</h5>
            <p class="card-text text-muted">${curso.descripcion}</p>
            <span class="badge bg-primary">${curso.category}</span>
          </div>
          <div class="card-footer text-center">
            <a type="button" class="btn btn-outline-primary btn-sm" 
               href="./editar-curso/editar-curso.html?id=${curso.id}">
              Editar Curso
            </a>
          </div>
        </div>
      `;
      container.appendChild(card);
    });

    renderPagination();
  }

  // 🔹 Renderizar paginación
  function renderPagination() {
    const totalPages = Math.ceil(cursos.length / itemsPerPage);
    const prevBtn = pagination.querySelector(".prev");
    const nextBtn = pagination.querySelector(".next");
    const pageNumbers = pagination.querySelector(".page-numbers");

    pageNumbers.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
      const li = document.createElement("li");
      li.className = `page-item ${i === currentPage ? "active" : ""}`;
      li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
      li.addEventListener("click", (e) => {
        e.preventDefault();
        currentPage = i;
        renderCursos(currentPage);
      });
      pageNumbers.appendChild(li);
    }

    prevBtn.classList.toggle("disabled", currentPage === 1);
    nextBtn.classList.toggle("disabled", currentPage === totalPages);

    prevBtn.onclick = (e) => {
      e.preventDefault();
      if (currentPage > 1) {
        currentPage--;
        renderCursos(currentPage);
      }
    };

    nextBtn.onclick = (e) => {
      e.preventDefault();
      if (currentPage < totalPages) {
        currentPage++;
        renderCursos(currentPage);
      }
    };
  }

  // 🔹 Estado vacío con formulario embebido
  function renderEmptyState() {
    container.innerHTML = `
      <div id="emptyStateBlock" class="text-center my-5">
        <h5 class="text-info-emphasis fw-bold">Aún no tienes cursos creados.</h5>
        <p class="text-muted">¡Crea tu primer curso y empieza a enseñar!</p>
        <button id="showFormBtn" class="btn btn-success btn-lg">
          + Crear Curso
        </button>
      </div>
      <div id="createFormContainer" class="mt-4 d-none"></div>
    `;

    document.getElementById("showFormBtn").addEventListener("click", () => {
      showCreateForm();
      document.getElementById("emptyStateBlock").classList.add("d-none");
    });
  }

  // 🔹 Mostrar formulario (se usa tanto en vacío como con el botón +)
  function showCreateForm() {
    if (document.getElementById("createCourseForm")) return; // evitar duplicados

    const formHTML = `
      <div class="card shadow-sm">
        <div class="card-body">
          <h5 class="card-title">Nuevo Curso</h5>
          <form id="createCourseForm" class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Nombre</label>
              <input type="text" class="form-control" name="nombre" required>
            </div>
            <div class="col-md-6">
              <label class="form-label">Categoría</label>
              <input type="text" class="form-control" name="category" required>
            </div>
            <div class="col-12">
              <label class="form-label">Descripción</label>
              <textarea class="form-control" name="descripcion" rows="3" required></textarea>
            </div>
            <div class="col-12">
              <label class="form-label">URL del Video</label>
              <input type="url" class="form-control" name="videoUrl" required>
            </div>
            <div class="col-12 text-end">
              <button type="submit" class="btn btn-primary">Guardar</button>
              <button type="button" id="cancelFormBtn" class="btn btn-secondary ms-2">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    `;

    // Si está el emptyState, usar su contenedor
    let formContainer = document.getElementById("createFormContainer");
    if (!formContainer) {
      formContainer = document.createElement("div");
      formContainer.id = "createFormContainer";
      formContainer.className = "mt-4";
      container.insertAdjacentElement("afterbegin", formContainer);
    }

    formContainer.innerHTML = formHTML;

    // Cancelar formulario
    document.getElementById("cancelFormBtn").addEventListener("click", () => {
      formContainer.remove();
    });

    // Enviar formulario
    document.getElementById("createCourseForm").addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      data.instructorId = getTeacherIdFromJWT();

      try {
        const res = await fetch("http://api.eduvid.lan:8080/courses/api/crear-curso", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("jwt")}`
          },
          body: JSON.stringify(data)
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.error || "Error al crear curso");

        alert("✅ Curso creado correctamente");
        location.reload();

      } catch (err) {
        alert("❌ " + err.message);
      }
    });
  }

  // 🔹 Botón + en el header
  const addCourseBtn = document.getElementById("addCourseBtn");
  if (addCourseBtn) {
    addCourseBtn.addEventListener("click", () => {
      showCreateForm();
    });
  }

  // 🔹 Cargar cursos al inicio
  try {
    spinner.classList.remove("d-none");
    spinner.classList.add("d-flex");

    const teacherId = getTeacherIdFromJWT();
    if (!teacherId) throw new Error("No se pudo obtener el ID del profesor desde el token.");

    const res = await fetch(`http://api.eduvid.lan:8080/courses/api/listarByTeacherId/${teacherId}`, {
      headers: { "Authorization": `Bearer ${localStorage.getItem("jwt")}` }
    });

    if (res.status === 404) {
      spinner.classList.add("d-none");
      spinner.classList.remove("d-flex");
      renderEmptyState();
      pagination.classList.add("d-none");
      return;
    }

    if (!res.ok) throw new Error("Error al obtener cursos");

    cursos = await res.json();

    spinner.classList.add("d-none");
    spinner.classList.remove("d-flex");

    renderCursos(currentPage);
  } catch (err) {
    spinner.classList.add("d-none");
    spinner.classList.remove("d-flex");
    container.innerHTML = `<p class="text-center text-danger">Error cargando cursos: ${err.message}</p>`;
    pagination.classList.add("d-none");
  }
});
