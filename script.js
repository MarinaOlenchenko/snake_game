const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const ground = new Image();
ground.src = "img/ground.png";

const foodImg = new Image();
foodImg.src = "img/apple.png";

let box = 32;

let score = 0;

let food = {
  x: Math.floor((Math.random() * 17 + 1)) * box,
  y: Math.floor((Math.random() * 15 + 3)) * box,
};

let snake = [];
snake[0] = {
  x: 9 * box,
  y: 10 * box
};

document.addEventListener("keydown", direction);
document.addEventListener("touchstart", handleTouchStart);
document.addEventListener("touchmove", handleTouchMove);

let dir;
let touchStartX = 0;
let touchStartY = 0;

function direction(event) {
  if (event.keyCode == 37 && dir != "right")
    dir = "left";
  else if (event.keyCode == 38 && dir != "down")
    dir = "up";
  else if (event.keyCode == 39 && dir != "left")
    dir = "right";
  else if (event.keyCode == 40 && dir != "up")
    dir = "down";
}

function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
  if (!touchStartX || !touchStartY) {
    return;
  }

  const touchEndX = event.touches[0].clientX;
  const touchEndY = event.touches[0].clientY;

  const dx = touchEndX - touchStartX;
  const dy = touchEndY - touchStartY;

  if (Math.abs(dx) > Math.abs(dy)) {
    // Горизонтальное движение
    if (dx > 0 && dir !== "left") {
      dir = "right";
    } else if (dx < 0 && dir !== "right") {
      dir = "left";
    }
  } else {
    // Вертикальное движение
    if (dy > 0 && dir !== "up") {
      dir = "down";
    } else if (dy < 0 && dir !== "down") {
      dir = "up";
    }
  }

  touchStartX = 0;
  touchStartY = 0;
}

function eatTail(head, arr) {
  for (let i = 0; i < arr.length; i++) {
    if (head.x == arr[i].x && head.y == arr[i].y)
      gameOver();
  }
}

function drawGame() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx.drawImage(ground, 0, 0);

  ctx.drawImage(foodImg, food.x, food.y);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i == 0 ? "green" : "red";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  ctx.fillStyle = "white";
  ctx.font = "50px Arial";
  ctx.fillText(score, box * 2.5, box * 1.7);

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (snakeX == food.x && snakeY == food.y) {
    score++;
    food = {
      x: Math.floor((Math.random() * 17 + 1)) * box,
      y: Math.floor((Math.random() * 15 + 3)) * box,
    };
  } else
    snake.pop();

  if (snakeX < box || snakeX > box * 17 || snakeY < 3 * box || snakeY > box * 17)
    gameOver();

  if (dir == "left") snakeX -= box;
  if (dir == "right") snakeX += box;
  if (dir == "up") snakeY -= box;
  if (dir == "down") snakeY += box;

  let newHead = {
    x: snakeX,
    y: snakeY
  };

  eatTail(newHead, snake);

  snake.unshift(newHead);
}

let game = setInterval(drawGame, 200);

function restartGame() {
  clearInterval(game);
  snake = [];
  snake[0] = {
    x: 9 * box,
    y: 10 * box
  };
  score = 0;
  dir = null;
  game = setInterval(drawGame, 200);
  document.getElementById("gameOverScreen").style.display = "none";
}

function gameOver() {
  clearInterval(game);
  document.getElementById("gameOverScreen").style.display = "flex";
}