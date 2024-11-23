from flask import Flask, request, jsonify
import sqlite3
import bcrypt

app = Flask(__name__)
DB_FILE = "users.db"

# Helper function to initialize the database
def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )
    """)
    conn.commit()
    conn.close()

# Endpoint to register a user
@app.route('/register', methods=['POST'])
def register_user():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400
    
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute("INSERT INTO Users (username, password) VALUES (?, ?)", 
                       (username, hashed_password))
        conn.commit()
        conn.close()
        return jsonify({"message": "User registered successfully"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "Username already exists"}), 409

# Endpoint to login a user
@app.route('/login', methods=['POST'])
def login_user():
    print("HIT")
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("SELECT password FROM Users WHERE username = ?", (username,))
    result = cursor.fetchone()
    conn.close()

    if result:
        stored_password = result[0]
        if bcrypt.checkpw(password.encode('utf-8'), stored_password):
            return jsonify({"message": "Login successful"}), 200
        else:
            return jsonify({"error": "Invalid password"}), 401
    else:
        return jsonify({"error": "Username not found"}), 404

# Initialize the database when the server starts
if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=7000)
