from flask import Flask, render_template, request, jsonify
from game_logic import generate_new_waveform_segment

app = Flask(__name__)

# Define routes
@app.route('/')
def index():
    return render_template('index.html')

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
    new_waveform, new_waveform_type = generate_new_waveform_segment()
    return jsonify({
        'waveform': new_waveform,
        'waveform_type': new_waveform_type
    })

if __name__ == '__main__':
    app.run(debug=True)


