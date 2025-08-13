"use strict";

import { typeColors, statColors } from "../constants.js";
import {
  capitalize,
  saveTeamToLocalStorage,
  loadTeamFromLocalStorage,
} from "../utils.js";
import { t } from "../langSelect.js"; // Opdracht 8

// Opdracht 5.1
export const myTeam = [];

// Opdracht 5.1 - voeg pokemon toe aan team
export function addPokemonToTeam(pokeData, isShiny) {
  const speciesName = capitalize(pokeData.localized_name) || capitalize(pokeData.species.name);

  if (myTeam.length >= 6) {
    alert(t("team_full")); // Opdracht 8
    return;
  }

  // Opdracht 5.3 - nickname
  let nickname = prompt(t("nickname_prompt"), speciesName); // Opdracht 8

  // lengte controle voor de nickname
  while (nickname && nickname.length > 12) {nickname = prompt(t("nickname_too_long")); // Opdracht 8
  }

  const pokemon = {
    name: nickname ?? speciesName, // Opdracht 5.3 - nickname
    image: isShiny
      ? pokeData.sprites.front_shiny
      : pokeData.sprites.front_default,
    types: pokeData.types,
    stats: pokeData.stats,
  };

  myTeam.push(pokemon);
  // Opdracht 5.4 - team opslaan
  saveTeamToLocalStorage(myTeam);
  renderTeam();
}

// Opdracht 5.1 - laat het team zien op de pagina
export function renderTeam() {
  const teamStatsContainer = document.getElementById("team-stats-container");
  const teamContainer = document.getElementById("team-container");

  if (teamStatsContainer.style.display === "none") {
    teamStatsContainer.style.display = "flex";
  }

  teamContainer.innerHTML = "";

  myTeam.forEach((pokemon) => {
    const card = document.createElement("div");
    card.classList.add("team-card");
    card.style.border = `4px solid ${typeColors[pokemon.types[0].type.name]}`;

    // sprite voor in team
    const pokeTeamImage = document.createElement("img");
    pokeTeamImage.alt = pokemon.name;
    pokeTeamImage.src = pokemon.image;
    pokeTeamImage.width = 100;
    pokeTeamImage.height = 100;

    // Opdracht 5.2 - knop om pokemon te verwijderen uit team
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-pokemon");
    deleteBtn.textContent = "x";
    deleteBtn.addEventListener("click", () => {
      if (confirm(t("confirm_delete", { name: pokemon.name }))) {
        card.remove();
        myTeam.splice(myTeam.indexOf(pokemon), 1);
        // Opdracht 5.4 - team opslaan
        saveTeamToLocalStorage(myTeam);
        drawTotalStats(myTeam);
        renderAllTypes(myTeam);
      }
    });

    const name = document.createElement("p");
    name.classList.add("nickname");
    name.textContent = pokemon.isShiny ? `${pokemon.name} ✨` : pokemon.name;

    // Opdracht 5.3 - verander nickname
    name.addEventListener("click", () => {
      const input = document.createElement("input");
      input.type = "text";
      input.id = "nickname";
      input.maxLength = 12;
      input.value = pokemon.name;
      input.classList.add("nickname-input");

      card.replaceChild(input, name);
      input.focus();

      input.addEventListener("blur", () => {
        const newName = input.value.trim() || pokemon.name;
        pokemon.name = newName;
        name.textContent = newName;
        card.replaceChild(name, input);
        saveTeamToLocalStorage(myTeam);
      });
    });

    card.append(pokeTeamImage, deleteBtn, name);
    teamContainer.append(card);
  });

  drawTotalStats(myTeam);
  renderAllTypes(myTeam);
}

export function drawTotalStats(myTeam) {
  const canvas = document.getElementById("total-stats-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const barHeight = 20;
  const gap = 30;
  const maxStats = 255 * 6; // 1530
  const drawWidth = canvas.width;

  const totals = {
    hp: 0,
    attack: 0,
    defense: 0,
    "special-attack": 0,
    "special-defense": 0,
    speed: 0,
  };

  myTeam.forEach((p) => {
    if (!Array.isArray(p.stats)) return;
    p.stats.forEach((s) => {
      totals[s.stat.name] += s.base_stat;
    });
  });

  let y = 0;

  Object.entries(totals).forEach(([name, value]) => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      // lijntje achter tekst
      ctx.fillStyle = "#222"; // zwart lijntje
      ctx.fillRect(0, y + 8, 200, 3);

      ctx.fillStyle = "#d8d8d8"; // lichte tekst
    } else {
      // lijntje achter tekst
      ctx.fillStyle = "#dbdbdb";
      ctx.fillRect(0, y + 8, 200, 3);

      ctx.fillStyle = "#222"; // zwarte tekst
    }

    // de tekst
    ctx.textBaseline = "bottom";
    ctx.font = '14px "Pokemon BW"';
    ctx.fillText(`${t("total")} ${t(`stats.${name}`).toUpperCase()} (${value})`, 5, y + 18);

    // de balk
    const w = (value / maxStats) * drawWidth;
    ctx.fillStyle = statColors[name];
    ctx.fillRect(0, y + 22, w, barHeight);

    y += barHeight + gap;
  });
}

// Opdracht 6.2 - alle types
export function renderAllTypes(myTeam) {
  const container = document.getElementById("combined-types-container");
  container.innerHTML = "";

  const allTypes = new Set();
  myTeam.forEach((pokemon) => {
    (pokemon.types || []).forEach((typeObj) => {
      allTypes.add(typeObj.type.name);
    });
  });

  allTypes.forEach((type) => {
    const span = document.createElement("span");
    span.classList.add("type-label");
    span.textContent = t(`types.${type}`).toUpperCase();
    span.style.backgroundColor = typeColors[type];
    container.appendChild(span);
  });
}

const savedTeam = loadTeamFromLocalStorage();
myTeam.push(...savedTeam);
renderTeam();
