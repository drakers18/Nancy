from flask import Flask, request, jsonify
import json
import sqlite3

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024 * 1024  # 5 GB

def connect_to_db():
  
    conn = sqlite3.connect('./MyInvestments')
    return conn





def create_db_table():
    """
    Creates a database table called 'MyInvestments' if it doesn't already exist.
    The table has the following columns:
    id INTEGER PRIMARY KEY,
    uuid TEXT,
    date TEXT,
    creator TEXT,
    stock TEXT,
    bprice TEXT,
    cprice TEXT,
    pmargin TEXT,
    balance REAL,
    sowned INTEGER,
    data TEXT
    """
    try:
        conn = connect_to_db()
        conn.execute('''CREATE TABLE IF NOT EXISTS MyInvestments (
                    id INTEGER PRIMARY KEY,
                    uuid TEXT,
                    date TEXT,
                    creator TEXT,
                    stock TEXT,
                    bprice TEXT,
                    cprice TEXT,
                    pmargin TEXT,
                    balance REAL,
                    sowned INTEGER,
                    data TEXT
                )''')

        conn.commit()
    except sqlite3.Error as e:
        print(f"Error creating the 'MyInvestments' table: {e}")
    finally:
        conn.close()
        

# This route gets all interviews general data
@app.route('/getAllInvestments', methods=['GET'])
def getAllJobPresets():
    
    create_db_table()
    stock = []
    try:
        conn = connect_to_db()
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        cur.execute("SELECT uuid, date, creator, stock, bprice, cprice, pmargin, balance, sowned FROM MyInvestments")
        rows = cur.fetchall()

        # convert row objects to dictionary
        for i in rows:
            preset = {}
            preset["Created_By"] = i["creator"]
            preset["date"] = i["date"]
            preset["Stock"] = i["stock"]
            preset["Buy_Price"] = i["bprice"]
            preset["Current_Price"] = i["cprice"]
            preset["Profit_Margin"] = i["pmargin"]
            preset ["User_Balance"] = i["balance"]
            preset ["Amount_Owned"] = i["sowned"]
            preset["uuid"] = i["uuid"]
           
            stock.append(preset)
            print(stock)

    except sqlite3.Error as e:
        print(f"SQLite error: {e}")
        stock = []

    return jsonify(stock), 200

# This route gets a single interview
@app.route('/getStock', methods=['POST'])
def get_data():
    """
    Retrieves JD data from the database based on the provided UUID.

    Returns:
        A JSON response containing the JD data.
    """
    try:
        json_data = request.get_json()
        uuid = json_data.get('uuid')

        conn = connect_to_db()
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        cur.execute("SELECT data FROM MyInvestments WHERE uuid = ?", (uuid,))
        row = cur.fetchone()

        MIData = row["data"]
        json_data = json.loads(MIData)
    except:
        json_data = []

    return jsonify({"MIData": json_data}), 200

# This route handles adding and editing data in candidate db
@app.route('/saveInvestment', methods=['POST'])
def saveInvestmentData():
    print("SUCCESS")
    create_db_table()
    try:
        json_data = request.get_json()
        MI_Uuid = json_data.get('MI_Uuid')
        Stock = json_data.get('Stock')
        BuyPrice = json_data.get('Buy_Price')
        Date = json_data.get('date')
        creator = json_data.get('creator')
        CurrentPrice = json_data.get('Current_Price')
        ProfitMargin = json_data.get('Profit_Margin')
        UserBalance = json_data.get('User_Balance')
        AmountOwned = json_data.get('Amount_Owned')
        INVDataStr = json.dumps(json_data)

        conn = connect_to_db()
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        cur.execute("SELECT id FROM MyInvestments WHERE uuid = ?", (MI_Uuid,))
        row = cur.fetchone()

        if(row is not None):
            cur.execute("UPDATE MyInvestments SET data = ?, date = ?, stock = ?, bprice = ?, creator = ?, cprice = ?, pmargin = ?, balance = ?, sowned = ? WHERE uuid = ? ", (INVDataStr, Date, Stock, BuyPrice, creator, CurrentPrice, ProfitMargin, UserBalance, AmountOwned, MI_Uuid))
            print("Updated Data")
        else:
            cur.execute("INSERT INTO MyInvestments (uuid, date, stock, bprice, creator, cprice, pmargin, balance, sowned, data) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", (MI_Uuid, Date, Stock, BuyPrice, creator, CurrentPrice, ProfitMargin, UserBalance, AmountOwned, INVDataStr))
            print('Inserting New Row')
        conn.commit()
    except:
        conn().rollback()
        print('Rolled Back')
    finally:
        conn.close()

    return jsonify({"message": "Successfully Saved To DataBase"}), 200

# Route to delete a preset from database
@app.route('/deleteINV', methods=['POST'])
def delete_Inv():
    print("HIT")
    message = {}
    try:
        json_data = request.get_json()
        uuid = json_data.get('uuid')
        conn = connect_to_db()
        conn.execute("DELETE from MyInvestments WHERE uuid = ?",     
                      (uuid,))
        conn.commit()
        message["status"] = "Preset deleted successfully"
    except:
        conn.rollback()
        message["status"] = "Cannot delete Preset"
    finally:
        conn.close()

    return jsonify(message), 200

if __name__ == "__main__":
    create_db_table()
    app.run(host='0.0.0.0', port=6000, debug=False)