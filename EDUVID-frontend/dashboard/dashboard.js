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


document.addEventListener("DOMContentLoaded", () => {
  const uploadBox = document.getElementById("upload-box");
  const fileInput = document.getElementById("file-input");
  const preview = document.getElementById("preview");

  // Clic en el área => abrir input file
  uploadBox.addEventListener("click", () => fileInput.click());

  // Cambio de archivo
  fileInput.addEventListener("change", () => handleFile(fileInput.files[0]));

  // Drag & Drop
  uploadBox.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadBox.classList.add("dragging");
  });

  uploadBox.addEventListener("dragleave", () => {
    uploadBox.classList.remove("dragging");
  });

  uploadBox.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadBox.classList.remove("dragging");
    const file = e.dataTransfer.files[0];
    handleFile(file);
  });

  function handleFile(file) {
    if (!file) return;
    const allowed = ["video/mp4", "video/avi", "video/mkv", "video/quicktime"];
    if (!allowed.includes(file.type)) {
      alert("Formato no permitido. Solo se aceptan videos.");
      return;
    }

    preview.innerHTML = `
      <p><strong>Archivo:</strong> ${file.name}</p>
      <p><strong>Tamaño:</strong> ${(file.size / (1024*1024)).toFixed(2)} MB</p>
    `;
  }
});

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

