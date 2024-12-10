import "./App.css"
import axios from "axios";
import {React, useEffect, useState} from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import InvestModal from "./components/InvestModal";
import { Chart, LinearScale, CategoryScale, LineElement, PointElement, Title, Tooltip, Legend, LineController } from "chart.js";
import Login from "./Login";
import MyProfilePage from "./MyProfile"
import userImage from "./assets/userprofile.webp"
// Register the required components
Chart.register(LinearScale, CategoryScale, LineElement, PointElement, Title, Tooltip, Legend, LineController);

// core components


const Dashboard = (args) =>{

    const [NewsLoaded, setNewsLoaded] = useState(false)

    const [NewsTitle1, setNewsTitle1] = useState(null)
    const [NewsDesc1, setNewsDesc1] = useState(null)
    const [imageURL1, setImageURL1] = useState(null)
    const [link1, setlink1] = useState(null)

    const [NewsTitle2, setNewsTitle2] = useState(null)
    const [NewsDec2, setNewsDesc2] = useState(null)
    const [imageURL2, setImageURL2] = useState(null)
    const [link2, setlink2] = useState(null)

    const [LoggedOut, setLogout] = useState(false)
    const [MyProfile, setMyProfile] = useState(false)
    console.log("Logged in: "+args.LoggedIn)

    useEffect(() => {
        if((NewsTitle1, NewsDesc1, imageURL1, NewsTitle2, NewsDec2, imageURL2, link1, link2) != null)
        {
            setNewsLoaded(true)
        }
    }, [NewsTitle1, NewsDesc1, imageURL1, NewsTitle2, NewsDec2, imageURL2, NewsLoaded])


    useEffect(() => {
        fetchNews()
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

    async function fetchNews()
    {
        
        const response1 = await axios.post('/fetchNEWS', {"index": 0});
        const response2 = await axios.post('/fetchNEWS', {"index": 1});
        
        setNewsTitle1(response1.data[0])
        setNewsDesc1(response1.data[1])
        setImageURL1(response1.data[2])
        setlink1(response1.data[3])

        setNewsTitle2(response2.data[0])
        setNewsDesc2(response2.data[1])
        setImageURL2(response2.data[2])
        setlink2(response2.data[3])
    
    }
    async function getAllInvestments(){
        const invest = await axios.get("/getAllInvestments")
        console.log(invest)
    }

    function Logout()
    {
        args.setSuccess('')
        args.setLoggedIN(false)
    }


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
         {args.LoggedIn ? (
            <>
       
      
            {!MyProfile ? (
                <>
        <head>
             <title>Finance Dashboard</title>
        </head>
        <body>

    <div class="sidebar">
        <div class="logo">
        Nancy.io
        </div>

    <div class="profile">
        <img src={userImage} alt="User Profile Picture"></img>
        <div>Hello, {args.username}!</div> 
    </div>

    <ul>
        <li onClick={() => setMyProfile(true)}>My Investments</li>
        <li onClick={() => alert("This becomes a real button when you pay me !!!!")}>Fake Button</li>
    </ul>

    <div class="logout-container">
        <ul>
            <li onClick={() => Logout()}>Log Out</li>
        </ul>
    </div>
</div>

<div class="content">
    <h1>Dashboard</h1> 

    <h2 class="news-header">News</h2>

    {NewsLoaded ? ( 
       
    <div className="news-cards-container">
         <a href = {link1}> 
    <div className="news-card" >
        <img src={imageURL1} width= '140px' height= '141px' alt="News Thumbnail" />
        <div className="news-content">
            <h3 className="news-title" style={{fontSize:'large', paddingLeft:'2%'}}>{NewsTitle1}</h3>
            <p className="news-description" style={{color:'black', fontSize:'smaller', paddingLeft:'2%'}}>
                {NewsDesc1}
            </p>
        </div>
    </div>
    </a>


    <a href={link2}>
    <div className="news-card" >
        <img src={imageURL2}  width= '140px' height= '141px' alt="News Thumbnail" />
        <div className="news-content">
            <h3 className="news-title" style={{fontSize:'large', paddingLeft:'2%'}} >{NewsTitle2}</h3>
            <p className="news-description" style={{color:'black', fontSize:'smaller', paddingLeft:'2%'}}>
                {NewsDec2}
                </p>
        </div>
        
    </div>
    </a>
    
    

</div>
    ):(
        <p style={{fontSize:'xx-large', color:'black'}}>Loading ...</p>
)}

<h2 class="invest-header" style={{marginTop:'2%'}}>Invest</h2>
<InvestModal username = {args.username}  getStockData ={args.getStockData}/>


</div>
<div class="graphs-container">
    <div class="graph-header">VOO</div>
    <canvas id="line-chart-1" style={{marginBottom:'25%'}}></canvas>
    <div class="graph-header">TSLA</div>
    <canvas id="line-chart-2" style={{marginBottom:'25%'}}></canvas>
    <div class="graph-header">CryptoZoo</div>
    <canvas id="line-chart-3"></canvas>
</div>



</body>
</>
): (
  <MyProfilePage username = {args.username} getStockData = {args.getStockData} setSuccess ={args.setSuccess} setLoggedIN ={args.setLoggedIN} LoggedIn ={args.LoggedIn} ></MyProfilePage>
)}
</>
    ): (
        <Login></Login>
    )}
     </>



)}
export default Dashboard