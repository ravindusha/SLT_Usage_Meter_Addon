// ==UserScript==
// @name         SLT Usage Meter
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Calculate off peak data
// @author       RavinduSha
// @match        https://www.internetvas.slt.lk/SLTVasPortal-war/application/home.nable
// @include      https://internetvas.slt.lk/SLTVasPortal-war/application/home.nable
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var totalText = document.querySelector("div:nth-child(2) > div.col-md-7 > div:nth-child(1) > div > div.row > div:nth-child(2) > h5 > strong").innerHTML;
    var total = parseFloat(totalText);

    var peakText = document.querySelector("div:nth-child(2) > div.col-md-7 > div:nth-child(2) > div > div.row > div:nth-child(2) > h5 > strong").innerHTML;
    var peak = parseFloat(peakText);

    var offpeak = Math.round((total-peak)*10)/10;

    ////////////////////////////////////

    var totalUsedText = document.querySelector("div:nth-child(2) > div.col-md-7 > div:nth-child(1) > div > div.row > div:nth-child(3) > h5 > strong").innerHTML;
    var totalUsed = parseFloat(totalUsedText);

    var peakUsedText = document.querySelector("div:nth-child(2) > div.col-md-7 > div:nth-child(2) > div > div.row > div:nth-child(3) > h5 > strong").innerHTML;
    var peakUsed = parseFloat(peakUsedText);

    var offpeakUsed = Math.round((totalUsed-peakUsed)*10)/10;

    ///////////////////////////////////

    var totalVolume = document.querySelector("div:nth-child(2) > div.col-md-7 > div:nth-child(1) > div > div.row > div:nth-child(1) > h5 > strong").innerHTML;
    var totalVol = parseFloat(totalVolume);

    var peakVolume = document.querySelector("div:nth-child(2) > div.col-md-7 > div:nth-child(2) > div > div.row > div:nth-child(1) > h5 > strong").innerHTML;
    var peakVol = parseFloat(peakVolume);

    var offpeakVol = Math.round((totalVol-peakVol)*10)/10;

    ////////////////////////////////////////////

    var element = document.querySelector("div.col-md-12 > div:nth-child(2) > div.col-md-7 > div:nth-child(2)");

    var outerRow = document.createElement("div");
    outerRow.className = "row";
    outerRow.setAttribute("style","margin-top: 40px");

    var outerDiv = document.createElement("div");
    outerDiv.className = "col-md-12";

    var divTitle = document.createElement("h4");
    divTitle.innerHTML = "Off-Peak Volume";

    //Progress-bar////////////////////////////////////
    var progress = document.createElement('div');
    progress.className = "progress";

    var progressBar = document.createElement('div');
    progressBar.className = "progress-bar";

    var percentage = Math.round((offpeak/offpeakVol)*100);
    progressBar.innerHTML = percentage+"%";

    progressBar.setAttribute("role","progressbar");
    progressBar.setAttribute("aria-valuenow","50");
    progressBar.setAttribute("aria-valuemin","0");
    progressBar.setAttribute("aria-valuemax","100");
    progressBar.setAttribute("style","width: "+percentage+"%;  background-color: #0D0548  ");

    //Monthly-Limit////////////////////////////////
    var newElement = document.createElement('div');
    newElement.className = "row";

    var colmd4_3 = document.createElement("div");
    colmd4_3.className = "col-md-4";

    var h5_3 = document.createElement("h5");
    h5_3.className = "progress-label";

    var small_3 = document.createElement("small");
    small_3.innerHTML = "Monthly limit";
    var strong_3 = document.createElement("strong");
    strong_3.setAttribute("style","margin-top: 5px");
    strong_3.innerHTML = offpeakVol+" GB";

    //Remaining-data///////////////////////////////
    var colmd4 = document.createElement("div");
    colmd4.className = "col-md-4";
    colmd4.setAttribute("style","text-align: center;");

    var h5 = document.createElement("h5");
    h5.className = "progress-label";

    var small = document.createElement("small");
    small.innerHTML = "Remaining";
    var strong = document.createElement("strong");
    strong.innerHTML = offpeak+" GB";
    ///////////////////////////////////////////////////////////


    //Used data///////////////////////////////////////////////

    var colmd4_2 = document.createElement("div");
    colmd4_2.className = "col-md-4";
    colmd4_2.setAttribute("style","text-align: right;");

    var h5_2 = document.createElement("h5");
    h5_2.className = "progress-label";

    var small_2 = document.createElement("small");
    small_2.innerHTML = "Used";
    var strong_2 = document.createElement("strong");
    strong_2.innerHTML = offpeakUsed+" GB";
    /////////////////////////////////////////////////////////


    var now = new Date();
    var daysOfMonth = new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
    var today = now.getDate();
    var average_offPeak = offpeak/(daysOfMonth-today+1);
    var average_peak = peak/(daysOfMonth-today+1);
    var avg_offPeak_remaining = average_offPeak.toFixed(3) + " GB/day";
    var avg_peak_remaining = average_peak.toFixed(3) + " GB/day";

    //////////////////////////////////////////////////////////

    var average_area = document.createElement("div");
    average_area.className = "col-md-12 bg-success";
    average_area.setAttribute("style","background-color: #17a2b8; padding:10px;");

    var average_peak_area = document.createElement("div");
    average_peak_area.className = "col-md-6";

    var average_peak_area_h5 = document.createElement("h5");
    average_peak_area_h5.className = "progress-label";

    var avg_peak_title = document.createElement("small");
    avg_peak_title.innerHTML = "Average Peak Data Remaining";
    avg_peak_title.setAttribute("style","color: white;");
    var avg_peak = document.createElement("strong");
    avg_peak.innerHTML = avg_peak_remaining;
    avg_peak.setAttribute("style","color: white;");

    average_peak_area_h5.appendChild(avg_peak_title);
    average_peak_area_h5.innerHTML +="<br>";
    average_peak_area_h5.appendChild(avg_peak);
    average_peak_area.appendChild(average_peak_area_h5);


    var average_offpeak_area = document.createElement("div");
    average_offpeak_area.className = "col-md-6";

    var average_offpeak_area_h5 = document.createElement("h5");
    average_offpeak_area_h5.className = "progress-label";
    average_offpeak_area_h5.setAttribute("style","text-align: right;");

    var avg_offpeak_title = document.createElement("small");
    avg_offpeak_title.innerHTML = "Average Off-Peak Data Remaining";
    avg_offpeak_title.setAttribute("style","color: white;");
    var avg_offPeak = document.createElement("strong");
    avg_offPeak.innerHTML = avg_offPeak_remaining;
    avg_offPeak.setAttribute("style","color: white;");

    average_offpeak_area_h5.appendChild(avg_offpeak_title);
    average_offpeak_area_h5.innerHTML +="<br>";
    average_offpeak_area_h5.appendChild(avg_offPeak);
    average_offpeak_area.appendChild(average_offpeak_area_h5);


    average_area.appendChild(average_peak_area);
    average_area.appendChild(average_offpeak_area);

    //////////////////////////////////////////////////////////

    h5_3.appendChild(small_3);
    h5_3.innerHTML += "<br>";
    h5_3.appendChild(strong_3);
    colmd4_3.appendChild(h5_3);
    newElement.appendChild(colmd4_3);

    h5.appendChild(small);
    h5.innerHTML += "<br>";
    h5.appendChild(strong);
    colmd4.appendChild(h5);
    newElement.appendChild(colmd4);

    h5_2.appendChild(small_2);
    h5_2.innerHTML += "<br>";
    h5_2.appendChild(strong_2);
    colmd4_2.appendChild(h5_2);
    newElement.appendChild(colmd4_2);

    progress.appendChild(progressBar);

    outerDiv.appendChild(divTitle);
    outerDiv.appendChild(progress);
    outerDiv.appendChild(newElement);
    var blankArea = document.createElement("h4");
    outerDiv.appendChild(blankArea);
    outerDiv.appendChild(average_area);
    outerRow.appendChild(outerDiv);

    var elementParent = element.parentNode;
    elementParent.insertBefore(outerRow, element.nextSibling);



})();
