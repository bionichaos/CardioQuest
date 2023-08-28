// game_logic.js

document.addEventListener("DOMContentLoaded", () => {
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

    // Initialize waveform with a mix of normal and abnormal segments
    let waveform = [];
    let waveformTypes = [];

    let score = 0;
    let scrollSpeed = 2;
    let tagged = [];

    function updateScrollSpeed() {
        scrollSpeed = Math.floor(score / 50) + 1;
        if (scrollSpeed < 1) {
            scrollSpeed = 1;
        }
    }
    // The scroll speed is also limited to a maximum of 10. 
    // This is to prevent the game from becoming too difficult.
    // where is this bit in the code?

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
            
            // Change waveform color to red when clicked and the ECG is abnormal
            if (waveformTypes[waveformIndex] === 1 || waveformTypes[waveformIndex] === 2) {
                waveformTypes[waveformIndex] = 2; // Tagged abnormal or previously tagged abnormal
            }
        }
        // Update the score display element
        // scoreDisplay.textContent = `Score: ${score}`;
    });
    
    const scoreDisplay = document.getElementById("score-display");
    let waveformIndex = 0;
    let displayedWaveformLength = Math.floor(WIDTH / tValues.length);
    const MAX_WAVEFORM_LENGTH = 10000; // Adjusting this value will help ensure that the player doesn't see repeated waveform segments too frequently during gameplay.

    // Main game loop
    function gameLoop() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        
        // Check if the player is about to reach the end of the current segments
        // const nearEnd = waveform.length - waveformIndex < displayedWaveformLength;
        const nearEnd = waveform.length - waveformIndex < displayedWaveformLength + scrollSpeed;

    
        // If the player is about to reach the end of the current segments,
        // add the new waveform segment to the waveform and waveformTypes arrays
        if (nearEnd) {
            const [newWaveform, waveformType] = generateNewWaveformSegment();
            waveform.push(...newWaveform);
            waveformTypes.push(...Array(newWaveform.length).fill(waveformType));
        }
    
        // Move to the next waveform segment
        waveformIndex += scrollSpeed;
        if (waveformIndex >= waveform.length) {
            waveformIndex -= waveform.length;
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
    
        // Update the score display element
        // scoreDisplay.textContent = `Score: ${score}`;
    
        requestAnimationFrame(gameLoop);
    }

    // Start the game loop
    gameLoop();
});

// The drawing on canvas is a bit jumpy.

// Double-check that the waveformTypes array is properly initialized and updated for each segment.

// Verify that the tagged array is correctly tracking which waveform segments have been tagged.

// Make sure that the click event coordinates are being calculated correctly to determine the waveform index being clicked.

// Check for any unintended mutations or reassignments of variables that might be affecting the score calculation.

// Ensure that the generateNewWaveformSegment function returns the appropriate waveform type (1 for abnormal) when an abnormal waveform is generated.

// Make sure the waveform is selected based on the 60% abnormal
// within the sixty percent the abnormal waveform to be selected randomly.

// Before the mouse is pressed, do not reveal actual colors based on currentWaveformType. 
// All colors should be default before the mouse is clicked.

// Generate the complete code without any missing bits or placeholders. 
// include all the constants and functions. Include all the code that remains the same.