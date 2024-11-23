import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify, abort
import json
import requests
from newsdataapi import NewsDataApiClient

#API DOCS

# Stock API:
    # https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/day/2023-01-09/2023-01-09?apiKey=J0fC9euSGHNip9Hw5MdyUBRv78YUWaa
    # https://polygon.io/docs/stocks/getting-started

# NEWS API:
    # https://newsdata.io/documentation
    #newsURL = "https://newsdata.io/api/1/latest?apikey="+newsApiKey+"&q="+keyword+"&language=en"


investor_SYS_Prompt = "You are a financial advisor who will tell the user whether or not their investment is a good one depending on the data given to you"
news_Sys_PROMPT = "You will be given articles of a politician with their recent stock trades, you will choose the most recent one and summarize it in one sentence"
newsApiKey = os.getenv("NEWS_API_KEY")

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024 * 1024  # 5 GB
SIGN_DATABASE_URL = "http://signindatabase:7000"
STOCK_DATABASE_URL = "http://stockdatabase:6000"

# CREATE 

def forward_request(DBURL, route, method, json_data=None):
    try:
        if method == 'GET':
            response = requests.get(f"{DBURL}/{route}")
        elif method == 'POST':
            response = requests.post(f"{DBURL}/{route}", json=json_data)
        else:
            return abort(400, "Invalid HTTP method")

        response.raise_for_status()  # Raise an HTTPError for bad responses (4xx and 5xx)

        return response.json(), response.status_code
    except requests.RequestException as e:
        return abort(500, f"Error forwarding request: {e}")



# Database Routes

# STOCK Section

@app.route('/getAllInvestments', methods=['GET'])
def getAllInvestments():
    data, status_code = forward_request(STOCK_DATABASE_URL, "getAllInvestments", "GET")
    return jsonify(data), status_code


@app.route('/deleteINV', methods=['POST'])
def deleteINV():
    json_data = request.get_json()
    data, status_code = forward_request(STOCK_DATABASE_URL, "deleteINV", "POST", json_data= json_data)
    return jsonify(data), status_code


@app.route('/getStock', methods=['POST'])
def getStock():
    json_data = request.get_json()
    data, status_code = forward_request(STOCK_DATABASE_URL, "getStock", "POST", json_data= json_data)
    return jsonify(data), status_code


@app.route('/saveInvestment', methods=['POST'])
def save():
    json_data = request.get_json()
    data, status_code = forward_request(STOCK_DATABASE_URL, "saveInvestment", "POST", json_data= json_data)
    return jsonify(data), status_code



# LOGIN SECTION

@app.route('/login', methods=['POST'])
def login():
    json_data = request.get_json()
    data, status_code = forward_request(SIGN_DATABASE_URL, "login", "POST", json_data= json_data)
    return jsonify(data), status_code


@app.route('/register', methods=['POST'])
def register():
    json_data = request.get_json()
    data, status_code = forward_request(SIGN_DATABASE_URL, "register", "POST", json_data= json_data)
    return jsonify(data), status_code




# FRONTEND ROUTES

@app.route('/fetchNEWS', methods =["POST"])
def getAssessment():
    politician = request.files.get("politician")
    newsFeed = TrackPolitician(politician)
    answer = openAI(news_Sys_PROMPT, newsFeed)
    return jsonify("NEWS", answer), 200


@app.route('/fetchConsultant', methods =["POST"])
def getASK():
    stockChosen = request.files.get("stock")
    stockNews = StockNews(stockChosen)
    userPrompt = stockNews +"\n" +"User Asks: Is "+stockChosen+" a good/profitable investment?"
    answer = openAI(investor_SYS_Prompt, userPrompt )
    print(answer)
    return jsonify("ASK", answer), 200


@app.route('/StockDataRetrieval', methods = ["POST"])
def getStockRetrieval():
    stockChosen = request.files.get("stock")
    answer = GetStockData(stockChosen)
    return jsonify("Stock", answer), 200


def openAI(sysprompt, prompt):
    load_dotenv()
    messages = [
        {
            "role": "System",
            "content": sysprompt
        },
        {
            "role": "user", 
            "content": prompt
        }
    ]
    response = requests.post(
        "https://api.openai.com/v1/chat/completions",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {os.environ.get('OPENAI_API_KEY')}",
        },
        json={
            "model": "gpt-4",
            "messages": messages,
            "max_tokens": 2000,
            "n": 1,
            "stop": None,
            "temperature": 0.8,
        },
    )
    return response.json()



# 3rd Party API 's



def TrackPolitician(politician):
   
    keyword = politician+ " new trades"
    api = NewsDataApiClient(apikey=newsApiKey)
    response = api.news_api(q=keyword, max_result=1) 
    print(response["results"][0])
  # Right now we are only taking the first resposnse but we do have all the others 
  # 
    title = response["results"][0]["title"]
    desc = response["results"][0]["description"]
    content = response["results"][0]["content"]
    
    if desc is None:
        desc= ''
    
    response = title + desc + content
    return response.json()


def StockNews(stockName):
    keyword = stockName
    #newsURL = "https://newsdata.io/api/1/latest?apikey="+newsApiKey+"&q="+keyword+"&language=en"
    api = NewsDataApiClient(apikey=newsApiKey)
    response = api.news_api(q=keyword, max_result=1) 
    print(response["results"][0])
  # Right now we are only taking the first resposnse but we do have all the others 
  # 
    title = response["results"][0]["title"]
    desc = response["results"][0]["description"]
    content = response["results"][0]["content"]
    
    if desc is None:
        desc= ''
    
    response = title + desc + content
    return response.json()

def GetStockData(stock):
    response = requests.post("https://api.polygon.io/v2/aggs/ticker/"+stock+"/range/1/day/2023-01-09/2023-01-09?",
                             headers= {
                                "Content-Type": "application/json",
                                "Authorization": f"Bearer {os.environ.get('STOCK_API_KEY')}",
                             })
    return response.json()



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)