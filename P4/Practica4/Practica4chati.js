// Practica4.js

document.addEventListener("DOMContentLoaded", () => {
  // ===== ELEMENTOS =====
  const imgs = Array.from({ length: 8 }, (_, i) =>
    document.getElementById(`img${i + 1}`)
  );

  const nivelText = document.getElementById("nivel");
  const tiempoText = document.getElementById("contador");
  const estadoText = document.getElementById("estado");

  const musicBtn = Array.from(document.querySelectorAll("button"))
    .find(b => b.textContent.toLowerCase().includes("musica"));

  const startBtn = Array.from(document.querySelectorAll("button"))
    .find(b => b.textContent.toLowerCase().includes("empezar partida"));

  const stopBtn = Array.from(document.querySelectorAll("button"))
    .find(b => b.textContent.toLowerCase().includes("detener"));

  const bigStartBtn = Array.from(document.querySelectorAll("button"))
    .find(b => b.textContent.trim().toLowerCase() === "empezar");

  const difficultySelect = document.querySelector('select[name="Dificultad"]');
  const modalitySelect = document.querySelector('select[name="Modalidad"]');

  // ===== AUDIO =====
  const audio = new Audio("music.mp3"); // cambia el archivo si quieres
  audio.loop = true;
  let musicOn = false;

  // ===== ESTADO =====
  let currentLevel = 1;
  let startLevel = 1;

  let timer = 0;
  let timerInterval = null;

  let running = false;
  let stopRequested = false;

  let sequenceTimeouts = [];

  // ===== UTILIDADES =====
  function setState(text) {
    estadoText.textContent = text;
  }

  function resetHighlights() {
    imgs.forEach(img => img.classList.remove("active"));
  }

  function disableControls(disabled) {
    difficultySelect.disabled = disabled;
    modalitySelect.disabled = disabled;
    startBtn.disabled = disabled;
    bigStartBtn.disabled = disabled;
  }

  function updateTimer() {
    timerTextUpdate();
    timerInterval = setInterval(() => {
      timer++;
      timerTextUpdate();
    }, 1000);
  }

  function timerTextUpdate() {
    tiempoText.textContent = timer;
  }

  function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  function stopAllTimeouts() {
    sequenceTimeouts.forEach(t => clearTimeout(t));
    sequenceTimeouts = [];
  }

  // ===== MUSICA =====
  musicBtn.addEventListener("click", () => {
    musicOn = !musicOn;
    if (musicOn && running) audio.play();
    else audio.pause();
  });

  // ===== DISTRIBUCIÓN =====
  function getGrid(level, modality) {
    // base sets simples por modalidad
    const sets = {
      mesa: ["mesa", "mesa", "mesa", "mesa", "pesa", "pesa", "pesa", "pesa"],
      luna: ["luna", "cuna", "luna", "cuna", "luna", "cuna", "luna", "cuna"],
      pato: ["pato", "plato", "plato", "pato", "pato", "plato", "plato", "pato"],
      tapa: ["tapa", "mapa", "lata", "tapa", "mapa", "lata", "tapa", "mapa"]
    };

    let base = sets[modality] || sets.mesa;

    // variación por nivel (shuffle controlado)
    for (let i = 0; i < level; i++) {
      base = base.slice().sort(() => Math.random() - 0.5);
    }

    return base;
  }

  // ===== SECUENCIA =====
  function highlightSequence(level, modality, speed) {
    const grid = getGrid(level, modality);

    return new Promise((resolve) => {
      let i = 0;

      function step() {
        if (!running || stopRequested) return;

        resetHighlights();

        const img = imgs[i];
        if (img) {
          img.classList.add("active");
          img.textContent = grid[i]; // opcional visual si es texto
        }

        i++;

        if (i < 8) {
          const t = setTimeout(step, speed);
          sequenceTimeouts.push(t);
        } else {
          const t = setTimeout(resolve, speed);
          sequenceTimeouts.push(t);
        }
      }

      step();
    });
  }

  // ===== LOOP PRINCIPAL =====
  async function playGame() {
    running = true;
    stopRequested = false;

    startLevel = parseInt(difficultySelect.value);
    const modality = modalitySelect.value;

    currentLevel = startLevel;

    disableControls(true);
    setState("Jugando");

    timer = 0;
    updateTimer();

    if (musicOn) audio.play();

    for (let lvl = startLevel; lvl <= 5; lvl++) {
      if (stopRequested) break;

      nivelText.textContent = `${lvl}/5`;

      // preparación entre niveles
      setState("Preparación");
      await new Promise(r => setTimeout(r, 800));
      if (stopRequested) break;

      // velocidad progresiva
      const speed = Math.max(200, 1000 - lvl * 150);

      setState("Nivel " + lvl);

      await highlightSequence(lvl, modality, speed);
    }

    endGame();
  }

  // ===== FINAL =====
  function endGame() {
    running = false;
    stopRequested = false;

    stopTimer();
    stopAllTimeouts();
    resetHighlights();

    audio.pause();
    audio.currentTime = 0;

    disableControls(false);
    setState("Finalizado");

    alert("¡Partida terminada!");
  }

  // ===== STOP =====
  function stopGame() {
    if (!running) return;

    stopRequested = true;
    running = false;

    stopTimer();
    stopAllTimeouts();
    resetHighlights();

    audio.pause();

    disableControls(false);
    setState("Detenido");
  }

  // ===== BOTONES =====
  startBtn.addEventListener("click", playGame);
  bigStartBtn.addEventListener("click", playGame);
  stopBtn.addEventListener("click", stopGame);

  // por compatibilidad si el HTML llama onclick
  window.iniciarContador = playGame;
});
