"use strict";
const rulesBtn = document.querySelector(".rules-btn");
const closeBtn = document.querySelector(".close-btn");
const rules = document.querySelector(".rules");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 4,
  dx: 4,
  dy: -4,
};
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0,
};

let score = 0;

const brickRowCount = 9;
const brickColumnCount = 5;

const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true,
};

const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickColumnCount; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = { x, y, ...brickInfo };
  }
}
console.log(bricks);
//draw ball on canvas
const drawBall = function () {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = "#304D6D";
  ctx.fill();
  ctx.closePath();
};
// draw paddle on canvas
const drawPaddle = function () {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = "#304D6D";
  ctx.fill();
  ctx.closePath();
};

const drawScore = function () {
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
};

const drawBricks = function () {
  bricks.forEach((column) =>
    column.forEach((brick) => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? "#304D6D" : "transparent";
      ctx.fill();
      ctx.closePath();
    })
  );
};

const movePaddle = function () {
  paddle.x += paddle.dx;
  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }
  if (paddle.x < 0) {
    paddle.x = 0;
  }
};

const moveBall = function () {
  ball.x += ball.dx;
  ball.y += ball.dy;
  // console.log(ball.y);
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1;
  }
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1;
  }
  if (
    ball.x - ball.size > paddle.x &&
    (ball.x + ball.size < paddle.x + paddle.w) & (ball.y + ball.size > paddle.y)
  ) {
    ball.dy = -ball.speed;
  }

  bricks.forEach((column) =>
    column.forEach((brick) => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x &&
          ball.x + ball.size < brick.x + brick.w &&
          ball.y + ball.size > brick.y &&
          ball.y - ball.size < brick.y + brick.h
        ) {
          ball.dy *= -1;
          brick.visible = false;
          increaseScore();
        }
      }
    })
  );

  // if hit the wall, lose
  if (ball.y + ball.size > canvas.height) {
    showAllBreaks();
    score = 0;
    // console.log(ball.y + ball.size, canvas.height);
  }
};
const increaseScore = function () {
  score++;
  if (score % (brickColumnCount * brickRowCount) === 0) {
    showAllBreaks();
  }
};

// Make all breaks appear
const showAllBreaks = function () {
  bricks.forEach((column) => column.forEach((brick) => (brick.visible = true)));
};

// draw
const draw = function () {
  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
};

// update canvas drawing and animation
const update = function () {
  movePaddle();
  moveBall();
  draw();
  requestAnimationFrame(update);
};

update();

const keydown = function (e) {
  if (e.key === "ArrowRight" || e.key === "Right") {
    paddle.dx = paddle.speed;
  } else if (e.key === "ArrowLeft" || e.key === "Left") {
    paddle.dx = -paddle.speed;
  }
};
const keyup = function (e) {
  if (
    e.key === "ArrowRight" ||
    e.key === "Right" ||
    e.key === "ArrowLeft" ||
    e.key === "Left"
  ) {
    paddle.dx = 0;
  }
};

//keyboard event handlers
document.addEventListener("keydown", keydown);
document.addEventListener("keyup", keyup);

rulesBtn.addEventListener("click", () => rules.classList.add("show"));
closeBtn.addEventListener("click", () => rules.classList.remove("show"));
