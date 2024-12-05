import {React, useEffect, useState} from "react";
import axios from "axios";
import Nancy from "./assets/devilnancy.jpg"
import Login from "./Login";

const Register = () =>{
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [SignIn, setSignIn] = useState(false)
    
    const handleRegister = async (event) =>{

        if((username && password) != '')
        {

        event.preventDefault();
        try {
            const response = await axios.post('/register', { username, password });
            setSuccess(response.data.message);
            setError('');
           
          } catch (err) {
            setError(err.response.data.error);
            setSuccess('');
          }
        }
    }


    return(
        <>
        { !SignIn ? (
        <>
        <title>Sign Up - Nancy.io</title>
        <body>
        <main class="main-content mt-0" style={{width:'100%'}}>
    <section>
      <div class="page-header min-vh-100" style={{backgroundColor:'white'}}>
        <div class="container">
          <div class="row">
            <div class="col-6 d-lg-flex d-none h-100 my-auto pe-0 position-absolute top-0 start-0 text-center justify-content-center flex-column">
              <div class="position-relative bg-gradient-primary h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center" style= {{backgroundImage: `url(${Nancy})`, backgroundSize:'cover', backgroundPosition:'center'}}></div>
            </div>
            <div class="col-xl-4 col-lg-5 col-md-7 d-flex flex-column ms-auto me-auto ms-lg-auto me-lg-5">
              <div class="card-container">
                <div class="card card-plain">
                  <div class="card-header text-center pb-2 header-bg" style={{backgroundColor:'#007bff'}}>
                    <h4 class="header-text" style={{backgroundColor:'#007bff', color:'white'}}>Sign Up for Nancy.io!</h4>
                  </div>
                  <div class="card-body" style={{backgroundColor:'#e9ecef', borderRadius:'6px'}}>
                    <form role="form" class="text-start">
                      <div class="input-group input-group-outline my-3">
                        <input type="text" class="form-control" placeholder="Username"  value={username} onChange={(e) => setUsername(e.target.value)} style={{backgroundColor:'white'}}/>
                      </div>
                      <div class="input-group input-group-outline mb-3">
                        <input type="password" class="form-control" placeholder="Password"  value={password} style={{backgroundColor:'white'}} onChange={(e) => setPassword(e.target.value)}/>
                      </div>
                      <div class="text-center">
                        <button type="button" class="btn btn-primary w-100 my-4 mb-2" onClick={handleRegister}>Sign Up</button>
                      </div>

                      {error && <p style={{ color: 'red' }}>{error}</p>}
                      {success && <p style={{ color: 'green' }}>{success}</p>}

                      <p class="mt-4 text-sm text-center">
                        Already have an account?
                        <button class="text-primary font-weight-bold" style={{border:'none'}} onClick={() => setSignIn(true)} >Sign in</button>
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</body>
        
        
</>

):(
<Login></Login>
)}
 
  </>  


)}

export default Register