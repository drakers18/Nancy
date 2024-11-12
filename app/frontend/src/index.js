import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MsalProvider } from "@azure/msal-react";
import { Configuration,  PublicClientApplication } from "@azure/msal-browser";

const msalConfiguration: Configuration = {
    auth: {
        clientId: "client_id" // the only mandatory field in this object, uniquely identifies your app
        // here you'll add the other fields that you might need based on the Azure portal settings
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
