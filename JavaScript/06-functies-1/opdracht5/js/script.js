"use strict";

// Opdracht 5.3
function clockTime() {
    const nu = new Date();
    const hours = nu.getHours().toString().padStart(2, '0');
    const minutes = nu.getMinutes().toString().padStart(2, '0');
    const seconds = nu.getSeconds().toString().padStart(2, '0');
    const time = `${hours}:${minutes}:${seconds}`

    document.getElementById("p1").innerHTML = time;
}

const elTime = document.getElementById("clock");
elTime.addEventListener("click", clockTime)


// Opdracht 5.4
function diceRoll() {
    const diceNumber = Math.floor(Math.random() * 20) + 1;
    document.getElementById("p1").innerHTML = diceNumber;
}

const elDice = document.getElementById("d20");
elDice.addEventListener("click", diceRoll);


// Opdracht 5.5
function movieNames() {
    const movies = ["John Wick", "Scream", "Kingsman: The Secret Service", "Deadpool", "Free Guy"];
    document.getElementById("p1").innerHTML = movies.join(" - ");
}

const elMovies = document.getElementById("movies");
elMovies.addEventListener("click", movieNames);


// Opdracht 5.6
function whoYou() {
    const name = prompt("Wat is je naam?");
    document.getElementById("p1").innerHTML = name;
}

const elWho = document.getElementById("whoYou");
elWho.addEventListener("click", whoYou);