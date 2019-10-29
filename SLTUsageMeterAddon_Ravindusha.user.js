// ==UserScript==
// @name         SLT Usage Meter
// @namespace    http://tampermonkey.net/
// @version      2.3
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
    var peakElement = document.querySelector("#root > div > div > div:nth-child(3) > div > div > div > div:nth-child(3) > div.col-md-8 > div > div:nth-child(1) > div > div > div > div:nth-child(1) > div > div > div:nth-child(4) > h6");
    var peakData = peakElement.innerText;
    //get total data usage
    var totalDataElement = document.querySelector("#root > div > div > div:nth-child(3) > div > div > div > div:nth-child(3) > div.col-md-8 > div > div:nth-child(1) > div > div > div > div:nth-child(2) > div > div > div:nth-child(4) > h6");
    var totalData = totalDataElement.innerText;

    var peakDataArray = peakData.match(pattern);
    var totalDataArray = totalData.match(pattern);

    //calculate off-peak data
    var offpeakUsed = (parseFloat(totalDataArray[0])-parseFloat(peakDataArray[0])).toFixed(1);
    var offpeakTotal = (parseFloat(totalDataArray[1])-parseFloat(peakDataArray[1])).toFixed(1);
    var offpeakRemaining = (offpeakTotal-offpeakUsed).toFixed(1);
    var reaminingTotal = (parseFloat(totalDataArray[1])-parseFloat(totalDataArray[0])).toFixed(1);
    var peakRemaining = (parseFloat(peakDataArray[1])-parseFloat(peakDataArray[0])).toFixed(1);
    //calculate off-peak remaining percentage
    var offpeakRemainingPercentage = ((offpeakRemaining/offpeakTotal)*100).toFixed(0);

    //new element to display remaining peak data
    var peakRemainingElement = document.createElement('h6');
    peakRemainingElement.setAttribute("style","font-family: 'Open Sans';font-size: 0.916667rem;color: rgba(95, 99, 104, 1);margin: 0px;");
    peakRemainingElement.innerText = peakRemaining+"GB Remaining";
    peakElement.parentNode.insertBefore(peakRemainingElement, peakElement.nextSibling);
    //new element to display remaining total data
    var totalRemainingElement = document.createElement('h6');
    totalRemainingElement.setAttribute("style","font-family: 'Open Sans';font-size: 0.916667rem;color: rgba(95, 99, 104, 1);margin: 0px;");
    totalRemainingElement.innerText = reaminingTotal+"GB Remaining";
    totalDataElement.parentNode.insertBefore(totalRemainingElement, totalDataElement.nextSibling);
    //new element to display remaining offpeak data
    var offPeakRemainingElement = document.createElement('h6');
    offPeakRemainingElement.setAttribute("style","font-family: 'Open Sans';font-size: 0.916667rem;color: rgba(95, 99, 104, 1);margin: 0px;");
    offPeakRemainingElement.innerText = offpeakRemaining+"GB Remaining";

    //get parent element to add new data
    var parent = document.querySelector("#root > div > div > div:nth-child(3) > div > div > div > div:nth-child(3) > div.col-md-8 > div > div:nth-child(1) > div > div");

    //create new container to display off peak data
    var container = document.createElement('div');
    container.setAttribute("style","margin-top:1rem; margin-bottom:1rem; display: flex; align-items:center; flex-direction: column;");

    var title = document.createElement('h6');
    title.innerText = 'Off-Peak';
    title.setAttribute("style","font-family: 'Open Sans'; font-size: 0.916667rem; color: rgba(74, 74, 74, 0.74); margin: 0px; margin-bottom:0.5rem;");

    var remainingValueElement = document.createElement('span');
    remainingValueElement.innerText = offpeakRemainingPercentage+" %";
    remainingValueElement.setAttribute("style",`font: 700 1.5rem 'Open Sans'; color:${offpeakRemaining<10 ?'rgb(254, 33, 33);': offpeakRemaining<30 ?'rgb(255, 191, 0)':'rgb(37, 151, 216)'};`);

    var remainingTextElement = document.createElement('span');
    remainingTextElement.innerText = "Remaining";
    remainingTextElement.setAttribute("style",`font: 700 1rem 'Open Sans'; color:${offpeakRemaining<10 ?'rgb(254, 33, 33);' :offpeakRemaining<30 ?'rgb(255, 191, 0)':'rgb(37, 151, 216)'};`);

    var remainingTextHolder = document.createElement('div');
    remainingTextHolder.setAttribute("style","display: flex; align-items:center; flex-direction: column; margin-top: 9%; position: absolute;");

    remainingTextHolder.appendChild(remainingValueElement);
    remainingTextHolder.appendChild(remainingTextElement);

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
        backgroundColor:[offpeakRemaining<10 ?'rgb(254, 33, 33)' :offpeakRemaining<30 ?'rgb(255, 191, 0)' :'rgb(37, 151, 216)',offpeakRemaining<10 ?'rgba(254, 33, 33, 0.2)' :offpeakRemaining<30 ? 'rgba(255, 191, 0, 0.2)':'rgba(20, 128, 225, 0.2)']
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
    container.appendChild(offPeakRemainingElement);

    //calculate average data remaining per a day
    var now = new Date();
    var daysOfMonth = new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
    var today = now.getDate();
    var average_offPeak = offpeakRemaining/(daysOfMonth-today+1);
    var average_peak = peakRemaining/(daysOfMonth-today+1);
    var avg_offPeak_remaining = average_offPeak.toFixed(3) + " GB/day";
    var avg_peak_remaining = average_peak.toFixed(3) + " GB/day";

    var averageDataContainer = document.createElement('div');
    averageDataContainer.setAttribute("style","display: flex; flex-direction: row; width:100%; margin-top:0.5rem; font-family: 'Open Sans'; font-size: 0.916667rem;  color: rgba(95, 99, 104, 0.8); font-weight:700; white-space:nowrap;");

    var averagePeakDataContainer = document.createElement('div');
    averagePeakDataContainer.setAttribute("style","display: flex; flex-direction: column; flex:1;align-items: center; border:solid 1px grey; border-radius:10px; margin:5px; padding:0.2rem;");

    var averagePeakDataTitle = document.createElement('span');
    //averagePeakDataTitle.setAttribute("style","white-space:nowrap;");
    averagePeakDataTitle.innerText = "Remaining Peak Data";
    var averagePeakDataValue = document.createElement('span');
    averagePeakDataValue.innerText = avg_peak_remaining;

    averagePeakDataContainer.appendChild(averagePeakDataTitle);
    averagePeakDataContainer.appendChild(averagePeakDataValue);

    var averageOffPeakDataContainer = document.createElement('div');
    averageOffPeakDataContainer.setAttribute("style","display: flex; flex-direction: column; flex:1;align-items: center;  border:solid 1px grey; border-radius:10px; margin:5px; padding:0.2rem;");

    var averageOffPeakDataTitle = document.createElement('span');
    //averageOffPeakDataTitle.setAttribute("style","white-space:nowrap;");
    averageOffPeakDataTitle.innerText = "Remaining Off-Peak Data";
    var averageOffPeakDataValue = document.createElement('span');
    averageOffPeakDataValue.innerText = avg_offPeak_remaining;

    averageOffPeakDataContainer.appendChild(averageOffPeakDataTitle);
    averageOffPeakDataContainer.appendChild(averageOffPeakDataValue);

    averageDataContainer.appendChild(averagePeakDataContainer);
    averageDataContainer.appendChild(averageOffPeakDataContainer);

    container.appendChild(averageDataContainer);

    //add new child element to the parent
    parent.appendChild(container);
    }
