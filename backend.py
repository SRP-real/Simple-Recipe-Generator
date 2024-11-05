from flask import Flask, send_from_directory, request, jsonify
import ollama


app = Flask(__name__, static_folder='public')

@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

@app.route("/api/v1/generate", methods=['POST'])
def generate():
    data = request.get_json()
    response = ollama.chat(model="llama3.2", messages=[
        {"role": "system", "content": open("systemprompt.txt").read()},
        {"role": "user", "content": data["prompt"]}
    ])
    return jsonify({"response": response['message']['content']})

if __name__ == '__main__':
    app.run(debug=True, port=5000)