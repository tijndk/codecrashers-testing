"use strict";

// help functie om woorden te capitaliseren
export function capitalize(str) {
  if (!str || typeof str !== "string") return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Opdracht 5.4 - team opslaan
export function saveTeamToLocalStorage(myTeam) {
  localStorage.setItem("team", JSON.stringify(myTeam));
}

// Opdracht 5.4 - team laden
export function loadTeamFromLocalStorage() {
  const savedTeam = localStorage.getItem("team");
  if (savedTeam) {
    return JSON.parse(savedTeam);
  }
  return [];
}
