import React, { useState, useEffect } from 'react';
import "./App.css"
import axios from 'axios';
import Dashboard from './Dashboard';

const Login = (args) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [LoggedIn, setLoggedIN] = useState(false)

  useEffect(() =>{
    if(success != '')
    {
      console.log("Success?: ", success)
      if(args.username == '')
        args.setUsername(username)
      
      setLoggedIN(true)
    }
  
  },[success, LoggedIn])
  // Handle form submission for registration
  const handleRegister = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('/register', { username, password });
      setSuccess(response.data.message);
      setError('');
    } catch (err) {
      setError(err.response.data.error);
      setSuccess('');
    }
  };

  // Handle form submission for login
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('/login', { username, password });
      setSuccess(response.data.message);

      setError('');
    } catch (err) {
      setError(err.response.data.error);
      setSuccess('');
    }
  };

  return (
    <>
    {!LoggedIn ?(
    <div>
      <h2>User Authentication</h2>
      <form>
        <div>
          <label>Username:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
        </div>
        <div>
          <label>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>

        <div>
          <button onClick={handleRegister}>Register</button>
          <button onClick={handleLogin}>Login</button>
        </div>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
    ):(
      <Dashboard username = {username}  getStockData = {args.getStockData} />
    )
  }
    </>
  );
  
};

export default Login;
