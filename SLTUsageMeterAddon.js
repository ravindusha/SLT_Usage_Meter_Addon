// ==UserScript==
// @name         SLT Usage Meter
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Calculate off peak data
// @author       RavinduSha
// @match        https://internetvas.slt.lk/dashboard
// @include      http://internetvas.slt.lk/dashboard
// @include      https://www.internetvas.slt.lk/dashboard
// @include      http://www.internetvas.slt.lk/dashboard
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.bundle.min.js
// ==/UserScript==

(function() {
    'use strict';
    let calculate = false;
    setInterval(function(){
        if(!calculate){
            calculate = startCalculation(calculate);
        }
    },3000);
})();

function startCalculation(calculate){
    var peakData = document.querySelector("#root > div > div > div:nth-child(3) > div > div > div > div:nth-child(3) > div.col-md-8 > div > div:nth-child(1) > div > div > div > div:nth-child(1) > div > div > div:nth-child(4) > h6").innerText;
    if(!calculate){
        if(peakData){
            getData();
            return true;
        }
    }
}

function getData(){
    var pattern = /(\d+\.\d+GB)/g;
    //get peak-time data usage
    var peakData = document.querySelector("#root > div > div > div:nth-child(3) > div > div > div > div:nth-child(3) > div.col-md-8 > div > div:nth-child(1) > div > div > div > div:nth-child(1) > div > div > div:nth-child(4) > h6").innerText;
    //get total data usage
    var totalData = document.querySelector("#root > div > div > div:nth-child(3) > div > div > div > div:nth-child(3) > div.col-md-8 > div > div:nth-child(1) > div > div > div > div:nth-child(2) > div > div > div:nth-child(4) > h6").innerText;

    var peakDataArray = peakData.match(pattern);
    var totalDataArray = totalData.match(pattern);

    //calculate off-peak data
    var offpeakUsed = (parseFloat(totalDataArray[0])-parseFloat(peakDataArray[0])).toFixed(1);
    var offpeakTotal = (parseFloat(totalDataArray[1])-parseFloat(peakDataArray[1])).toFixed(1);
    var offpeakRemaining = (offpeakTotal-offpeakUsed).toFixed(1);
    //calculate off-peak remaining percentage
    var offpeakRemainingPercentage = ((offpeakRemaining/offpeakTotal)*100).toFixed(0);

    //get parent element to add new data
    var parent = document.querySelector("#root > div > div > div:nth-child(3) > div > div > div > div:nth-child(3) > div.col-md-8 > div > div:nth-child(1) > div > div");

    //create and append new element inside peak/total/offpeak to display remaining usage
    var peakPercentageLabel = document.querySelector("div.col-lg-6:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > svg:nth-child(1) > text");
    var peakPercentageText = document.querySelector("div.col-lg-6:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > p");
    var totalPercentageLabel = document.querySelector("div.col-lg-6:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > svg:nth-child(1) > text");
    var totalPercentageText = document.querySelector("div.col-lg-6:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > p");
    peakPercentageLabel.setAttribute("y","40%");
    peakPercentageText.style.top = "-110px";
    totalPercentageLabel.setAttribute("y","40%");
    totalPercentageText.style.top = "-110px";

    var selPeakContainer = document.querySelector("div.col-lg-6:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3)");
    var selPeakDataValue = document.createElement('p');
    selPeakDataValue.innerText = (parseFloat(peakDataArray[1])-parseFloat(peakDataArray[0])).toFixed(1) + "GB";
    selPeakDataValue.setAttribute("style","font: 700 1rem 'Open Sans'; color:rgb(153, 154, 155); margin-top:3px; position: absolute; top: 50%; left: 34%;");
    selPeakContainer.appendChild(selPeakDataValue);

    var selTotalContainer = document.querySelector("div.col-lg-6:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3)");
    var selTotalDataValue = document.createElement('p');
    selTotalDataValue.innerText = (parseFloat(totalDataArray[1])-parseFloat(totalDataArray[0])).toFixed(1) + "GB";
    selTotalDataValue.setAttribute("style","font: 700 1rem 'Open Sans'; color:rgb(153, 154, 155); margin-top:3px; position: absolute; top: 50%; left: 34%;");
    selTotalContainer.appendChild(selTotalDataValue);

    //create new container to display off peak data
    var container = document.createElement('div');
    container.setAttribute("style","margin-top:1rem; margin-bottom:1rem; display: flex; align-items:center; flex-direction: column;");

    var title = document.createElement('h6');
    title.innerText = 'Off-Peak';
    title.setAttribute("style","font-family: 'Open Sans'; font-size: 0.916667rem; color: rgba(74, 74, 74, 0.74); margin: 0px; margin-bottom:0.5rem;");

    var remainingValueElement = document.createElement('span');
    remainingValueElement.innerText = offpeakRemainingPercentage+" %";
    remainingValueElement.setAttribute("style","font: 700 1.5rem 'Open Sans'; color:rgb(37, 151, 216);");

    var remainingTextElement = document.createElement('span');
    remainingTextElement.innerText = "Remaining";
    remainingTextElement.setAttribute("style","font: 700 1rem 'Open Sans'; color:rgb(37, 151, 216);");

    var remainingTextValue = document.createElement('p');
    remainingTextValue.innerText = offpeakRemaining + "GB";
    remainingTextValue.setAttribute("style","font: 700 1rem 'Open Sans'; color:rgb(153, 154, 155); margin-top:3px;");

    var remainingTextHolder = document.createElement('div');
    remainingTextHolder.setAttribute("style","display: flex; align-items:center; flex-direction: column; margin-top: 7.5%; position: absolute;");

    remainingTextHolder.appendChild(remainingValueElement);
    remainingTextHolder.appendChild(remainingTextElement);
    remainingTextHolder.appendChild(remainingTextValue);

    var usageTextElement = document.createElement('h6');
    usageTextElement.innerText = offpeakUsed + "GB Used of " + offpeakTotal + "GB";
    usageTextElement.setAttribute("style","font-family: 'Open Sans'; font-size: 0.916667rem;  color: rgba(95, 99, 104, 0.4); margin: 0px; margin-top:0.5rem;");

    container.appendChild(title);

    var chartHolder = document.createElement('div');
    chartHolder.setAttribute("style","width: 28vw; height: fit-content; display: flex; align-items: center; flex-direction: column;");

    var chart = document.createElement('canvas');
    chart.setAttribute("id","remainingChart");
    chart.setAttribute("style","width:inherit; height:inherit");

    var data = {
    datasets: [{
        data: [offpeakRemaining, offpeakUsed],
        backgroundColor:['rgb(37, 151, 216)','rgba(20, 128, 225, 0.2)']
    }],

    // These labels appear in the legend and in the tooltips when hovering different arcs
    labels: [
        'Remaining',
        'Used'
    ]
};

    var myDoughnutChart = new Chart(chart, {
    type: 'doughnut',
    data: data,
    options: {
    cutoutPercentage:76,
    legend:{
        display:false
      }
    }
});

    chartHolder.appendChild(remainingTextHolder);
    chartHolder.appendChild(chart);
    container.appendChild(chartHolder);
    container.appendChild(usageTextElement);

    //add new child element to the parent
    parent.appendChild(container);
    }
