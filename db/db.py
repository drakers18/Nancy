from flask import Flask, jsonify
import sqlite3

# Initialize Flask app
app = Flask(__name__)

# Function to get all users from the database
def get_all_users():
    # Connect to SQLite database
    conn = sqlite3.connect('db')
    cursor = conn.cursor()

    # Query to fetch all users
    cursor.execute('SELECT * FROM users')

    # Fetch all records
    users = cursor.fetchall()

    # Close the database connection
    cursor.close()
    conn.close()

    # Return users as a list of dictionaries
    return [{'id': user[0], 'name': user[1], 'age': user[2]} for user in users]

# Define a route for getting all users
@app.route('/getAll', methods=['GET'])
def get_all():
    # Get all users from the database
    users = get_all_users()

    # Return the users as JSON response
    return jsonify(users)

# Initialize the app to run on a local development server
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=7000, debug=False)
    # Create table and insert data if not already present
    conn = sqlite3.connect('db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            age INTEGER NOT NULL
        )
    ''')
    # Insert sample data into the users table if empty
    cursor.execute('SELECT COUNT(*) FROM users')
    if cursor.fetchone()[0] == 0:
        cursor.executemany('''
            INSERT INTO users (name, age) VALUES (?, ?)
        ''', [
            ('Alice', 30),
            ('Bob', 25),
            ('Charlie', 35)
        ])
        conn.commit()
    cursor.close()
    conn.close()

    # Run the Flask app
    app.run(debug=True)
