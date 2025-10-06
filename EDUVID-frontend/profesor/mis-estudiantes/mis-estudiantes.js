 document.addEventListener("DOMContentLoaded", async () => {
      try {
        const token = localStorage.getItem("jwt"); // asegúrate que guardaste el token así
        if (!token) {
          alert("No se encontró el token. Inicia sesión nuevamente.");
          return;
        }

        const decoded = JSON.parse(atob(token.split(".")[1])); // decodificar payload
        const teacherId = decoded.id; // id del profesor desde el JWT

        const res = await fetch(`http://api.eduvid.lan:8080/users/api/students-by-teacher/${teacherId}`, {
          headers: {
            // "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        const data = await res.json();
        const tbody = document.getElementById("studentsBody");
        tbody.innerHTML = "";

        if (data.length === 0) {
          tbody.innerHTML = `<tr><td colspan="6">No tienes estudiantes inscritos todavía.</td></tr>`;
          return;
        }

        data.forEach((enroll, idx) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${idx + 1}</td>
            <td>${enroll.student?.email || "N/A"}</td>
            <td>${enroll.student?.rol || "N/A"}</td>
            <td>${enroll.course?.title || "Curso eliminado"}</td>
            <td>${enroll.course?.category || "-"}</td>
            <td>${new Date(enroll.enrollmentDateStart).toLocaleDateString()}</td>
          `;
          tbody.appendChild(tr);
        });
      } catch (err) {
        console.error("Error cargando estudiantes:", err);
        document.getElementById("studentsBody").innerHTML =
          `<tr><td colspan="6">Error al cargar los estudiantes.</td></tr>`;
      }
    });