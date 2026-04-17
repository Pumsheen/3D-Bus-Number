from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/bus', methods=['POST'])
def receive_bus():
    data = request.json
    print("Bus received:", data['bus'])
    return jsonify({"status": "ok"})

# IMPORTANT: no app.run() for Render