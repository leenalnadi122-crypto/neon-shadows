
function checkAnswer(answer) {
    const result = document.getElementById('result');
    if (answer === 'Mars') {
        result.textContent = '✅ Correct! Mars is the Red Planet!';
        result.style.color = 'lightgreen';
    } else {
        result.textContent = '❌ Oops! Try again.';
        result.style.color = 'red';
    }
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let drawing = false;

canvas.addEventListener('mousedown', () => drawing = true);
canvas.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('mousemove', draw);

function draw(event) {
    if (!drawing) return;
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(event.offsetX, event.offsetY, 5, 0, Math.PI * 2);
    ctx.fill();
}
const planets = ["🌍", "🌍", "🪐", "🪐", "☀️", "☀️", "🌙", "🌙", "⭐", "⭐", "🚀", "🚀"];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matches = 0;

function shuffle(array) {
    return array.sort(() => 0.5 - Math.random());
}

function createBoard() {
    const gameBoard = document.getElementById("gameBoard");
    const shuffledPlanets = shuffle(planets);

    shuffledPlanets.forEach(planet => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.planet = planet;
        card.textContent = planet;
        card.addEventListener("click", flipCard);
        gameBoard.appendChild(card);
    });
}

function flipCard() {
    if (lockBoard || this.classList.contains("flipped")) return;

    this.classList.add("flipped");

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    checkMatch();
}

function checkMatch() {
    if (firstCard.dataset.planet === secondCard.dataset.planet) {
        matches++;
        resetBoard();
        if (matches === planets.length / 2) {
            document.getElementById("message").textContent = "🎉 You did it! You’re a space explorer!";
        }
    } else {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            resetBoard();
        }, 1000);
    }
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

createBoard();


