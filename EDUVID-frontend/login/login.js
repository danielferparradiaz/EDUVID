document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("auth-form");
  const formTitle = document.getElementById("form-title");
  const submitBtn = document.getElementById("submit-btn");
  const roleContainer = document.getElementById("role-container");
  const passwordContainer = document.getElementById("password-container");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  // Links
  const toggleRegister = document.getElementById("toggle-register");
  const toggleForgot = document.getElementById("toggle-forgot");
  const toggleLogin = document.getElementById("toggle-login");
  const toggleLoginContainer = document.getElementById("toggle-login-container");
  const toggleRegisterContainer = document.getElementById("toggle-register-container");
  const toggleForgotContainer = document.getElementById("toggle-forgot-container");

  // Estado del formulario
  let mode = "login"; // valores: "login", "register", "forgot"

  // 🔹 Cambiar de modo
  function setMode(newMode) {
    mode = newMode;

    if (mode === "login") {
      formTitle.textContent = "Bienvenido";
      submitBtn.textContent = "Ingresar";
      roleContainer.classList.remove("d-none");
      passwordContainer.classList.remove("d-none");
      emailInput.value = "";
      passwordInput.value = "";
      toggleLoginContainer.classList.add("d-none");
      toggleRegisterContainer.classList.remove("d-none"); // mostrar Registrarme
      toggleForgotContainer.classList.remove("d-none");   // mostrar Olvidé contraseña
    }

    if (mode === "register") {
      formTitle.textContent = "Registro";
      submitBtn.textContent = "Registrarme";
      roleContainer.classList.remove("d-none");
      passwordContainer.classList.remove("d-none");
      emailInput.value = "";
      passwordInput.value = "";
      toggleLoginContainer.classList.remove("d-none");
      toggleRegisterContainer.classList.add("d-none"); // ocultar Registrarme
      toggleForgotContainer.classList.add("d-none");   // ocultar Olvidé contraseña
    }

    if (mode === "forgot") {
      formTitle.textContent = "Recuperar contraseña";
      submitBtn.textContent = "Enviar enlace";
      roleContainer.classList.add("d-none");
      passwordContainer.classList.add("d-none");
      emailInput.value = "";
      toggleLoginContainer.classList.remove("d-none");
      toggleRegisterContainer.classList.add("d-none"); // ocultar Registrarme
      toggleForgotContainer.classList.add("d-none");   // ocultar Olvidé contraseña
    }
  }

  // Eventos de links
  toggleRegister.addEventListener("click", e => {
    e.preventDefault();
    setMode("register");
  });

  toggleForgot.addEventListener("click", e => {
    e.preventDefault();
    setMode("forgot");
  });

  toggleLogin.addEventListener("click", e => {
    e.preventDefault();
    setMode("login");
  });

  // --- HASH con SHA-256 ---
  async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  }

  // --- Enviar formulario ---
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuario = emailInput.value.trim();
    const password = passwordInput.value;

    let payload = { email: usuario };


    try {
      if (mode === "login") {
        const rol = document.querySelector("input[name='rol']:checked")?.value;
        if (!rol) return alert("Selecciona un rol.");
        payload.rol = rol;
        // payload.password = await sha256(password);
        payload.password = password;

        console.log(payload);


        const res = await fetch("http://localhost:9000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const data = await res.json();
          localStorage.setItem("jwt", data.token);
          window.location.href = "../../EDUVID-frontend/dashboard/dashboard.html";
        } else {
          alert("Error en login");
          console.log(res);
        }
      }

      if (mode === "register") {
        const rol = document.querySelector("input[name='rol']:checked")?.value;
        if (!rol) return alert("Selecciona un rol.");
        payload.rol = rol;
        payload.password = password;

        const res = await fetch("http://localhost:9000/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          alert("Usuario registrado con éxito");
          setMode("login"); // volvemos a login
        } else {
          console.log(res);
          alert("Error en registro");
        }
      }

      if (mode === "forgot") {
        const res = await fetch("http://localhost:9000/api/forgot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          alert("Se envió un enlace a tu correo");
          setMode("login");
        } else {
          alert("No se pudo procesar la solicitud");
        }
      }
    } catch (err) {
      console.error("Error de conexión:", err);
      alert("Servidor no disponible.");
    }
  });

  // Iniciar en modo login
  setMode("login");
});



