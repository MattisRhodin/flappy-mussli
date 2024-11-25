// Hämta canvas och dess kontext
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Ställ in canvas storlek
canvas.width = 800;
canvas.height = 600;

// Fågelns egenskaper
const bird = {
    x: 100,
    y: 300,
    width: 30,
    height: 30,
    gravity: 0.4,
    velocity: 0,
    jump: -7
};

// Lägg till detta i början av din kod, efter fågel-objektet
const pipes = {
    width: 50,
    gap: 150,
    speed: 2,
    list: []
};

// Funktion för att skapa nya rör
function createPipe() {
    const gapPosition = Math.random() * (canvas.height - pipes.gap);
    pipes.list.push({
        x: canvas.width,
        topHeight: gapPosition,
        bottomY: gapPosition + pipes.gap
    });
}

// Kalla på denna funktion var tredje sekund
setInterval(createPipe, 3000);

function checkCollision() {
    // Kontrollera om fågeln har träffat marken eller taket
    if (bird.y <= 0 || bird.y + bird.height >= canvas.height) {
        return true;
    }
    
    // Kontrollera kollision med varje rör
    for (const pipe of pipes.list) {
        // Kontrollera om fågeln överlappar med röret i x-led
        if (bird.x + bird.width > pipe.x && bird.x < pipe.x + pipes.width) {
            // Kontrollera om fågeln krockar med övre röret
            if (bird.y < pipe.topHeight) {
                return true;
            }
            // Kontrollera om fågeln krockar med nedre röret
            if (bird.y + bird.height > pipe.bottomY) {
                return true;
            }
        }
    }
    return false;
}

// Spelloopen
function gameLoop() {
    // Rensa canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Uppdatera och rita rören
    for (let i = 0; i < pipes.list.length; i++) {
        // Flytta röret åt vänster
        pipes.list[i].x -= pipes.speed;
        
        // Rita övre röret (grönt)
        ctx.fillStyle = 'green';
        ctx.fillRect(
            pipes.list[i].x, 
            0, 
            pipes.width, 
            pipes.list[i].topHeight
        );
        
        // Rita nedre röret (också grönt)
        ctx.fillRect(
            pipes.list[i].x, 
            pipes.list[i].bottomY, 
            pipes.width, 
            canvas.height - pipes.list[i].bottomY
        );
    }
    
    // Ta bort rör som har åkt utanför skärmen
    pipes.list = pipes.list.filter(pipe => pipe.x > -pipes.width);
    
    // Uppdatera fågelns position
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;
    
    // Lägg till detta före du ritar fågeln
    if (checkCollision()) {
        // Spelet är över
        alert('Game Over!');
        // Återställ spelet
        resetGame();
        return;
    }
    
    // Rita fågeln
    ctx.fillStyle = 'yellow';
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
    
    // Fortsätt spelloopen
    requestAnimationFrame(gameLoop);
}

// Lyssna på hopp
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        bird.velocity = bird.jump;
    }
});

// Funktion för att återställa spelet
function resetGame() {
    bird.y = 300;
    bird.velocity = 0;
    pipes.list = [];
    gameLoop();
}

// Starta spelet
gameLoop(); 