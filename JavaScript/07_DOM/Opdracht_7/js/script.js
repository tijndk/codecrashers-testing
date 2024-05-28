"use strict";

// Opdracht 7.1
const body = document.querySelector("body");
const content = document.querySelector("div");
const elementKeuze = document.querySelector("select#elementen");

function maakElement() {
    // maakt h1 wanneer die optie is geselecteerd
    if (elementKeuze.options[0].selected == true) {
        const h1 = document.createElement("h1");
        h1.innerText = document.getElementById("tekstInput").value;
        content.appendChild(h1);
    } 
    // maakt h2 wanneer die optie is geselecteerd
    else if (elementKeuze.options[1].selected == true) {
        const h2 = document.createElement("h2");
        h2.innerText = document.getElementById("tekstInput").value;
        content.appendChild(h2);
    } 
    // maakt h3 wanneer die optie is geselecteerd
    else if (elementKeuze.options[2].selected == true) {
        const h3 = document.createElement("h3");
        h3.innerText = document.getElementById("tekstInput").value;
        content.appendChild(h3);
    } 
    // maakt p wanneer die optie is geselecteerd
    else if (elementKeuze.options[3].selected == true) {
        const p = document.createElement("p");
        p.innerText = document.getElementById("tekstInput").value;
        content.appendChild(p);
    } 
    // maakt blockquote wanneer die optie is geselecteerd
    else if (elementKeuze.options[4].selected == true) {
        const blockquote = document.createElement("blockquote");
        blockquote.innerText = document.getElementById("tekstInput").value;
        content.appendChild(blockquote);
    };
}

document.querySelector("button").addEventListener("click", function(e) {
    e.preventDefault();
    maakElement();
})


// Opdracht 7.2
// hiermee kun je het lettertype veranderen
const lettertypeKeuze = document.querySelector("select#lettertype");

lettertypeKeuze.addEventListener("change", function() {
    if (lettertypeKeuze.options[0].selected == true) {
        body.style.fontFamily = "'Times New Roman', Times, serif";
    } else if (lettertypeKeuze.options[1].selected == true) {
        body.style.fontFamily = "Arial, Helvetica, sans-serif";
    } else if (lettertypeKeuze.options[2].selected == true) {
        body.style.fontFamily = "'Comic Sans MS', cursive, sans-serif";
    } else if (lettertypeKeuze.options[3].selected == true) {
        body.style.fontFamily = "'Courier New', Courier, monospace";
    }
});


// hiermee kun je de achtergrondkleur veranderen
const achtergrondkleurKeuze = document.querySelector("input#achtergrondkleur");

achtergrondkleurKeuze.addEventListener("change", function() {
    body.style.backgroundColor = achtergrondkleurKeuze.value;
});

// hiermee kun je de tekstkleur veranderen
const tekstkleurKeuze = document.querySelector("input#tekstkleur");

tekstkleurKeuze.addEventListener("change", function() {
    body.style.color = tekstkleurKeuze.value;
});

// hiermee kun je de tekstgrootte aanpassen
const tekstgrootteKeuze = document.querySelector("input#tekstgrootte");
tekstgrootteKeuze.addEventListener("change", function() {
    body.style.fontSize = tekstgrootteKeuze.value;
})


// Opdracht 7.3
