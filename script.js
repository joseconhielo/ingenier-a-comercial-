// ======================
//  Malla interactiva
// ======================
document.addEventListener('DOMContentLoaded', () => {

  /* ----- MAPEO DE CURSOS Y PRERREQUISITOS ----- */
  const cursos  = [...document.querySelectorAll('.course')];

  // 1. Construimos un mapa id -> [prerreq1, prerreq2...] invirtiendo los "unlocks"
  const prereqMap = new Map();
  cursos.forEach(el => prereqMap.set(el.dataset.id, []));   // arr vacío por defecto

  cursos.forEach(el => {
    const id       = el.dataset.id;
    const unlocks  = (el.dataset.unlocks || '')
                     .split(',')
                     .map(x => x.trim())
                     .filter(Boolean);

    unlocks.forEach(dep => {
      // añadimos 'id' como prerrequisito de 'dep'
      prereqMap.set(dep, [...(prereqMap.get(dep) || []), id]);
    });
  });

  /* ----- ESTADO GUARDADO EN LOCALSTORAGE ----- */
  const estado = JSON.parse(localStorage.getItem('estadoCursos') || '{}'); // {id:true}

  /* ----- FUNCIONES GLOBALES ----- */
  function actualizarUI(){
    cursos.forEach(el => {
      const id        = el.dataset.id;
      const aprobado  = !!estado[id];
      const prereqs   = prereqMap.get(id) || [];

      if (aprobado){
        el.classList.add('approved');
        el.classList.remove('locked');
      }else{
        el.classList.remove('approved');
        // ¿Debe estar bloqueado?
        const bloqueado = prereqs.some(pr => !estado[pr]);
        if (bloqueado){
          el.classList.add('locked');
        }else{
          el.classList.remove('locked');
        }
      }
    });
  }

  function guardarEstado(){
    localStorage.setItem('estadoCursos', JSON.stringify(estado));
  }

  /* ----- EVENTO DE CLIC EN CADA CURSO ----- */
  cursos.forEach(el => {
    el.addEventListener('click', () => {

      if (el.classList.contains('locked')) return; // aún no habilitado

      const id = el.dataset.id;
      // Cambiar estado (toggle)
      estado[id] = !estado[id];
      guardarEstado();
      actualizarUI();       // recalculamos bloqueos / desbloqueos
    });
  });

  /* ----- INICIALIZACIÓN ----- */
  actualizarUI();
});
