import logo from './logo.svg';
import './App.css';
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import LoginPage from "./Login";
import React from "react";
import Dashboard from "./Dashboard";

function App() {
  return (
        <React.StrictMode>
          <UnauthenticatedTemplate>
            <LoginPage/>
          </UnauthenticatedTemplate>
          <AuthenticatedTemplate>
            <Dashboard></Dashboard>
          </AuthenticatedTemplate>
        </React.StrictMode>
  );
}

export default App;
