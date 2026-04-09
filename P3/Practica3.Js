const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

// ======== IMÁGENES ========
const playerImg = new Image();
playerImg.src = "recursos/nave.png";

const alienImg = new Image();
alienImg.src = "recursos/alien.png";

const explosionImg = new Image();
explosionImg.src = "recursos/explosion.png";

// ======== SONIDOS ========
const laserSound = new Audio("recursos/laser.wav");
const explosionSound = new Audio("recursos/explosion.mp3");

// ======== JUGADOR ========
const player = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 100,
  width: 100 ,
  height: 100,
  speed: 6,
  lives: 3,
  energy: 5,
  maxEnergy: 5
};

// ======== controles ========
let keys = {};
document.addEventListener("keydown", e => keys[e.code] = true);
document.addEventListener("keyup", e => keys[e.code] = false);

// ======== lasers ========
let bullets = [];
let enemyBullets = [];
let explosions = [];

// ======== ALIENS ========
let aliens = [];
let rows = 4; // como en TDI
let cols = 8;
let alienSpeed = 1;
let direction = 1;

for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    aliens.push({
      x: 80 + c * 70,
      y: 50 + r * 50,
      width: 40,
      height: 30,
      alive: true
    });
  }
}

// ======== stado ========
let score = 0;
let gameOver = false;
let win = false;

// ======== recarga de energia ========
setInterval(() => {
  if (player.energy < player.maxEnergy) {
    player.energy++;
  }
}, 500);

// ======== SHOOT ========
function shoot() {
  if (player.energy > 0) {
    bullets.push({
      x: player.x + player.width / 2 - 2,
      y: player.y,
      width: 4,
      height: 10
    });
    player.energy--;
    laserSound.currentTime = 0;
    laserSound.play();
    console.log("pew");
  }
}

document.addEventListener("keydown", e => {
  if (e.code === "Space") shoot();
});

// ======== ENEMY SHOOT ========
setInterval(() => {
  let aliveAliens = aliens.filter(a => a.alive);
  if (aliveAliens.length === 0) return;

  let shooter = aliveAliens[Math.floor(Math.random() * aliveAliens.length)];

  enemyBullets.push({
    x: shooter.x + shooter.width / 2,
    y: shooter.y,
    width: 4,
    height: 10
  });

}, 1000);

// ======== UPDATE ========
function update() {
  if (gameOver) return;

  // movimiento jugador
  if (keys["ArrowLeft"] && player.x > 0) {
    player.x -= player.speed;
  }
  if (keys["ArrowRight"] && player.x + player.width < canvas.width) {
    player.x += player.speed;
  }

  // mover balas
  bullets.forEach(b => b.y -= 7);
  enemyBullets.forEach(b => b.y += 4);

  // colisiones balas vs aliens
  bullets.forEach(b => {
    aliens.forEach(a => {
      if (a.alive &&
          b.x < a.x + a.width &&
          b.x + b.width > a.x &&
          b.y < a.y + a.height &&
          b.y + b.height > a.y) {

        a.alive = false;
        b.y = -100;
        score += 10;

        // explosión
        explosions.push({
        x: a.x,
        y: a.y,
        frame: 0
        });

        // sonido
        explosionSound.currentTime = 0;
        explosionSound.play();
      }
    });
  });

  // colisiones enemigo vs jugador
  enemyBullets.forEach(b => {
    if (
      b.x < player.x + player.width &&
      b.x + b.width > player.x &&
      b.y < player.y + player.height &&
      b.y + b.height > player.y
    ) {
      b.y = canvas.height + 100;
      player.lives--;
      // sonido
        explosionSound.currentTime = 0;
        explosionSound.play();
      if (player.lives <= 0) {
        gameOver = true;
      }
    }
  });

  function restartGame() {
  // jugador
  player.x = canvas.width / 2 - 25;
  player.lives = 3;
  player.energy = player.maxEnergy;

  // balas
  bullets = [];
  enemyBullets = [];
  explosions = [];

  // aliens
  aliens = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      aliens.push({
        x: 80 + c * 70,
        y: 50 + r * 50,
        width: 40,
        height: 30,
        alive: true
      });
    }
  }

  // estado
  score = 0;
  alienSpeed = 1;
  direction = 1;
  gameOver = false;
  win = false;
}


document.addEventListener("keydown", e => {
  if (e.code === "Enter" && gameOver) {
    restartGame();
  }
});


  // mover aliens
  let edge = false;

  aliens.forEach(a => {
    if (!a.alive) return;

    a.x += alienSpeed * direction;

    if (a.x <= 0 || a.x + a.width >= canvas.width) {
      edge = true;
    }
  });

  if (edge) {
    direction *= -1;
    aliens.forEach(a => a.y += 20);
  }

  // aumentar velocidad
  let aliveCount = aliens.filter(a => a.alive).length;
  alienSpeed = 1 + (rows * cols - aliveCount) * 0.05;

  // victoria
  if (aliveCount === 0) {
    win = true;
    gameOver = true;
  }
}

// ======== DRAW ========
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // jugador
  ctx.fillStyle = "cyan";
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  // aliens
  ctx.fillStyle = "lime";
  aliens.forEach(a => {
    if (a.alive)
      ctx.drawImage(alienImg, a.x, a.y, a.width, a.height);
  });

  // balas
  ctx.fillStyle = "white";
  bullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));

  ctx.fillStyle = "red";
  enemyBullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));

  // UI
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Puntos: " + score, 10, 20);
  ctx.fillText("Vidas: " + player.lives, 10, 50);
  ctx.fillText("Energía: " + player.energy, 10, 80);

  // Explosiones
    explosions.forEach((exp, index) => {
    ctx.drawImage(explosionImg, exp.x, exp.y, 40, 40);
    exp.frame++;

    if (exp.frame > 15) {
        explosions.splice(index, 1);
    }
    });

  // fin del juego
 if (gameOver) {
  ctx.font = "40px Arial";
  ctx.textAlign = "center";

  if (win) {
    ctx.fillText("¡VICTORIA!", canvas.width/2, canvas.height/2);
  } else {
    ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2);
  }

  // 👇 mensaje extra
  ctx.font = "20px Arial";
  ctx.fillText("Pulsa ENTER para jugar otra vez", canvas.width/2, canvas.height/2 + 40);
}
  }


// ======== LOOP ========
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();