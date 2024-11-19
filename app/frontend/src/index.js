import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MsalProvider } from "@azure/msal-react";
import { Configuration,  PublicClientApplication } from "@azure/msal-browser";

const msalConfiguration: Configuration = {
    auth: {
        clientId: "your-client-id-here",  // Your Azure app's client ID from the Azure portal
        authority: "https://login.microsoftonline.com/common",  // Default authority for Microsoft accounts
        redirectUri: "http://localhost:3000",  // The URI where the user will be redirected after sign-in
    },
    cache: {
        cacheLocation: "sessionStorage",  // Choose between sessionStorage or localStorage
        storeAuthStateInCookie: false,  // Set this to true if you're supporting older browsers
    }
};

const pca = new PublicClientApplication(msalConfiguration);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <MsalProvider instance={pca}>
          <App />
      </MsalProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
