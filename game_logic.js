document.addEventListener("DOMContentLoaded", () => {

    // Game constants
    const HEIGHT = 600;
    const WIDTH = 800;
    const WHITE = "#FFFFFF";
    const RED = "#FF0000";
    const GREEN = "#00FF00";
    const BLUE = "#0000FF";

    // Initialize canvas and game variables
    const canvas = document.createElement("canvas");
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    document.body.appendChild(canvas);
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

        if (!isAbnormal) {
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


    // Initialize waveform with a mix of normal and abnormal segments
    let waveform = [];
    let waveformTypes = [];
    for (let i = 0; i < Math.floor(WIDTH / tValues.length); i++) {
        const [newWaveform, waveformType] = generateNewWaveformSegment();
        waveform.push(...newWaveform);
        waveformTypes.push(...Array(newWaveform.length).fill(waveformType)); // Use the length of newWaveform
    }

    let score = 0;
    let scrollSpeed = 2;
    let tagged = [];

    function updateScrollSpeed() {
        scrollSpeed = Math.floor(score / 50) + 1;
        if (scrollSpeed < 1) {
            scrollSpeed = 1;
        }
    }


    // User Input Handling
    canvas.addEventListener("click", (event) => {
        const x = event.clientX - canvas.getBoundingClientRect().left;
        const y = event.clientY - canvas.getBoundingClientRect().top;

        const waveformIndex = Math.floor(x / (WIDTH / waveform.length));

        if (waveformIndex >= 0 && waveformIndex < waveform.length) {
            if (waveformTypes[waveformIndex] === 1 && !tagged.includes(waveformIndex)) {
                tagged.push(waveformIndex);
                waveformTypes[waveformIndex] = 2; // Change waveform type to tagged abnormal
                score += 10; // Increase score when tagging an abnormal segment
            } else if (waveformTypes[waveformIndex] === 0) {
                score -= 10; // Decrease score for tagging a normal segment
            }
        }
        // Update the score display element
        const scoreDisplay = document.getElementById("score-display");
        scoreDisplay.textContent = `Score: ${score}`;
    });
    
    const scoreDisplay = document.getElementById("score-display");
    let waveformIndex = 0;

    // Main game loop
    function gameLoop() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        // Move to the next waveform segment
        waveformIndex = (waveformIndex + scrollSpeed) % waveform.length;

        // Draw ECG waveform
        ctx.beginPath();
        for (let i = 0; i < WIDTH; i++) {
            const waveformPos = (waveformIndex + i) % waveform.length;
            const x = i;
            const y = HEIGHT - waveform[waveformPos];

            // Set color based on waveform type
            if (waveformTypes[i] === 1) {
                ctx.strokeStyle = RED; // Abnormal or tagged abnormal
            } else if (waveformTypes[i] === 2) {
                ctx.strokeStyle = RED; // Tagged abnormal
            } else {
                ctx.strokeStyle = BLUE; // Normal
            }

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

    // Start the game loop
    gameLoop();
});


// this is game_logic.js
// make score visible on screen
// change the logic of labeling abnormal ecg
// when mouse clicking the screen,
// if the current waveform ECG is abnormal, change the waveform color to red and add 10 to the score
// if the current waveform ECG is normal, and the mouse was clicked, reduce the score by 10 pionts
// display updated score on the canvas
// make sure the score stays displayed on screen
// scroll the waveforms at speed of 1
// if 50 points are reached speed+1
// always display 1 waveform on the canvas
// make sure there 40% normal and 60% abnormal waveforms
// make sure abnormal waveforms are chosen randomly
// all the waveforms scrolled onto the screen are the same.