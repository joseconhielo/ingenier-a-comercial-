document.addEventListener("DOMContentLoaded", () => {
  const cursos = document.querySelectorAll(".course");
  const estado = JSON.parse(localStorage.getItem("estadoCursos") || "{}");

  cursos.forEach(curso => {
    const id = curso.dataset.id;
    const unlocks = curso.dataset.unlocks ? curso.dataset.unlocks.split(",") : [];

    // Estado inicial
    if (estado[id] === "aprobado") {
      curso.classList.add("approved");
      curso.classList.remove("locked");
    } else if (!curso.classList.contains("locked")) {
      curso.classList.add("locked");
    }
  });

  const actualizarEstado = () => {
    const estado = {};
    cursos.forEach(curso => {
      const id = curso.dataset.id;
      if (id && curso.classList.contains("approved")) {
        estado[id] = "aprobado";
      }
    });
    localStorage.setItem("estadoCursos", JSON.stringify(estado));
  };

  cursos.forEach(curso => {
    curso.addEventListener("click", () => {
      const id = curso.dataset.id;
      const unlocks = curso.dataset.unlocks ? curso.dataset.unlocks.split(",") : [];

      if (curso.classList.contains("locked")) return;

      // Alternar aprobado
      curso.classList.toggle("approved");

      // Desbloquear dependencias si fue aprobado
      if (curso.classList.contains("approved")) {
        unlocks.forEach(dependienteId => {
          const dependiente = document.querySelector(`.course[data-id="${dependienteId}"]`);
          if (dependiente) {
            dependiente.classList.remove("locked");
          }
        });
      } else {
        // Si se desaprueba, bloquear dependientes
        unlocks.forEach(dependienteId => {
          const dependiente = document.querySelector(`.course[data-id="${dependienteId}"]`);
          if (dependiente && !estado[dependienteId]) {
            dependiente.classList.add("locked");
            dependiente.classList.remove("approved");
          }
        });
      }

      actualizarEstado();
    });
  });
});
