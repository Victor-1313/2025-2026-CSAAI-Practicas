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
// NIVEL //
  let valor = select.value;
  document.getElementById("contador").textContent = valor
  if (valor === "1"){
    document.getElementById("img1").src = imagenes[0];
    document.getElementById("img2").src = imagenes[0];
    document.getElementById("img3").src = imagenes[0];
    document.getElementById("img4").src = imagenes[0];
    document.getElementById("img5").src = imagenes[1];
    document.getElementById("img6").src = imagenes[1];
    document.getElementById("img7").src = imagenes[1];
    document.getElementById("img8").src = imagenes[1];
  }
  if (valor === "2"){
    document.getElementById("img1").src = imagenes[0];
    document.getElementById("img2").src = imagenes[0];
    document.getElementById("img3").src = imagenes[0];
    document.getElementById("img4").src = imagenes[1];
    document.getElementById("img5").src = imagenes[1];
    document.getElementById("img6").src = imagenes[1];
    document.getElementById("img7").src = imagenes[0];
    document.getElementById("img8").src = imagenes[1];
  }
  if (valor === "3"){
    document.getElementById("img1").src = imagenes[0];
    document.getElementById("img2").src = imagenes[1];
    document.getElementById("img3").src = imagenes[0];
    document.getElementById("img4").src = imagenes[1];
    document.getElementById("img5").src = imagenes[0];
    document.getElementById("img6").src = imagenes[1];
    document.getElementById("img7").src = imagenes[0];
    document.getElementById("img8").src = imagenes[1];
  }
  if (valor === "4"){
    document.getElementById("img1").src = imagenes[0];
    document.getElementById("img2").src = imagenes[1];
    document.getElementById("img3").src = imagenes[1];
    document.getElementById("img4").src = imagenes[0];
    document.getElementById("img5").src = imagenes[1];
    document.getElementById("img6").src = imagenes[0];
    document.getElementById("img7").src = imagenes[0];
    document.getElementById("img8").src = imagenes[1];
  }
  if (valor === "5"){
    document.getElementById("img1").src = imagenes[0];
    document.getElementById("img2").src = imagenes[1];
    document.getElementById("img3").src = imagenes[0];
    document.getElementById("img4").src = imagenes[0];
    document.getElementById("img5").src = imagenes[1];
    document.getElementById("img6").src = imagenes[1];
    document.getElementById("img7").src = imagenes[1];
    document.getElementById("img8").src = imagenes[0];
  }
}

// RESALTADOR DE IMAGENES //
