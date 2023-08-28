// Get the canvas element and its context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let score = 0;
let scroll_speed = 2; // Define and initialize scroll_speed
let default_scroll_speed = 2; // Define the default scroll speed
let normalWaveformPercentage = 40; // Percentage of normal waveforms (default: 40)

function generate_new_waveform_segment() {
    const abnormal_waveforms = [
        qrs_variation_1, qrs_variation_2,
        no_p_wave, no_s_wave, no_t_wave
    ];
    const waveform_names = [
        "QRS Variation 1", "QRS Variation 2",
        "No P wave", "No S wave", "No T wave"
    ];

    const isNormalWaveform = Math.random() * 100 < normalWaveformPercentage;

    if (isNormalWaveform) {
        waveform_function = generate_full_waveform;
        waveform_type = 0; // Normal
        console.log("Selected Waveform: Normal");
    } else {
        index = Math.floor(Math.random() * abnormal_waveforms.length);
        waveform_function = abnormal_waveforms[index];
        waveform_type = 1; // Abnormal
        console.log(`Selected Waveform: ${waveform_names[index]}`);
    }

    new_waveform = t_values.map(waveform_function); // Use map to apply waveform function
    return [new_waveform, waveform_type];
}


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
    return fetch('/generate_new_waveform')
        .then(response => response.json())
        .catch(error => {
            console.error('Error fetching new waveform:', error);
            return null;
        });
}

function update_scroll_speed() {
    scroll_speed = default_scroll_speed + Math.floor(score / 50); // Adjust scroll speed based on score
    if (scroll_speed < 1) {
        scroll_speed = 1;
    }
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
            waveform_types.push(newWaveformData.waveform_type);
        }
    }

    // Call the update_scroll_speed function
    update_scroll_speed();

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

    // Calculate the index of the clicked waveform segment
    const clickedIndex = Math.floor(x / scroll_speed);

    // Check if the clicked waveform is abnormal
    if (waveform_types[clickedIndex] === 1) {
        // Abnormal waveform clicked, increase the score
        score += 10;
    } else {
        // Normal waveform clicked, decrease the score
        score -= 10;
        if (score < 0) {
            score = 0; // Ensure the score doesn't go negative
        }
    }

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

// This is games.js file

// Uncaught (in promise) TypeError: newWaveformData.waveform is not iterable (cannot read property undefined)
