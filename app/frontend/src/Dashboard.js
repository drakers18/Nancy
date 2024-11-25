import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import InvestModal from "./components/InvestModal";
import DialogFlowChatbot from "./components/DialogFlow";
// core components
import "./App.css"
//import DB from '../material-dashboard-master/material-dashboard-master/pages/dashboard.html'


const Dashboard = (args) =>{

    
       
     
    return (
       <>
      


       <p>Welcome to the Dashboard {args.username}</p>
       <InvestModal username = {args.username}  getStockData ={args.getStockData}/>
     

        <DialogFlowChatbot/>
      
  
     </>
    )
}
export default Dashboard