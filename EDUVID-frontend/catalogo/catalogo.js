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
