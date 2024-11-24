import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import InvestModal from "./components/InvestModal";
// core components
import "./App.css"
import DB from '../material-dashboard-master/material-dashboard-master/pages/dashboard.html'


const Dashboard = () =>{

    
       
     
    return (
       <>



       <p>Welcome to the Dashboard</p>
       <InvestModal></InvestModal>
      <DB></DB>

     </>
    )
}
export default Dashboard