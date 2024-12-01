import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify, abort
import json
import logging
from openai import OpenAI
import openai
from datetime import datetime
from dateutil.relativedelta import relativedelta

import requests
from newsdataapi import NewsDataApiClient

#API DOCS

# POLYGON Stock API:
    # https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/day/2023-01-09/2023-01-09?apiKey=J0fC9euSGHNip9Hw5MdyUBRv78YUWaa
    # https://polygon.io/docs/stocks/getting-started

# NEWS API:
    # https://newsdata.io/documentation
    #newsURL = "https://newsdata.io/api/1/latest?apikey="+newsApiKey+"&q="+keyword+"&language=en"

# Alpha Vantage Stock API
    # https://www.alphavantage.co/support/#api-key

# OPEN AI KEY
    # https://platform.openai.com/docs/api-reference/introduction


load_dotenv()

investor_SYS_Prompt = "You are a financial advisor who will tell the user whether or not their investment is a good one depending on the data given to you"
news_Sys_PROMPT = "You will be given a news article give it an accurate summary (2-5 sentences)"
newsApiKey = os.getenv("NEWS_DATAIO_API_KEY")
openai.api_key = os.getenv('OPENAI_API_KEY')
alpha_api_key = os.environ.get('ALPHA_VANTAGE_API_KEY')
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
    data = request.get_json()
    index = data.get("index")
    title, newsFeed, image = TrackPolitician(index)
    summary = openAI(news_Sys_PROMPT, newsFeed)
    return jsonify(title, summary, image), 200


@app.route('/fetchConsultant', methods =["POST"])
def getASK():
    stockChosen = request.files.get("stock")
    stockNews = GetStockNews(stockChosen)
    userPrompt = stockNews +"\n" +"User Asks: Is "+stockChosen+" a good/profitable investment?"
    answer = openAI(investor_SYS_Prompt, userPrompt )
    print(answer)
    return jsonify({"ASK", answer}), 200


@app.route('/StockCurrentPrice', methods = ["POST"])
def getStockRetrieval():
    data = request.get_json()
    stockChosen = data.get("stock")
    print('Stock Chosen: '+stockChosen)
    answer = get_current_stock_price(stockChosen)
    return answer, 200


def openAI(sysprompt, content):
    # sysprompt, prompt
    load_dotenv()
    client = OpenAI()

    completion = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": sysprompt},
        {
            "role": "user",
            "content": content
        }
    ]
)

   # print(completion.choices[0].message)
    return completion.choices[0].message.content


@app.route('/forwardResponse', methods=['POST'])
def forward_response():
    print("HIT")
    # Parse the request from Dialogflow
    dialogflow_request = request.get_json()
    user_message = dialogflow_request.get('queryResult', {}).get('queryText', '')
    stockName = dialogflow_request.get('queryResult', {}).get('parameters',{}).get('stock')
    stockData = GetStockDataRange(stockName)
    stockNews = GetStockNews(stockName)

    stockData = json.dumps(stockData)
    stockNews = json.dumps(stockNews)

    blob = f"Stock Data: \n"+ stockData +"\n"+"Stock News: \n"+ stockNews
    chatgpt_response = openAI(investor_SYS_Prompt, str(blob) )
    

    print("CHATGPT RESPONSE: ")
    print(chatgpt_response)

    response_to_dialogflow = {
        "fulfillmentText": chatgpt_response,
        "fulfillmentMessages": [
            {
                "text": {
                    "text": [chatgpt_response]
                }
            }
        ]
    }

    return response_to_dialogflow, 200

# 3rd Party API 's



def TrackPolitician(index):
   
    keyword ="top investments"
    api = NewsDataApiClient(apikey=newsApiKey)
    response = api.news_api(q=keyword, max_result=2, country="us", language="en") 
    print(response["results"][index])
  # Right now we are only taking the first resposnse but we do have all the others 
  # 
    title = response["results"][index]["title"]
    desc = response["results"][index]["description"]
    content = response["results"][index]["content"]
    image = response["results"][index]["image_url"]
    if desc is None:
        desc= ''
    
    response = title + desc + content
    return (title, response, image)


def GetStockNews(stockName):
    keyword = stockName+' stock'
    #newsURL = "https://newsdata.io/api/1/latest?apikey="+newsApiKey+"&q="+keyword+"&language=en"
    api = NewsDataApiClient(apikey=newsApiKey)
    response = api.news_api(q=keyword, max_result=1, language="en") 
  #  print(response["results"][0])
  # Right now we are only taking the first resposnse but we do have all the others 
  # 
    title = response["results"][0]["title"]
    desc = response["results"][0]["description"]
    content = response["results"][0]["content"]
    
    if desc is None:
        desc= ''
    
    response = title + desc + content
    print("Stock News: \n" + response +'\n')
    return response

def GetStockDataRange(stock):
    current_date = datetime.now().strftime("%Y-%m-%d")
    last_year = datetime.now() - relativedelta(years=1)
    current_date_lastYear = last_year.strftime("%Y-%m-%d")
    response = requests.get("https://api.polygon.io/v2/aggs/ticker/"+stock+"/range/1/year/"+current_date_lastYear+"/"+current_date+"?",
                             headers= {
                                "Content-Type": "application/json",
                                "Authorization": f"Bearer {os.environ.get('STOCK_API_KEY')}",
                            })
    print("Stock Data: \n")
    print(response.json())
    return response.json()



def get_current_stock_price(stock_symbol):
    
    
    # Construct the API URL
    url = f"https://www.alphavantage.co/query"
    params = {
        "function": "TIME_SERIES_INTRADAY",
        "symbol": stock_symbol,
        "interval": "1min",
        "apikey": alpha_api_key
         }
    
    # Make the GET request
    response = requests.get(url, params=params)

    if response.status_code == 200:
        data = response.json()
        
        # Check if data is valid
        if "Time Series (1min)" in data:
            # Get the most recent time entry
            last_refreshed = data['Meta Data']['3. Last Refreshed']
            open_price = data['Time Series (1min)'][last_refreshed]['1. open']
            return open_price
        else:
            return "Error: Could not retrieve stock data. Check the symbol or API limits."
    else:
        return f"Error: {response.status_code}, {response.text}"




if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
    logging.basicConfig(level=logging.DEBUG)
