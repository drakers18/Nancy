import {React, useState, useEffect} from "react"
import axios from "axios"
import { Chart, LinearScale, CategoryScale, LineElement, PointElement, Title, Tooltip, Legend, LineController, PieController, ArcElement } from "chart.js";
import userImage from "./assets/userprofile.webp"
import { getDate } from "./utils";
import Dashboard from "./Dashboard"
Chart.register(LinearScale, CategoryScale, LineElement, PointElement, Title, Tooltip, Legend, LineController, PieController, ArcElement);



const MyProfile = (args) => {
    const [allStocks, setallStocks] = useState([])
    const [DashboardClicked, setDashboardClicked] = useState(false)
    const [Loaded , setLoaded] = useState(false)
    const [TotalCost, setTotalCost] = useState(null)



useEffect(() =>{
    if(allStocks.length !=0){
        updateStocks()
        if(TotalCost)
        {
            console.log(TotalCost)
            setLoaded(true)
        }
        
    }
}, [allStocks, TotalCost])





useEffect(() =>{
    callFetch()
   
    if(Loaded==true){
    const data = {
        labels: [allStocks[0]?.Stock|| 'NA', allStocks[1]?.Stock|| 'NA', allStocks[2]?.Stock || 'NA'],
        datasets: [{
            data: [parseFloat(allStocks[0]?.Buy_Price) || 0, parseFloat(allStocks[1]?.Buy_Price) || 0, parseFloat(allStocks[2]?.Buy_Price) || 0],
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
    let currentPrices = {
        stock1: parseFloat(allStocks[0]?.Profit_Margin) || 0 ,
        stock2: parseFloat(allStocks[1]?.Profit_Margin) || 0,
        stock3: parseFloat(allStocks[2]?.Profit_Margin) || 0
    };

    var previousPrices = {
        stock1:  0 ,
        stock2:  0 ,
        stock3:  0 ,
    };
    const totalStockValue = data.datasets[0].data.reduce((acc, value) => acc + value, 0);
    document.getElementById('total-value').textContent = "$" + totalStockValue.toFixed(2);
    // Stock price updates: Compare current price to the previous day's price
    const stockPrices = [
        { elementId: 'stock1', currentPrice: currentPrices.stock1, previousPrice: previousPrices.stock1 },
        { elementId: 'stock2', currentPrice: currentPrices.stock2, previousPrice: previousPrices.stock2 },
        { elementId: 'stock3', currentPrice: currentPrices.stock3, previousPrice: previousPrices.stock3 }
    ];

    console.log(stockPrices)

    stockPrices.forEach(stock => {
        const stockElement = document.getElementById(stock.elementId);
        const priceChange = stock.currentPrice - stock.previousPrice;
        const priceColor = priceChange >= 0 ? 'green' : 'red'; // Green if up, red if down
        stockElement.textContent = `${stock.elementId.replace('stock', 'Stock ')}: $${stock.currentPrice.toFixed(2)}`;
        stockElement.style.color = priceColor; // Set color based on price change
    });
    // Calculate and display the total stock value
     // Format with dollar sign
    }
    // Stock prices (current and previous day prices)
    
}, [Loaded])

async function callFetch()
{
    const response = await axios.get("/getAllInvestments")
    console.log(response)
    setallStocks(response.data)
  
}

function goDashboard()
{
    setDashboardClicked(true)
   
}

function Logout()
{
    args.setSuccess('')
    args.setLoggedIN(false)
}

async function updateStocks()
{
    var totalCost = 0;
    console.log(allStocks)
    
    for (const singleStock of allStocks) {
      //  console.log(singleStock);
        const Tag = singleStock.Stock;
            const buy = +singleStock.Buy_Price
            console.log('buy: '+ buy)
            totalCost += buy
            console.log("total Cost: "+totalCost)
        try {
          
            const currentPrice = await args.getStockData(Tag);
            if(currentPrice == NaN){
                currentPrice = 0
                console.log("Current Price API EXPIRED SETTING VAL TO 0")
            }
            
            
            const Profit = currentPrice - +singleStock.Buy_Price;
    
         
        //    console.log("Current Price: " + currentPrice);
          //  console.log("Buy Price: " + singleStock.Buy_Price);
           // console.log("Profit Margin: " + Profit);
    
          
            const saveData = {
                MI_Uuid: singleStock.uuid,
                creator: args.username,
                Stock: Tag,
                Amount_Owned: singleStock.Amount_Owned,
                date: getDate(),
                Buy_Price: singleStock.Buy_Price,
                Current_Price: currentPrice,
                Profit_Margin: Profit,
                User_Balance: singleStock.User_Balance
            };
    
            // Send data to the server
            const response = await axios.post('/saveInvestment', saveData);
            console.log(response.data.message);
        } catch (error) {
            console.error(`Error processing stock ${Tag}:`, error);
        }
    }
    setTotalCost(totalCost)
    
  
   
}

return (
    <>
    { !DashboardClicked ? (
        <>
     <title>My Profile</title>

     <body>

<div class="sidebar">
    <div class="logo">
        Nancy.io
    </div>

  
    <div class="profile">
        <img src={userImage} alt="User Profile Picture"/>
        <div>Hello, {args.username}</div> 
    </div>

    <ul>
        <li onClick={() => goDashboard()}>Dashboard</li> 
        <li onClick={() => updateStocks()}>Refresh</li>
    </ul>

    <div class="logout-container">
        <ul>
            <li onClick={() => Logout()}>Log Out</li>
        </ul>
    </div>
</div>

{Loaded && (
<div class="content">
    <h1>My Profile</h1>

    <div class="my-portfolio-header">My Portfolio</div>

    <div class="pie-chart-container">
        <canvas id="pie-chart" height='360px !important' width= '360px !important'></canvas>
    </div>

    <div class="total-header">Total Investments</div>
    <div class="total-value" id="total-value">{TotalCost}</div>
</div>
)}

<div class="stock-prices">
    <div class="stock1" id="stock1">{(allStocks[0]?.Stock) || 'NA'}: {(allStocks[0]?.Buy_Price) || 0}</div> 
    <div class="stock2" id="stock2">{(allStocks[1]?.Stock) || 'NA'}: {(allStocks[1]?.Buy_Price)|| 0}</div> 
    <div class="stock3" id="stock3">{(allStocks[2]?.Stock) || 'NA'}: {(allStocks[2]?.Buy_Price)|| 0}</div>
</div>



<script>
 
    
</script>
</body>
    </>
    ):(
        <Dashboard username = {args.username}  getStockData = {args.getStockData} LoggedIn ={args.LoggedIn} setSuccess ={args.setSuccess}></Dashboard>
    )}
</>
)}



export default MyProfile