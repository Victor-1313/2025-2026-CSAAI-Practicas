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
  let currentLevel = 1;
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
    stopBtn.disabled = disabled;
  }

  function timerTextUpdate() {
    contadorText.textContent = timer;
  }

  function updateTimer() {
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

  // ===== GRID =====
  function getGrid(modality) {
    const sets = {
      mesa: ["mesa", "mesa", "mesa", "mesa", "pesa", "pesa", "pesa", "pesa"],
      luna: ["luna", "cuna", "luna", "cuna", "luna", "cuna", "luna", "cuna"],
      pato: ["pato", "plato", "plato", "pato", "pato", "plato", "plato", "pato"],
      tapa: ["tapa", "mapa", "lata", "tapa", "mapa", "lata", "tapa", "mapa"]
    };

    let base = sets[modality] || sets.mesa;

    // shuffle simple
    return base.slice().sort(() => Math.random() - 0.5);
  }

  // ===== SECUENCIA =====
  function highlightSequence(modality, speed) {
    const grid = getGrid(modality);

    return new Promise((resolve) => {
      let i = 0;

      function step() {
        if (!running || stopRequested) return;

        resetHighlights();

        if (imgs[i]) {
          imgs[i].classList.add("active");

          // opcional: mostrar palabra en alt
          imgs[i].alt = grid[i];
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

  // ===== JUEGO =====
  async function playGame() {

    running = true;
    stopRequested = false;

    const startLevel = parseInt(difficultySelect.value);
    const modality = modalitySelect.value;

    timer = 0;
    timerTextUpdate();
    updateTimer();

    disableControls(true);
    setState("Jugando");

    if (musicOn) {
      audio.play().catch(() => {});
    }

    for (let lvl = startLevel; lvl <= 5; lvl++) {

      if (stopRequested) break;

      nivelText.textContent = `${lvl}/5`;

      setState("Preparación");
      await new Promise(r => setTimeout(r, 800));

      if (stopRequested) break;

      const speed = Math.max(200, 1000 - lvl * 150);

      setState("Nivel " + lvl);

      await highlightSequence(modality, speed);
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
  stopBtn.addEventListener("click", stopGame);

  if (bigStartBtn) {
    bigStartBtn.addEventListener("click", playGame);
  }

});