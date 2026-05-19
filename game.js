const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameOver = false;
let score = 0;

let playerImg = new Image();
playerImg.src = "C:\Users\vgbvs\OneDrive\Desktop\Art gallery\photos\moon.png\character.png.png";

let player = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 100,
    width: 80,
    height: 80,
    speed: 25
};

function drawPlayer() {
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}


// كويكبات
let asteroids = [];

document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft" && player.x > 0) player.x -= player.speed;
    if (e.key === "ArrowRight" && player.x < canvas.width - player.width) player.x += player.speed;
});

function drawPlayer() {
    ctx.fillStyle = "#1e90ff";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawAsteroids() {
    ctx.fillStyle = "brown";
    asteroids.forEach((a, i) => {
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2);
        ctx.fill();
        a.y += a.speed;

        // فحص التصادم مع اللاعب
        if (
            a.y + a.radius > player.y &&
            a.x > player.x &&
            a.x < player.x + player.width
        ) {
            gameOver = true;
        }

        // إذا نزلت تحت
        if (a.y > canvas.height) {
            asteroids.splice(i, 1);
            score++;
        }
    });
}

function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);
}

function gameLoop() {
    if (gameOver) {
        ctx.fillStyle = "red";
        ctx.font = "40px Arial";
        ctx.fillText("Game Over!", canvas.width / 2 - 100, canvas.height / 2);
        ctx.font = "20px Arial";
        ctx.fillText("Final Score: " + score, canvas.width / 2 - 70, canvas.height / 2 + 40);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawAsteroids();
    drawScore();
    requestAnimationFrame(gameLoop);
}

setInterval(() => {
    asteroids.push({
        x: Math.random() * canvas.width,
        y: 0,
        radius: 15,
        speed: Math.random() * 3 + 2
    });
}, 1000);

gameLoop();
