import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import InvestModal from "./components/InvestModal";
// core components
import "./App.css"


const Dashboard = () =>{

    
       
     
    return (
       <>
       <p>Welcome to the Dashboard</p>
       <InvestModal></InvestModal>
     </>
    )
}
export default Dashboard