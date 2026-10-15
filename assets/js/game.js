const canvas = document.getElementById("game-canvas");
const context = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const overlay = document.getElementById("game-overlay");
const overlayTitle = document.getElementById("overlay-title");
const overlayMessage = document.getElementById("overlay-message");
const actionButton = document.getElementById("game-action");

const targetScore = 100;
const cat = { x: 150, y: 220, size: 32, velocity: 0 };
const gates = [];
let score = 0;
let running = false;
let gameOver = false;
let lastTime = 0;
let spawnTimer = 0;

function resetGame() {
  cat.y = canvas.height / 2;
  cat.velocity = 0;
  score = 0;
  gates.length = 0;
  spawnTimer = 0;
  scoreElement.textContent = "0";
  gameOver = false;
}

function flap() {
  if (!running) {
    startGame();
  }
  cat.velocity = -420;
}

function startGame() {
  resetGame();
  running = true;
  overlay.classList.add("hidden");
  lastTime = performance.now();
  requestAnimationFrame(loop);
}

function finish(title, message) {
  running = false;
  gameOver = true;
  overlayTitle.textContent = title;
  overlayMessage.textContent = message;
  actionButton.textContent = score >= targetScore ? "Play again" : "Try again";
  overlay.classList.remove("hidden");
}

function addGate() {
  const gap = 150;
  const top = 55 + Math.random() * (canvas.height - gap - 120);
  gates.push({ x: canvas.width + 30, width: 58, top, gap, counted: false });
}

function drawPixelCat() {
  const x = cat.x;
  const y = cat.y;
  context.fillStyle = "#7aff9f";
  context.fillRect(x - 16, y - 17, 32, 34);
  context.fillStyle = "#d2ffdc";
  context.fillRect(x - 13, y - 23, 8, 8);
  context.fillRect(x + 5, y - 23, 8, 8);
  context.fillStyle = "#0d120d";
  context.fillRect(x - 10, y - 8, 7, 7);
  context.fillRect(x + 4, y - 8, 7, 7);
  context.fillStyle = "#effff2";
  context.fillRect(x - 8, y - 6, 3, 3);
  context.fillRect(x + 6, y - 6, 3, 3);
  context.fillStyle = "#174d2a";
  context.fillRect(x - 3, y + 2, 6, 4);
  context.fillStyle = "#d2ffdc";
  context.fillRect(x - 8, y + 7, 4, 2);
  context.fillRect(x - 4, y + 9, 8, 2);
  context.fillRect(x + 4, y + 7, 4, 2);
}

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#0d2413";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "rgba(122,255,160,.08)";
  context.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 32) {
    context.beginPath(); context.moveTo(x, 0); context.lineTo(x, canvas.height); context.stroke();
  }
  for (let y = 0; y < canvas.height; y += 32) {
    context.beginPath(); context.moveTo(0, y); context.lineTo(canvas.width, y); context.stroke();
  }
  context.fillStyle = "#2f9d58";
  gates.forEach(gate => {
    context.fillRect(gate.x, 0, gate.width, gate.top);
    context.fillRect(gate.x, gate.top + gate.gap, gate.width, canvas.height);
    context.fillStyle = "#7aff9f";
    context.fillRect(gate.x - 5, gate.top - 8, gate.width + 10, 8);
    context.fillRect(gate.x - 5, gate.top + gate.gap, gate.width + 10, 8);
    context.fillStyle = "#2f9d58";
  });
  drawPixelCat();
}

function collides(gate) {
  const left = cat.x - cat.size / 2;
  const right = cat.x + cat.size / 2;
  const top = cat.y - cat.size / 2;
  const bottom = cat.y + cat.size / 2;
  return right > gate.x && left < gate.x + gate.width && (top < gate.top || bottom > gate.top + gate.gap);
}

function loop(now) {
  if (!running) return;
  const delta = Math.min((now - lastTime) / 1000, .035);
  lastTime = now;
  cat.velocity += 1150 * delta;
  cat.y += cat.velocity * delta;
  spawnTimer += delta;
  if (spawnTimer > 1.45) {
    spawnTimer = 0;
    addGate();
  }
  gates.forEach(gate => {
    gate.x -= 220 * delta;
    if (!gate.counted && gate.x + gate.width < cat.x) {
      gate.counted = true;
      score += 1;
      scoreElement.textContent = String(score);
      if (score >= targetScore) {
        finish("You win!", "The cat reached 100 points.");
      }
    }
  });
  while (gates.length && gates[0].x + gates[0].width < -20) gates.shift();
  if (cat.y < 0 || cat.y > canvas.height || gates.some(collides)) {
    finish("Game over", `You scored ${score}. Keep flying.`);
  }
  draw();
  if (running) requestAnimationFrame(loop);
}

window.addEventListener("keydown", event => {
  if (event.code === "Space") {
    event.preventDefault();
    flap();
  }
});
canvas.addEventListener("pointerdown", event => {
  event.preventDefault();
  flap();
});
actionButton.addEventListener("click", startGame);
draw();
