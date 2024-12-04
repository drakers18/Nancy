import {React, useEffect, useState} from "react";
import axios from "axios";


const Register = () =>{



    return(
        <>
        <title>Sign Up - Nancy.io</title>
        <body>
  <main class="main-content mt-0">
    <section>
      <div class="page-header min-vh-100">
        <div class="container">
          <div class="row">
            <div class="col-6 d-lg-flex d-none h-100 my-auto pe-0 position-absolute top-0 start-0 text-center justify-content-center flex-column">
              <div class="position-relative bg-gradient-primary h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center" style="background-image: url('../assets/img/devilnancy.jpg'); background-size: cover;"></div>
            </div>
            <div class="col-xl-4 col-lg-5 col-md-7 d-flex flex-column ms-auto me-auto ms-lg-auto me-lg-5">
              <div class="card-container">
                <div class="card card-plain">
                  <div class="card-header text-center pb-2 header-bg">
                    <h4 class="header-text">Sign Up for Nancy.io!</h4>
                  </div>
                  <div class="card-body">
                    <form role="form" class="text-start">
                      <div class="input-group input-group-outline my-3">
                        <label class="form-label">Name</label>
                        <input type="text" class="form-control"/>
                      </div>
                      <div class="input-group input-group-outline mb-3">
                        <label class="form-label">Password</label>
                        <input type="password" class="form-control"/>
                      </div>
                      <div class="text-center">
                        <button type="button" class="btn btn-primary w-100 my-4 mb-2">Sign Up</button>
                      </div>
                      <p class="mt-4 text-sm text-center">
                        Already have an account?
                        <a href="../pages/sign-in.html" class="text-primary font-weight-bold">Sign in</a>
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
    )
}

export default Register