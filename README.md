# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
# Nancy App - Dockerized Local Environment Setup

Welcome to the Nancy App! Follow these instructions to set up the application in a Dockerized local environment.

---

## Prerequisites

1. **Install Docker Desktop**  
   Download and install Docker Desktop: [Docker Desktop](https://www.docker.com/products/docker-desktop/)

---

## Setup Steps

### 1. Create a Docker Network
```bash
docker network create Nancy_network
```


### 2. Build and Run the Frontend
Navigate to the frontend directory and build the frontend container (from root):
```
cd app
cd frontend
docker build -t nancyfrontend .
```
### 3. Build the Backend
Navigate to the backend directory and build the backend container (from root) :
```
cd app
cd backend
docker build -t nancyback .
```


### 4. Build the Databases
First Database: signIn
Navigate to the db/signIn directory and build the signIn database container  FROM PROJECT ROOT:
```
cd db
cd signIn
docker build -t signdb .
```

Second Database: stockDB
Navigate to the db/stockDB directory and build the signIn database container  FROM PROJECT ROOT:
```
cd db
cd stockDB
docker build -t stockdb .
```

### Final Steps: Putting It All Together
1. Build and Run the App
Navigate to the app directory and build the containers for the frontend and backend (FROM PROJECT ROOT):
```
cd app
docker compose build
docker compose up
```

## 2. Build and Run the Databases
Navigate to the db directory and build the containers for the databases:
```
cd ..
cd db
docker compose build
docker compose up
```

### NOW ITS RUNNING ON LOCALHOST:3000!

Notes:
-Make Sure to replace your api keys in ENV
- use NGROK For Dialogflow Bot


