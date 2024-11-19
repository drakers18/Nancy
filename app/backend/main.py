from flask import Flask, request, jsonify, abort
import json
import requests

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024 * 1024  # 5 GB

DATABASE_API_URL = "http://database:7000"

# CREATE 

def forward_request(route, method, json_data=None):
    try:
        if method == 'GET':
            response = requests.get(f"{DATABASE_API_URL}/{route}")
        elif method == 'POST':
            response = requests.post(f"{DATABASE_API_URL}/{route}", json=json_data)
        else:
            return abort(400, "Invalid HTTP method")

        response.raise_for_status()  # Raise an HTTPError for bad responses (4xx and 5xx)

        return response.json(), response.status_code
    except requests.RequestException as e:
        return abort(500, f"Error forwarding request: {e}")

# READ 

@app.route('/getAll', methods=['GET'])
def getAllCandidates():
    data, status_code = forward_request("getAll", "GET")
    return jsonify(data), status_code

#UPDATE 



#delete

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6000, debug=False)