"use strict"; 
window.onload = main; 

function main () { 
    if (document.querySelector("#startPlanningButton")) {
        document.querySelector("#startPlanningButton").onclick = startPlanning; 
    }
    if (document.querySelector("#viewPlansButton")) {
        document.querySelector("#viewPlansButton").onclick = viewPlans;
    }
    if (document.querySelector(".homeButton")) {
        document.querySelector(".homeButton").onclick = renderHome;  
    }
}

function startPlanning() { 
    window.location.href = "/inputPage";
}

function viewPlans() { 
    window.location.href = "/lookupPage";
}

function renderHome() { 
    window.location.href = "/"; 
}