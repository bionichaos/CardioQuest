// game_logic.js

document.addEventListener("DOMContentLoaded", () => {
    const HEIGHT = 600;
    const WIDTH = 800;

    // colors
    const BLUE = "#0477bf";
    const GREEN = "#04bf68";
    const YELLOW = "#f2c641";
    const RED = "#f25835";
    const BLACK = "#0d0d0d";

    const canvas = document.getElementById("game-canvas");
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    const ctx = canvas.getContext("2d");
    const font = "36px sans-serif";

    let score = 0; // Initialize the player's score
    let gameSpeed = 2; // Initialize the game speed (you can adjust this value)

    let waveformType; // 0 for normal, 1 for abnormal
    let currentWaveform = []; // Store the current waveform points

    // Define variables to manage the scrolling waveform
    let waveformX = -WIDTH; // Initial x-coordinate of the waveform
    // let waveformX = -currentWaveform.length; // Set initial position off the left edge

    function DrawWaveform(x, y, waveformColor) {
        ctx.strokeStyle = waveformColor;
        ctx.lineWidth = 5;
        
        ctx.beginPath();
        // ctx.moveTo(x, y); // Move the starting point to (x, y)
    
        // Loop through the currentWaveform points and draw the waveform
        for (let i = 0; i < currentWaveform.length; i++) {
            ctx.lineTo(x + i, y - currentWaveform[i]); // Draw a line segment
        }
    
        ctx.stroke();
        // ctx.closePath();
    }    

    // Function to draw the score
    function drawScore() {
        ctx.fillStyle = BLUE;
        ctx.font = `bold ${font}`;
        ctx.fillText(`Score: ${score}`, 40, 40);
    }

    // Function to clear the canvas
    function clearCanvas() {
        // ctx.clearRect(waveformX, 0, currentWaveform.length, HEIGHT);
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
    }    


    // Define variables for different types of scores
    // let score = 0;
    let hits = 0;
    let falseAlarms = 0;
    let correctRejections = 0;
    let misses = 0;

    let currentWaveformClicked = false;
    let waveformCounted = false;

    // Function to handle user clicks
    function handleClick(event) {
        // Check if the current waveform has already been clicked
        if (!currentWaveformClicked) {
            if (event.clientX >= waveformX && event.clientX <= waveformX + currentWaveform.length) {
                if (waveformType === 1) {
                    // HIT: Player clicked on an abnormal segment, increase score
                    hits++;
                } else {
                    // FALSE ALARM: Player clicked on a normal segment, increase false alarms
                    falseAlarms++;
                }
                // Mark the current waveform as clicked
                currentWaveformClicked = true;

                // Update the overall score based on your scoring logic
                score = hits * 10 - falseAlarms * 10 + correctRejections * 10 - misses * 10;
                score = Math.max(score, -50); // Limit the score to not drop below -100
            }
        }
    }

    // Add a click event listener to the canvas
    canvas.addEventListener("click", handleClick);

    // In the game loop or a timer, check if the player hasn't interacted and update correct rejections and misses accordingly
    function updateCorrectRejectionsAndMisses() {
        
        // Check if the current waveform has completely scrolled off the canvas
        // if (waveformX < -currentWaveform.length) {
        if (waveformX <= -currentWaveform.length && !waveformCounted) {
            // console.log(`Waveform Type: ${waveformType}`);
            if (!waveformCounted) {
                if (waveformType === 0 && !currentWaveformClicked) {
                    // CORRECT REJECTION: Player correctly didn't click on a normal segment
                    correctRejections++;
                } else if (waveformType === 1 && !currentWaveformClicked) {
                    // MISS: Player missed clicking on an abnormal segment
                    misses++;
                }
                // Mark the current waveform as counted
                waveformCounted = true;
    
                // Reset the flags for the next waveform
                currentWaveformClicked = false;
    
                // Update the overall score based on your scoring logic
                score = hits * 10 - falseAlarms * 10 + correctRejections * 10 - misses * 10;
                score = Math.max(score, -50); // Limit the score to not drop below -100
            }
        }
    }

    // Function to display all counters on the canvas
    function drawCounters() {
        // Hits and correct rejections in green
        ctx.fillStyle = GREEN;
        // ctx.font = `bold ${font}`; // Make the font bold
        ctx.fillText(`Hits: ${hits}`, 40, 80);
        ctx.fillText(`Correct Rejections: ${correctRejections}`, 40, 160);
    
        // False alarms and misses in red
        ctx.fillStyle = RED;
        ctx.fillText(`False Alarms: ${falseAlarms}`, 40, 120);
        ctx.fillText(`Misses: ${misses}`, 40, 200);
    }

    // Game loop that scrolls a waveform across the canvas using GenerateWaveform
    function gameLoop() {
        clearCanvas();

        // Increase game speed based on the player's score
        gameSpeed = 5 + Math.floor(score / 50);

        // Move the waveform leftward (scrolling effect)
        waveformX -= gameSpeed;

        // Call the function to update correct rejections and misses at the beginning of the loop
        updateCorrectRejectionsAndMisses();
    
        // Draw the current waveform
        const waveformY = HEIGHT + 100; // You can adjust the vertical position
        DrawWaveform(waveformX, waveformY, BLACK);
    
        // Check if the waveform has completely scrolled off the canvas
        if (waveformX < -currentWaveform.length) {
            // Generate a new waveform
            let [newWaveform, newWaveformType] = GenerateWaveform();

            waveformCounted = false;
            currentWaveformClicked = false;

            // Set the x-coordinate for the new waveform
            waveformX = WIDTH; // Starts just off the right edge
        
            currentWaveform = newWaveform;
            waveformType = newWaveformType;

            console.log(`Waveform Type: ${waveformType}`);
        }
    
        // Draw the score
        drawScore();

        // Draw all counters on the canvas
        drawCounters();

        // Request the next animation frame
        requestAnimationFrame(gameLoop);
    }

    // Start the game loop
    gameLoop();
});
