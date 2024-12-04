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

    useEffect(() => {
        //jj()
    },[])

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
      <>
    <head>
<title>
  Welcome to Nancy.io
</title>

</head>

<body className='bodylogin'>
<main class="main-content mt-0" style={{width:'100%'}}>
  <div class="page-header align-items-start min-vh-100">
    <div class="container my-auto">
      <div class="row">
        <div class="col-lg-4 col-md-8 col-12 mx-auto">
          <div class="card z-index-0 fadeIn3 fadeInBottom">
            <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div class="bg-gradient-primary shadow-primary border-radius-lg py-3 pe-1">
                <h4 class="text-white font-weight-bolder text-center mt-2 mb-0">Welcome to Nancy.io!</h4>
                <div class="row mt-3">
                  <div class="col-2 text-center ms-auto">
                    <a class="btn btn-link px-3" href="javascript:;">
                      <i class="fa fa-facebook text-white text-lg"></i>
                    </a>
                  </div>
                  <div class="col-2 text-center px-1">
                    <a class="btn btn-link px-3" href="javascript:;">
                      <i class="fa fa-github text-white text-lg"></i>
                    </a>
                  </div>
                  <div class="col-2 text-center me-auto">
                    <a class="btn btn-link px-3" href="javascript:;">
                      <i class="fa fa-google text-white text-lg"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-body">
              <form role="form" class="text-start">
                <div class="input-group input-group-outline my-3">
                  
                  <input type="username" placeholder='Username' class="form-control" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div class="input-group input-group-outline mb-3">
                
                  <input type="password" class="form-control" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div class="form-check form-switch d-flex align-items-center mb-3">
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
                </div>
                <div class="text-center">
                  <button type="button" class="btn btn-primary w-100 my-4 mb-2" onClick={handleLogin}>Sign in</button>
                </div>
                <p class="mt-4 text-sm text-center" >
                  Don't have an account?
                  <button class="btn-primary" style={{marginLeft:'5%'}} onClick={handleRegister}>Register</button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer class="footer position-absolute bottom-2 end-2 py-2">
      <div class="container">
        <div class="row justify-content-end">
          <div class="col-auto">
            <div class="copyright text-end text-sm text-primary">
              ©Nancy.io 2024
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</main>
    
   </body>
   </>
    ):(
      <Dashboard username = {username}  getStockData = {args.getStockData} />
    )
  }
  
    </>
  );
  
};

export default Login;
