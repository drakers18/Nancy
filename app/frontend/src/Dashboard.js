import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

// core components
import Admin from "layouts/Admin.js";
import RTL from "layouts/RTL.js";

import "./material-dashboard-material-ui-v4-main"
const Dashboard = () =>{

    
       
     
    return (
       
        <BrowserRouter>
        <Switch>
          <Route path="/admin" component={Admin} />
          <Route path="/rtl" component={RTL} />
          <Redirect from="/" to="/admin/dashboard" />
        </Switch>
      </BrowserRouter>,
      document.getElementById("root")
       
        


    )




}
export default Dashboard