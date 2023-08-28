// game_logic_setup.js

let HEIGHT = 600;
let WIDTH = 800;
let WHITE = "#FFFFFF";
let RED = "#FF0000";
let GREEN = "#00FF00";
let BLUE = "#0000FF";

let waveform = [];
let waveformTypes = [];
let waveformIndex;

function generateNewWaveformSegment() {
    let abnormalWaveforms = [
        qrsVariation1, qrsVariation2,
        noPWave, noSWave, noTWave
    ];
    let waveformNames = [
        "QRS Variation 1", "QRS Variation 2",
        "No P wave", "No S wave", "No T wave"
    ];

    let isAbnormal = Math.random() < 0.6; // 60% chance of being abnormal

    if (!isAbnormal) {
        let waveformFunction = generateFullWaveform;
        let waveformType = 0; // Normal
        console.log("Selected Waveform: Normal");
        return [tValues.map(t => waveformFunction(t)), waveformType];
    } else {
        let index = Math.floor(Math.random() * abnormalWaveforms.length);
        let waveformFunction = abnormalWaveforms[index];
        let waveformType = 1; // Abnormal
        console.log(`Selected Waveform: ${waveformNames[index]}`);
        let newWaveform = tValues.map(t => waveformFunction(t));
        return [newWaveform, waveformType];
    }
}

// User Input Handling
let canvas = document.createElement("canvas");
canvas.width = WIDTH;
canvas.height = HEIGHT;
document.body.appendChild(canvas);
let ctx = canvas.getContext("2d");

canvas.addEventListener("click", (event) => {
    let x = event.clientX - canvas.getBoundingClientRect().left;
    let y = event.clientY - canvas.getBoundingClientRect().top;

    waveformIndex = Math.floor(x / (WIDTH / waveform.length));

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
    scoreDisplay.textContent = `Score: ${score}`;
});

let scoreDisplay = document.getElementById("score-display");

export { ctx, WIDTH, HEIGHT, waveform, scoreDisplay };

// game_logic_update.js:11  Uncaught TypeError: Assignment to constant variable.
// at gameLoop (game_logic_update.js:11:19)
// at game_logic_update.js:44:1