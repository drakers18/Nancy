import {React, useState, useEffect} from "react"
import axios from "axios"
import { Chart, LinearScale, CategoryScale, LineElement, PointElement, Title, Tooltip, Legend, LineController, PieController, ArcElement } from "chart.js";

Chart.register(LinearScale, CategoryScale, LineElement, PointElement, Title, Tooltip, Legend, LineController, PieController, ArcElement);

const MyProfile = () => {

useEffect(() =>{

    const data = {
        labels: ['Stock 1', 'Stock 2', 'Stock 3'],
        datasets: [{
            data: [300, 150, 250],
            backgroundColor: ['#43A047', '#1E88E5', '#E53935'],
            hoverBackgroundColor: ['#388E3C', '#1976D2', '#D32F2F'],
        }]
    };

    // Pie chart options
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        return "$" + tooltipItem.raw.toFixed(2); // Add dollar sign to the tooltip
                    }
                }
            }
        }
    };

    // Create the pie chart
    const ctx = document.getElementById('pie-chart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: data,
        options: options
    });

    // Calculate and display the total stock value
    const totalStockValue = data.datasets[0].data.reduce((acc, value) => acc + value, 0);
    document.getElementById('total-value').textContent = "$" + totalStockValue.toFixed(2); // Format with dollar sign

    // Stock prices (current and previous day prices)
    const currentPrices = {
        stock1: 150.50,
        stock2: 210.75,
        stock3: 135.25
    };

    const previousPrices = {
        stock1: 140.00,
        stock2: 200.00,
        stock3: 130.00
    };

    // Stock price updates: Compare current price to the previous day's price
    const stockPrices = [
        { elementId: 'stock1', currentPrice: currentPrices.stock1, previousPrice: previousPrices.stock1 },
        { elementId: 'stock2', currentPrice: currentPrices.stock2, previousPrice: previousPrices.stock2 },
        { elementId: 'stock3', currentPrice: currentPrices.stock3, previousPrice: previousPrices.stock3 }
    ];

    stockPrices.forEach(stock => {
        const stockElement = document.getElementById(stock.elementId);
        const priceChange = stock.currentPrice - stock.previousPrice;
        const priceColor = priceChange >= 0 ? 'green' : 'red'; // Green if up, red if down
        stockElement.textContent = `${stock.elementId.replace('stock', 'Stock ')}: $${stock.currentPrice.toFixed(2)}`;
        stockElement.style.color = priceColor; // Set color based on price change
    });
}, [])




return (
    <>
     <title>My Profile</title>

     <body>

<div class="sidebar">
    <div class="logo">
        Nancy.io
    </div>

  
    <div class="profile">
        <img src="https://via.placeholder.com/150" alt="User Profile Picture"/>
        <div>Hello, username!</div> 
    </div>

    <ul>
        <li>Dashboard</li> 
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
    <h1>My Profile</h1>

    <div class="my-portfolio-header">My Portfolio</div>

    <div class="pie-chart-container">
        <canvas id="pie-chart" height='360px !important' width= '360px !important'></canvas>
    </div>

    <div class="total-header">Total</div>
    <div class="total-value" id="total-value">$0.00</div>
</div>


<div class="stock-prices">
    <div class="stock1" id="stock1">Stock 1: $150.50</div> 
    <div class="stock2" id="stock2">Stock 2: $210.75</div> 
    <div class="stock3" id="stock3">Stock 3: $135.25</div>
</div>


<script>
 
    
</script>
</body>
    </>


)}


export default MyProfile