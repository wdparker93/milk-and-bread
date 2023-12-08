from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import sys

FLASK_PORT = 4000

app = Flask(__name__)
CORS(app)

@app.route('/fetch_default_cities', methods=['POST'])
def fetch_default_cities():
    # Run the Python script
    print('Inside fetch_default_cities')
    result = subprocess.run([sys.executable, '.\\src\\backend\\python\\scripts\\LoadUSCities.py'], capture_output=True, text=True)

    return jsonify({'output': result.stdout, 'error': result.stderr})

if __name__ == '__main__':
    print('Backend python server is running on port ' + str(FLASK_PORT))
    app.run(debug=True, port=FLASK_PORT)