import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify, abort
import json
import requests
from newsdataapi import NewsDataApiClient


investor_SYS_Prompt = "You are a financial advisor who will tell the user whether or not their investment is a good one depending on the data given to you"
news_Sys_PROMPT = "You will be given articles of a politician with their recent stock trades, you will choose the most recent one and summarize it in one sentence"
newsApiKey = os.getenv("NEWS_API")


app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024 * 1024  # 5 GB
DATABASE_API_URL = "http://userDB:6000"

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
def getAllInvestments():
    data, status_code = forward_request("getAllInvestments", "GET")
    return jsonify(data), status_code

#UPDATE 

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







def TrackPolitician(politician):
   
    keyword = politician+ " new trades"
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



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)