let segundos = 0;
let intervalo = null;

// CONTADOR //
function iniciarContador() {
    console.log("empezado contador")
  if (intervalo !== null) return; 
  intervalo = setInterval(() => {
    segundos+= 0.1;
    document.getElementById("contador").textContent = segundos.toFixed(1);
  }, 100);
}

// CAMBIADOR DE IMAGENES //
const select = document.getElementById("modo");
const contenedor = document.getElementById("imagenes");

select.addEventListener("change", cambiarImagenes);

function cambiarImagenes() {
  let valor = select.value;

  let imagenes = [];

  if (valor === "mesa") {
    imagenes = ["/home/alumnos/victor/CSAAI/2025-2026-CSAAI-Practicas/P4/recursos/mesa.png", "/home/alumnos/victor/CSAAI/2025-2026-CSAAI-Practicas/P4/recursos/pesa.png"];
  }

  if (valor === "luna") {
    imagenes = ["/home/alumnos/victor/CSAAI/2025-2026-CSAAI-Practicas/P4/recursos/luna.png", "/home/alumnos/victor/CSAAI/2025-2026-CSAAI-Practicas/P4/recursos/cuna.png"];
  }

  if (valor === "pato") {
    imagenes = ["/home/alumnos/victor/CSAAI/2025-2026-CSAAI-Practicas/P4/recursos/pato.png", "/home/alumnos/victor/CSAAI/2025-2026-CSAAI-Practicas/P4/recursos/plato.jpeg"];
  }
  if (valor === "tapa") {
    imagenes = ["/home/alumnos/victor/CSAAI/2025-2026-CSAAI-Practicas/P4/recursos/tapa.jpeg", "/home/alumnos/victor/CSAAI/2025-2026-CSAAI-Practicas/P4/recursos/mapa.jpeg","/home/alumnos/victor/CSAAI/2025-2026-CSAAI-Practicas/P4/recursos/lata.png"];
  }

  // limpiar contenedor
  contenedor.innerHTML = "";

  // crear imágenes
  imagenes.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    img.style.width = "100px";
    contenedor.appendChild(img);
  });
}

// RESALTADOR DE IMAGENES //
