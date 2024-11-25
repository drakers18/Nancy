import './App.css';
import {React, useState} from 'react';
import LoginPage from "./Login";
import Dashboard from "./Dashboard"
import axios from 'axios';

function App() {
  const [username, setUsername] = useState('')

  const getCurrentStockData = async (stock) =>
  {
    console.log('St CHOSEN: '+stock)
    const response = await axios.post('/StockCurrentPrice', { stock });
    console.log(response)
    return response
  }

  return (
       
      
    <LoginPage username = {username} setUsername ={setUsername} getStockData ={getCurrentStockData}/>
          
        
  );
}

export default App;
