// Get the canvas element and its context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let score = 0;
let scroll_speed = 2; // Define and initialize scroll_speed

// Example: Draw a rectangle
function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

let waveform = [];
let waveform_types = [];
let tagged = []; // Define the tagged array

// Define a function to fetch new waveform segments
async function fetchNewWaveformSegment() {
    return fetch('/generate_new_waveform')  // Make sure the URL matches the Flask route
        .then(response => response.json())
        .then(data => ({
            waveform: data.waveform,
            waveform_type: data.waveform_type
        }))
        .catch(error => {
            console.error('Error fetching new waveform:', error);
            return null;
        });
}

// Inside your game loop
async function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw game elements (waveforms, etc.)
    waveform = waveform.slice(scroll_speed);
    waveform_types = waveform_types.slice(scroll_speed);

    // Calculate how many new segments are needed to fill the removed ones
    const segmentsNeeded = Math.ceil((canvas.width / scroll_speed) - waveform.length);

    // Generate and append new waveform segments
    for (let i = 0; i < segmentsNeeded; i++) {
        const newWaveformData = await fetchNewWaveformSegment();
        if (newWaveformData) {
            waveform.push(...newWaveformData.waveform);
            waveform_types.push(...Array(newWaveformData.waveform.length).fill(newWaveformData.waveform_type));
        }
    }

    // Draw waveforms
    const yOffset = canvas.height / 6;
    for (let i = 0; i < waveform.length; i++) {
        const x = i * scroll_speed;
        const y = canvas.height - waveform[i] - yOffset;
        ctx.strokeStyle = waveform_types[i] === 0 ? 'blue' : 'red';
        ctx.lineWidth = 3; // Adjust this value for desired thickness
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + scroll_speed, y);
        ctx.stroke();
    }

    // Draw tagged points
    const tagRadius = 5;
    for (const t of tagged) {
        const x = t * scroll_speed;
        const y = canvas.height - waveform[t] - yOffset;
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(x, y, tagRadius, 0, 2 * Math.PI);
        ctx.fill();
    }

    // Draw score
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);

    requestAnimationFrame(gameLoop);
}

// Add a click event listener to the canvas
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Calculate whether the click is on an abnormal waveform or not
    // Update the score based on the result

    // Send the updated score to the server
    fetch('/update_score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ new_score: score })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Response from server:', data); // Log the response data
        score = data.new_score;
        // Update the score display in the HTML
        document.getElementById('score').textContent = `Score: ${score}`;
    })
    .catch(error => {
        console.error('Error updating score:', error);
    });    
});

// Call the game loop to start the game
gameLoop();

// Score is not going up is the main problem.