import "./App.css"

import {React, useEffect, useState} from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import InvestModal from "./components/InvestModal";
import DialogFlowChatbot from "./components/DialogFlow";
import { Chart, LinearScale, CategoryScale, LineElement, PointElement, Title, Tooltip, Legend, LineController } from "chart.js";

// Register the required components
Chart.register(LinearScale, CategoryScale, LineElement, PointElement, Title, Tooltip, Legend, LineController);

// core components
//import DB from '../material-dashboard-master/material-dashboard-master/pages/dashboard.html'


const Dashboard = (args) =>{
    useEffect(() => {
        // Ensure the DOM is ready before creating the charts
        const chart1 = document.getElementById("line-chart-1");
        const chart2 = document.getElementById("line-chart-2");
        const chart3 = document.getElementById("line-chart-3");

        if (chart1 && chart2 && chart3) {
            createLineChart(chart1.getContext("2d"), "Stock 1", [150, 155, 160, 158, 165], "#43A047");
            createLineChart(chart2.getContext("2d"), "Stock 2", [200, 198, 205, 210, 220], "#1E88E5");
            createLineChart(chart3.getContext("2d"), "Stock 3", [120, 125, 130, 128, 135], "#E53935");
        } else {
            console.error("Chart containers not found.");
        }
    }, []); // Empty dependency array to run this effect once when the component mounts

    function createLineChart(ctx, label, data, color) {
        return new Chart(ctx, {
            type: "line",
            data: {
                labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"],
                datasets: [{
                    label: label,
                    data: data,
                    borderColor: color,
                    backgroundColor: "transparent",
                    borderWidth: 1,
                    tension: 0.4,
                    pointRadius: 8,
                    pointBackgroundColor: color,
                    pointBorderColor: "transparent",
                    hitRadius: 20,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return "$" + tooltipItem.raw.toFixed(2); // Format as currency
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: { display: false },
                        grid: { display: false },
                    },
                    x: {
                        ticks: { display: false },
                        grid: { display: false },
                    },
                },
            },
        });
    }
       
     
    return (
       <>
      

        <DialogFlowChatbot/>
      

        <head>
             <title>Finance Dashboard</title>
        </head>
        <body>

    <div class="sidebar">
        <div class="logo">
        Nancy.io
        </div>

    <div class="profile">
        <img src="https://via.placeholder.com/150" alt="User Profile Picture"></img>
        <div>Hello, {args.username}!</div> 
    </div>

    <ul>
        <li>MyProfile</li>
        <li>Settings</li>
    </ul>

    <div class="logout-container">
        <ul>
            <li>Log Out</li>
        </ul>
    </div>
</div>

<div class="content">
    <h1>Dashboard</h1> 

    <h2 class="news-header">News</h2>
    <div className="news-cards-container">
    <div className="news-card">
        <img src="https://via.placeholder.com/150" alt="News Thumbnail" />
        <div className="news-content">
            <h3 className="news-title">News Title 1</h3>
            <p className="news-description" style={{color:'black'}}>
                This is a brief description of the news. It provides a summary of the content.
            </p>
        </div>
    </div>

    <div className="news-card">
        <img src="https://via.placeholder.com/150" alt="News Thumbnail" />
        <div className="news-content">
            <h3 className="news-title" >News Title 2</h3>
            <p className="news-description" style={{color:'black'}}>
                This is another brief description of the news. Learn more by clicking on it.
            </p>
        </div>
    </div>


    <h2 class="invest-header" style={{marginTop:'2%'}}>Invest</h2>

    <InvestModal username = {args.username}  getStockData ={args.getStockData}/>
     
</div>
</div>
<div class="graphs-container">
    <div class="graph-header">Stock 1</div>
    <canvas id="line-chart-1"></canvas>
    <div class="graph-header">Stock 2</div>
    <canvas id="line-chart-2"></canvas>
    <div class="graph-header">Stock 3</div>
    <canvas id="line-chart-3"></canvas>
</div>



</body>
  
     </>
    )
}
export default Dashboard