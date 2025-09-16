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


// dashboard.js, estadisticas.js, etc.
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  document.querySelectorAll(".nav-link").forEach(link => {
    if (path.includes(link.getAttribute("href").split("/").pop())) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
});