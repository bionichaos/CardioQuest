// game_logic_update.js

import { ctx, WIDTH, HEIGHT, waveform, scoreDisplay } from './game_logic_setup.js';
let WHITE = "#FFFFFF";
let RED = "#FF0000";
let GREEN = "#00FF00";
let BLUE = "#0000FF";

let score; // Initialize the score
let waveformIndex

let scrollSpeed = 1; // Or an appropriate initial value
function updateScrollSpeed() {
    scrollSpeed = Math.floor(score / 50) + 1;
    if (scrollSpeed < 1) {
        scrollSpeed = 1;
    }
}

let font = "36px sans-serif";

function gameLoop() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Move to the next waveform segment
    waveformIndex = (waveformIndex + scrollSpeed) % waveform.length;

    // Draw ECG waveform
    ctx.beginPath();
    for (let i = 0; i < WIDTH; i++) {
        let waveformPos = (waveformIndex + i) % waveform.length;
        let x = i;
        let y = HEIGHT - waveform[waveformPos];

        // Set color based on waveform type
        ctx.strokeStyle = BLUE;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();

    // Update and display score
    updateScrollSpeed();
    ctx.fillStyle = WHITE;
    ctx.font = font;
    ctx.fillText(`Score: ${score}`, 10, 40);

    // Update the score display element
    scoreDisplay.textContent = `Score: ${score}`;

    requestAnimationFrame(gameLoop);
}

// Call gameLoop to start the rendering loop
gameLoop();

// game_logic_update.js:11  Uncaught TypeError: Assignment to constant variable.
// at gameLoop (game_logic_update.js:11:19)
// at game_logic_update.js:44:1