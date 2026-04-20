document.addEventListener("DOMContentLoaded", () => {

  // ===== ELEMENTOS =====
  const imgs = Array.from(document.querySelectorAll("img[id^='img']"));

  const nivelText = document.getElementById("nivel");
  const contadorText = document.getElementById("contador");
  const estadoText = document.getElementById("estado");

  const musicBtn = Array.from(document.querySelectorAll("button"))
    .find(b => b.textContent.toLowerCase().includes("musica"));

  const startBtn = Array.from(document.querySelectorAll("button"))
    .find(b => b.textContent.toLowerCase().includes("empezar partida"));

  const stopBtn = Array.from(document.querySelectorAll("button"))
    .find(b => b.textContent.toLowerCase().includes("detener"));

  const bigStartBtn = document.querySelector("button[onclick]");

  const difficultySelect = document.querySelector('select[name="Dificultad"]');
  const modalitySelect = document.querySelector('select[name="Modalidad"]');

  // ===== AUDIO =====
  const audio = new Audio("P4.mp3");
  audio.loop = true;
  let musicOn = false;

  // ===== ESTADO =====
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
    stopBtn.disabled = false;
  }

  function timerTextUpdate() {
    contadorText.textContent = timer;
  }

  function startTimer() {
    timer = 0;
    timerTextUpdate();

    timerInterval = setInterval(() => {
      timer++;
      timerTextUpdate();
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
  }

  function stopAllTimeouts() {
    sequenceTimeouts.forEach(t => clearTimeout(t));
    sequenceTimeouts = [];
  }

  // ===== MUSICA =====
  musicBtn.addEventListener("click", () => {
    musicOn = !musicOn;

    if (musicOn && running) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  });

  // ===== GRID (YA EXISTE EN TU CÓDIGO ORIGINAL) =====
  function getGrid(level, modality) {

    const sets = {
      mesa: ["mesa", "mesa", "mesa", "mesa", "pesa", "pesa", "pesa", "pesa"],
      luna: ["luna", "cuna", "luna", "cuna", "luna", "cuna", "luna", "cuna"],
      pato: ["pato", "plato", "plato", "pato", "pato", "plato", "plato", "pato"],
      tapa: ["tapa", "mapa", "lata", "tapa", "mapa", "lata", "tapa", "mapa"]
    };

    let base = sets[modality] || sets.mesa;

    // shuffle controlado por nivel
    for (let i = 0; i < level; i++) {
      base = base.slice().sort(() => Math.random() - 0.5);
    }

    return base;
  }

  // ===== CONVERTIR PALABRA A IMAGEN =====
  function wordToImage(word) {
    return word + ".png";
  }

  // ===== CARGAR IMÁGENES ANTES DEL NIVEL =====
  function loadImagesFromGrid(level, modality) {
    const grid = getGrid(level, modality);

    imgs.forEach((img, i) => {
      img.src = wordToImage(grid[i]);
      img.classList.remove("active");
    });

    return grid;
  }

  // ===== SECUENCIA (SOLO BORDE ROJO) =====
  function highlightSequence(grid, speed) {

    return new Promise((resolve) => {

      let i = 0;

      function step() {

        if (!running || stopRequested) return;

        resetHighlights();

        if (imgs[i]) {
          imgs[i].classList.add("active");
        }

        i++;

        if (i < imgs.length) {
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

  // ===== JUEGO PRINCIPAL =====
  async function playGame() {

    running = true;
    stopRequested = false;

    const startLevel = parseInt(difficultySelect.value);
    const modality = modalitySelect.value;

    disableControls(true);
    setState("Jugando");

    startTimer();

    if (musicOn) {
      audio.play().catch(() => {});
    }

    for (let lvl = startLevel; lvl <= 5; lvl++) {

      if (stopRequested) break;

      nivelText.textContent = `${lvl}/5`;

      setState("Preparación");
      await new Promise(r => setTimeout(r, 600));

      if (stopRequested) break;

      // =5 cargar imágenes según modalidad y nivel
      const grid = loadImagesFromGrid(lvl, modality);

      const speed = Math.max(200, 1000 - lvl * 120);

      setState("Nivel " + lvl);

      await highlightSequence(grid, speed);
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

  setState("< ¡FELICIDADES! HAS COMPLETADO EL JUEGO <");
  const winAudio = new Audio("win.mp3");
  winAudio.loop = false;
  winAudio.play().catch(() => {});

  // opcional: mensaje emergente bonito
  setTimeout(() => {
    alert("< ¡Enhorabuena! Has completado los 5 niveles!");
  }, 300);
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
  stopBtn.addEventListener("click", stopGame);

  if (bigStartBtn) {
    bigStartBtn.addEventListener("click", playGame);
  }

});