// VARIABLES
let claveSecreta = [];
let intentosMax = 7;
let intentosRestantes = intentosMax;
let intentosUsados = 0;

let cronometro;
let tiempo = 0;
let iniciado = false;

// ELEMENTOS
const caption = document.querySelector("caption");
const casillas = document.querySelectorAll("th");
const botones = document.querySelectorAll(".boton");
const startBtn = document.getElementById("bestart");
const stopBtn = document.getElementById("bstop");
const resetBtn = document.getElementById("breset");
const intentosTexto = document.getElementById("intentos");

// FORMATO TIEMPO
function formatearTiempo(seg) {
    let h = Math.floor(seg / 3600);
    let m = Math.floor((seg % 3600) / 60);
    let s = seg % 60;
    return `${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`;
}

// CRONÓMETRO
function iniciarCronometro() {
    if (!iniciado) {
        cronometro = setInterval(() => {
            tiempo++;
            caption.textContent = formatearTiempo(tiempo);
        }, 1000);
        iniciado = true;
    }
}

function pararCronometro() {
    clearInterval(cronometro);
    iniciado = false;
}

function resetCronometro() {
    pararCronometro();
    tiempo = 0;
    caption.textContent = "00:00:00";
}

// GENERAR CLAVE
function generarClave() {
    let numeros = [];
    while (numeros.length < 4) {
        let n = Math.floor(Math.random() * 10);
        if (!numeros.includes(n)) {
            numeros.push(n);
        }
    }
    claveSecreta = numeros;
    console.log("CLAVE:", claveSecreta); // debug
}

// MOSTRAR ASTERISCOS
function ocultarClave() {
    casillas.forEach(c => {
        c.textContent = "*";
        c.style.color = "rgb(55, 196, 12)";
    });
}

// RESET COMPLETO
function resetJuego() {
    resetCronometro();
    generarClave();
    ocultarClave();

    intentosRestantes = intentosMax;
    intentosUsados = 0;

    intentosTexto.textContent = intentosRestantes;
    
    botones.forEach(b => {
        if (b.id.startsWith("b") && b.id.length === 2) {
            b.disabled = false;
            b.style.backgroundColor = "";
        }
    });
}

// COMPROBAR NÚMERO
function comprobarNumero(num, boton) {
    if (!iniciado) iniciarCronometro();

    intentosRestantes--;
    intentosUsados++;

    intentosTexto.textContent = intentosRestantes;

    let acierto = false;

    claveSecreta.forEach((n, i) => {
        if (n == num) {
            casillas[i].textContent = num;
            casillas[i].style.color = "green";
            acierto = true;
        }
    });

    // desactivar botón
    boton.disabled = true;
    boton.style.backgroundColor = "gray";

    comprobarFin();
}

// COMPROBAR FIN
function comprobarFin() {
    let descubiertos = [...casillas].every(c => c.textContent !== "*");

    if (descubiertos) {
        pararCronometro();
        alert(`¡GANASTE!
Tiempo: ${formatearTiempo(tiempo)}
Intentos usados: ${intentosUsados}
Intentos restantes: ${intentosRestantes}`);
    }

    if (intentosRestantes <= 0 && !descubiertos) {
        pararCronometro();
        alert(`PERDISTE
Clave: ${claveSecreta.join("")}`);
    }
}

// EVENTOS BOTONES NUMÉRICOS
botones.forEach(boton => {
    boton.addEventListener("click", () => {
        let valor = boton.textContent;
        if (!isNaN(valor)) {
            comprobarNumero(valor, boton);
        }
    });
});

// START
startBtn.addEventListener("click", iniciarCronometro);

// STOP
stopBtn.addEventListener("click", pararCronometro);

// RESET
resetBtn.addEventListener("click", resetJuego);

// INICIAL
resetJuego();