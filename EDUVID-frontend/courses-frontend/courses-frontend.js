import jwt_decode from "jwt-decode";

const token = localStorage.getItem("token");


if (token) {
  const decoded = jwt_decode(token);
  const now = Date.now() / 1000;
  if (decoded.exp < now) {
    // Token expirado → limpiar y redirigir
    localStorage.removeItem("token");
    window.location.href = "../login/login.html";
  }
}
// Necesitas incluir jwt-decode en tu proyecto:
// <script src="https://cdn.jsdelivr.net/npm/jwt-decode/build/jwt-decode.min.js"></script>

// === Verificar token ===

if (token) {
  try {
    const decoded = jwt_decode(token);
    const now = Date.now() / 1000;

    if (decoded.exp < now) {
      // Token expirado
      localStorage.removeItem("token");
      window.location.href = "../login/login.html";
    } else {
      // Token válido → configurar navbar
      configurarNav(decoded.rol);
    }
  } catch (err) {
    console.error("Error al decodificar el token:", err);
    localStorage.removeItem("token");
    window.location.href = "../login/login.html";
  }
} else {
  // Si no hay token → redirigir a login
  window.location.href = "../login/login.html";
}

// === Configuración del NavBar según rol ===
function configurarNav(rol) {
  const nav = document.querySelector(".navbar-nav");
  nav.innerHTML = ""; // limpiar

  if (rol === "profesor") {
    nav.innerHTML = `
      <li class="nav-item">
        <a class="nav-link" href="../dashboard/dashboard.html">Publicar</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="../estadisticas/estadisticas.html">Estadísticas</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="../catalogo/catalogo.html">Mi Catálogo</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" id="logout" href="#">Cerrar Sesión</a>
      </li>
    `;
  } else if (rol === "estudiante") {
    nav.innerHTML = `
      <li class="nav-item">
        <a class="nav-link" href="../catalogo/catalogo.html">Catálogo General</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="../dashboard/dashboard.html">Mis Cursos</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" id="logout" href="#">Cerrar Sesión</a>
      </li>
    `;
  }

  // Asignar logout
  document.getElementById("logout").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    window.location.href = "../login/login.html";
  });
}
