import './App.css';
import {React, useState} from 'react';
import LoginPage from "./Login";
import Dashboard from "./Dashboard"

function App() {
  const [username, setUsername] = useState('')
  return (
       
      
    <LoginPage username = {username} setUsername ={setUsername}/>
          
        
  );
}

export default App;
