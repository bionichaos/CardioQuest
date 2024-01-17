from flask import Flask, render_template, request, jsonify
import random  # Import the random module
# from static.game import generate_new_waveform_segment

app = Flask(__name__)

# Define routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/static/game.js')  # Make sure this route matches your file structure
def serve_game_js():
    return app.send_static_file('game.js')

@app.route('/generate_waveform_data', methods=['GET'])
def generate_waveform_data():
    waveform_data, waveform_type = generate_new_waveform()  # Call the correct function here
    return jsonify({'waveform': waveform_data, 'waveform_type': waveform_type})

@app.route('/update_score', methods=['POST'])
def update_score():
    data = request.json
    new_score = data.get('new_score', 0)

    # Add a console log to see the value of new_score
    print('New Score:', new_score)

    # Update the score in the game logic or database as needed

    return jsonify({'new_score': new_score})

@app.route('/generate_new_waveform', methods=['GET'])
def generate_new_waveform():
    waveform_data, waveform_type = generate_new_waveform_segment()  # Call the correct function here
    return jsonify({'waveform': waveform_data, 'waveform_type': waveform_type})

if __name__ == '__main__':
    app.run(debug=True)

# this is app.py file