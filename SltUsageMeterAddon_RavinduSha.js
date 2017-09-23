// ==UserScript==
// @name         SLT Usage Meter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Calculate off peak data
// @author       RavinduSha
// @match        https://www.internetvas.slt.lk/SLTVasPortal-war/application/home.nable
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
    divTitle.innerHTML = "Off-Peak Download Volume";

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
    strong_3.innerHTML = offpeakVol+" GB";

    //Remaining-data///////////////////////////////
    var colmd4 = document.createElement("div");
    colmd4.className = "col-md-4";

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

    var h5_2 = document.createElement("h5");
    h5_2.className = "progress-label";

    var small_2 = document.createElement("small");
    small_2.innerHTML = "Used";
    var strong_2 = document.createElement("strong");
    strong_2.innerHTML = offpeakUsed+" GB";
    /////////////////////////////////////////////////////////

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
    outerRow.appendChild(outerDiv);

    var elementParent = element.parentNode;
    elementParent.insertBefore(outerRow, element.nextSibling);



})();
