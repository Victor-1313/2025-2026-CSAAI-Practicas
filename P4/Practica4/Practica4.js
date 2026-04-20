let segundos = 0;
let intervalo = null;

function iniciarContador() {
    console.log("empezado contador")
  if (intervalo !== null) return; 
  intervalo = setInterval(() => {
    segundos++;
    document.getElementById("contador").textContent = segundos;
  }, 1000);
}