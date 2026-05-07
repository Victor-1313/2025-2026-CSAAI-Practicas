const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const stateEl = document.getElementById("state");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// --- ESTADOS Y VARIABLES DE JUEGO ---
let gameState = "MENU"; // MENU, COUNTDOWN, PLAYING, GOAL, GAMEOVER
let gameMode = ""; 
let score = { player: 0, npc: 0 };
let countdownTimer = 0;
let message = "SUPER SOCCER";

const player = {
    x: 150, y: HEIGHT / 2, radius: 20, color: "#2d7ff9", speed: 4
};

const ball = {
    x: WIDTH / 2, y: HEIGHT / 2, radius: 12,
    vx: 0, vy: 0, friction: 0.98
};

const NPC = {
    x: WIDTH - 150, y: HEIGHT / 2, radius: 20, color: "#aa1515", speed: 2.2
};

const keys = {};
const powerShot = { charging: false, power: 0, maxPower: 12, chargeSpeed: 0.2 };

// --- UTILIDADES ---
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function distance(x1, y1, x2, y2) { return Math.hypot(x2 - x1, y2 - y1); }
function setState(text) { if(stateEl) stateEl.textContent = text; }

// --- LÓGICA DE FLUJO ---
function initGame(mode) {
    gameMode = mode;
    score = { player: 0, npc: 0 };
    resetPositions();
    startCountdown(3);
}

function startCountdown(seconds) {
    gameState = "COUNTDOWN";
    countdownTimer = seconds;
    setState("¡Prepárate!");
    const interval = setInterval(() => {
        countdownTimer--;
        if (countdownTimer <= 0) {
            clearInterval(interval);
            gameState = "PLAYING";
            setState("¡PARTIDO EN CURSO!");
        }
    }, 800);
}

function resetPositions() {
    player.x = 150; player.y = HEIGHT / 2;
    NPC.x = WIDTH - 150; NPC.y = HEIGHT / 2;
    ball.x = WIDTH / 2; ball.y = HEIGHT / 2;
    ball.vx = 0; ball.vy = 0;
}

// --- ENTRADA DE TECLADO ---
window.addEventListener("keydown", e => {
    keys[e.code] = true;
    if (gameState === "MENU") {
        if (e.key === "1") initGame("3GOALS");
        if (e.key === "2") initGame("GOLDEN");
    }
    if (e.key === "r" || e.key === "R") {
        gameState = "MENU";
        setState("Esperando elección de modo...");
    }
});
window.addEventListener("keyup", e => {
    keys[e.code] = false;
});

function releaseShot() {
    const d = distance(player.x, player.y, ball.x, ball.y);
    if (d < player.radius + ball.radius + 15) {
        const angle = Math.atan2(ball.y - player.y, ball.x - player.x);
        ball.vx = Math.cos(angle) * (powerShot.power + 3);
        ball.vy = Math.sin(angle) * (powerShot.power + 3);
        setState("¡Disparo realizado!");
    }
    powerShot.charging = false;
    powerShot.power = 0;
}

// --- ACTUALIZACIÓN ---
function update() {
    if (gameState !== "PLAYING") return;

    // Jugador
    if (keys["ArrowUp"]) player.y -= player.speed;
    if (keys["ArrowDown"]) player.y += player.speed;
    if (keys["ArrowLeft"]) player.x -= player.speed;
    if (keys["ArrowRight"]) player.x += player.speed;
    player.x = clamp(player.x, player.radius, WIDTH - player.radius);
    player.y = clamp(player.y, player.radius, HEIGHT - player.radius);

    // Disparo
    if (keys["Space"]) {
        powerShot.charging = true;
        powerShot.power = Math.min(powerShot.power + powerShot.chargeSpeed, powerShot.maxPower);
    } else if (powerShot.charging) {
        releaseShot();
    }

    // IA NPC
    const dNPC = distance(NPC.x, NPC.y, ball.x, ball.y);
    if (dNPC < 250) {
        const angle = Math.atan2(ball.y - NPC.y, ball.x - NPC.x);
        NPC.x += Math.cos(angle) * NPC.speed;
        NPC.y += Math.sin(angle) * NPC.speed;
    } else {
        NPC.x += (WIDTH - 100 - NPC.x) * 0.02;
        NPC.y += (HEIGHT / 2 - NPC.y) * 0.02;
    }

    // Balón
    ball.x += ball.vx; ball.y += ball.vy;
    ball.vx *= ball.friction; ball.vy *= ball.friction;

    // Colisiones
    [player, NPC].forEach(p => {
        const d = distance(p.x, p.y, ball.x, ball.y);
        if (d < p.radius + ball.radius) {
            const angle = Math.atan2(ball.y - p.y, ball.x - p.x);
            ball.vx += Math.cos(angle) * 0.8;
            ball.vy += Math.sin(angle) * 0.8;
        }
    });

    // Rebotes y Goles
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > HEIGHT) ball.vy *= -1;
    
    if (ball.x < 0) {
        if (ball.y > HEIGHT / 4 && ball.y < 3 * HEIGHT / 4) goalScored("npc");
        else { ball.x = ball.radius; ball.vx *= -1; }
    }
    if (ball.x > WIDTH) {
        if (ball.y > HEIGHT / 4 && ball.y < 3 * HEIGHT / 4) goalScored("player");
        else { ball.x = WIDTH - ball.radius; ball.vx *= -1; }
    }
}

function goalScored(who) {
    if (who === "player") score.player++; else score.npc++;
    gameState = "GOAL";
    message = who === "player" ? "¡GOOOL!" : "¡GOL RIVAL!";
    
    setTimeout(() => {
        if ((gameMode === "GOLDEN") || (gameMode === "3GOALS" && (score.player >= 3 || score.npc >= 3))) {
            gameState = "GAMEOVER";
            message = score.player > score.npc ? "¡VICTORIA!" : "DERROTA";
        } else {
            resetPositions();
            startCountdown(2);
        }
    }, 1500);
}

// --- DIBUJO ---
function drawField() {
    ctx.fillStyle = "#2c8f4a";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 2;
    // Línea central y círculo
    ctx.beginPath();
    ctx.moveTo(WIDTH/2, 0); ctx.lineTo(WIDTH/2, HEIGHT);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(WIDTH/2, HEIGHT/2, 50, 0, Math.PI*2);
    ctx.stroke();

    // Porterías
    ctx.strokeStyle = "white";
    ctx.lineWidth = 4;
    ctx.strokeRect(0, HEIGHT/4, 20, HEIGHT/2);
    ctx.strokeRect(WIDTH-20, HEIGHT/4, 20, HEIGHT/2);
}

function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    drawField();

    if (gameState === "MENU") {
        drawOverlay("BOT LEAGUE", "Presiona 1: A 3 goles | Presiona 2: Gol de Oro");
        return;
    }

    // Jugadores y Balón
    drawCircle(player.x, player.y, player.radius, player.color);
    drawCircle(NPC.x, NPC.y, NPC.radius, NPC.color);
    drawCircle(ball.x, ball.y, ball.radius, "white", "black");

    // UI
    ctx.fillStyle = "white";
    ctx.font = "bold 20px Arial";
    ctx.fillText(`${score.player} - ${score.npc}`, WIDTH / 2, 30);

    if (powerShot.charging) {
        ctx.fillStyle = "yellow";
        ctx.fillRect(player.x - 20, player.y - 35, (powerShot.power/12)*40, 5);
    }

    if (gameState === "COUNTDOWN") drawOverlay(countdownTimer, "Prepárate...");
    if (gameState === "GOAL") drawOverlay(message, "");
    if (gameState === "GAMEOVER") drawOverlay(message, "Pulsa R para Menú");
}

function drawCircle(x, y, r, fill, stroke = "white") {
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2);
    ctx.fillStyle = fill; ctx.fill();
    ctx.strokeStyle = stroke; ctx.stroke();
}

function drawOverlay(t1, t2) {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "white"; ctx.textAlign = "center";
    ctx.font = "bold 40px Arial"; ctx.fillText(t1, WIDTH/2, HEIGHT/2);
    ctx.font = "20px Arial"; ctx.fillText(t2, WIDTH/2, HEIGHT/2 + 40);
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

// Iniciar
loop();