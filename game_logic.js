// game_logic.js

document.addEventListener("DOMContentLoaded", () => {
    const HEIGHT = 600;
    const WIDTH = 800;
    const WHITE = "#FFFFFF";
    const RED = "#FF0000";
    const GREEN = "#00FF00";
    const BLUE = "#0000FF";

    // Initialize canvas and game variables
    const canvas = document.getElementById("game-canvas");
    // canvas.width = WIDTH;
    // canvas.height = HEIGHT;
    // document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const font = "36px sans-serif";

    function generateNewWaveformSegment() {
        const abnormalWaveforms = [
            qrsVariation1, qrsVariation2,
            noPWave, noSWave, noTWave
        ];
        const waveformNames = [
            "QRS Variation 1", "QRS Variation 2",
            "No P wave", "No S wave", "No T wave"
        ];

        const isAbnormal = Math.random() < 0.6; // 60% chance of being abnormal

        if (!isAbnormal) { // Normal distribution 
            const waveformFunction = generateFullWaveform;
            const waveformType = 0; // Normal
            console.log("Selected Waveform: Normal");
            return [tValues.map(t => waveformFunction(t)), waveformType];
        } else {
            const index = Math.floor(Math.random() * abnormalWaveforms.length);
            const waveformFunction = abnormalWaveforms[index];
            const waveformType = 1; // Abnormal
            console.log(`Selected Waveform: ${waveformNames[index]}`);
            const newWaveform = tValues.map(t => waveformFunction(t));
            return [newWaveform, waveformType];
        }
    }

    // Generate initial set of waveforms
    let waveform = [];
    let waveformTypes = [];
    const initialNumWaveforms = 2; // Adjust as needed
    for (let i = 0; i < initialNumWaveforms; i++) {
        const [newWaveform, waveformType] = generateNewWaveformSegment();
        waveform.push(...newWaveform);
        waveformTypes.push(...Array(newWaveform.length).fill(waveformType));
    }

    function updateScrollSpeed() {
        scrollSpeed = Math.floor(score / 50) + 1;
        if (scrollSpeed < 1) {
            scrollSpeed = 1;
        }
    }

    let score = 0;
    let scrollSpeed = 2;
    let tagged = [];

    // User Input Handling
    canvas.addEventListener("click", (event) => {
        // Calculate the x-coordinate relative to the canvas
        const canvasX = event.clientX - canvas.getBoundingClientRect().left;
    
        // Calculate the index of the clicked waveform segment
        const waveformIndex = Math.floor((canvasX / WIDTH) * waveform.length);
    
        // Check if the calculated index is within a valid range
        if (waveformIndex >= 0 && waveformIndex < waveform.length) {
            const clickedSegmentType = waveformTypes[waveformIndex];
    
            // Check if the clicked segment is abnormal and not already tagged
            if (clickedSegmentType === 1 && !tagged.includes(waveformIndex)) {
                tagged.push(waveformIndex);
                waveformTypes[waveformIndex] = 2; // Mark as tagged abnormal
                score += 10; // Increase score for tagging an abnormal segment
            } else if (clickedSegmentType === 0) {
                score -= 10; // Decrease score for tagging a normal segment
            }
    
            // Change waveform color to red when clicked and the ECG is abnormal
            if (clickedSegmentType === 1 || clickedSegmentType === 2) {
                waveformTypes[waveformIndex] = 2; // Mark as tagged abnormal or previously tagged abnormal
            }
        }
    });
    
    let waveformIndex = 0;
    let displayedWaveformLength = Math.floor(WIDTH / tValues.length);
    const MAX_WAVEFORM_LENGTH = 10000; // Adjusting this value will help ensure that the player doesn't see repeated waveform segments too frequently during gameplay.

    // Main game loop
    function gameLoop() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        // Move to the next waveform segment
        waveformIndex += scrollSpeed;
        if (waveformIndex >= waveform.length/2) {
            // waveformIndex -= waveform.length;
            // Generate and append new waveforms to ensure continuity
            const [newWaveform, waveformType] = generateNewWaveformSegment();
            waveform.push(...newWaveform);
            waveformTypes.push(...Array(newWaveform.length).fill(waveformType));
        }

        // Reset the canvas path
        ctx.beginPath();

        // Draw ECG waveform
        for (let i = 0; i < WIDTH; i++) {
            const waveformPos = (waveformIndex + i) % waveform.length;
            const x = i;
            const y = HEIGHT - waveform[waveformPos];

            // Set color based on waveform type
            let segmentColor = BLUE;
            if (i === 0 || !tagged.includes(waveformPos)) {
                segmentColor = GREEN; // Default color if not tagged
            } else if (waveformTypes[waveformPos] === 1 || waveformTypes[waveformPos] === 2) {
                segmentColor = RED; // Tagged abnormal or previously tagged abnormal
            }
            ctx.strokeStyle = segmentColor;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();

        // Update and display score
        updateScrollSpeed();
        ctx.fillStyle = RED;
        ctx.font = font;
        ctx.fillText(`Score: ${score}`, 10, 40);

        requestAnimationFrame(gameLoop);
    }
    // Start the game loop
    gameLoop();
});

// this is game_logic.js
