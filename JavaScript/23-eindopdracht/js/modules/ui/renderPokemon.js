"use strict";

import { typeColors, statColors, generationMap } from "../constants.js";
import { capitalize } from "../utils.js";
import { addPokemonToTeam } from "./team.js";
import { fetchEvolution } from "./evolution.js";

// functie om elementen aan te maken en de pokemon index te renderen/laten zien op de pagina aan de linker kant
export function renderPokemonIndex(pokeData) {
  // de elementen
  const allPokemonContainer = document.getElementById("number-index");
  const pokeContainer = document.createElement("div");
  pokeContainer.classList.add("pokemon");

  const pokeImage = document.createElement("img");
  pokeImage.src = pokeData.sprites.front_default;
  pokeImage.alt = pokeData.name;
  pokeImage.width = 100;
  pokeImage.height = 100;
  pokeContainer.append(pokeImage);

  // voeg een sterretje toe rechts in de index als de pokemon legendary of mythical is
  if (pokeData.isLegendary || pokeData.isMythical) {
    pokeContainer.classList.add("rare");
    const rare = document.createElement("p");
    rare.textContent = "⭐";
    pokeContainer.append(rare);
  }
  const pokeNumber = document.createElement("p");
  pokeNumber.textContent = `#${pokeData.id}`;
  pokeContainer.append(pokeNumber);

  // Opdracht 2.2 - event listener om pokemon informatie te tonen
  pokeContainer.addEventListener("click", () => {
    showInfo(pokeData);
  });

  allPokemonContainer.appendChild(pokeContainer);
}

// Opdracht 2.2 - functie om pokemon informatie te tonen aan de rechterkant
export function showInfo(pokeData) {
  const pokeInfo = document.getElementById("poke-info-container");
  // Opdracht 4.1 - shiny kans is 1 op 10
  const isShiny = Math.random() < 1 / 10;
  pokeInfo.innerHTML = ""; // leegmaken zodat er niet meerdere pokemon getoond worden

  // elementen in de info
  // maak de achtergrond kleur dezelfde kleur als main type
  document.getElementById("pokedex-container").style.backgroundColor =
    typeColors[pokeData.types[0].type.name];

  // div om te stijlen
  const infoTop = document.createElement("div");
  infoTop.id = "info-top";

  // pokemon naam
  const h2 = document.createElement("h2");
  const pokeName = document.createElement("span");
  pokeName.id = "pokemon-name";

  // Opdracht 2.3 - sterretje toevoegen als de pokemon legendary of mythical is
  pokeName.textContent = `${pokeData.isLegendary || pokeData.isMythical ? "⭐" : ""} ${capitalize(pokeData.species.name)} ${isShiny ? "✨" : ""}`;

  // Opdracht 7.1 - generatie en regio van pokemon
  const genKey = pokeData.generation;
  const region = generationMap.get(genKey) || "Unknown Region";
  const genNumber = genKey.split("-")[1].toUpperCase();

  const genInfo = document.createElement("span");
  genInfo.id = "gen-and-region";
  genInfo.textContent = `Gen ${genNumber} - ${region}`;
  h2.append(pokeName, genInfo);

  // sprite van pokemon
  const bigPokeImage = document.createElement("img");
  // opdracht 4.1 - 1 in 10 kans dat de pokemon shiny is
  bigPokeImage.src = isShiny
    ? pokeData.sprites.front_shiny
    : pokeData.sprites.front_default;
  bigPokeImage.alt = pokeData.name;
  bigPokeImage.width = 200;
  bigPokeImage.height = 200;

  // Opdracht 4.2
  if (isShiny) {
    setTimeout(() => {
      console.log("A shiny Pokémon has appeared!");
    }, 2000);
  }

  // Opdracht 3.2 - canvas voor stats
  const canvas = document.createElement("canvas");
  canvas.id = "canvas";
  canvas.width = 241;
  canvas.height = 195;

  // types, lengte, gewicht, en beschrijving
  // Opdracht 3.1 - de types van de pokemon
  const pokeTypes = document.createElement("p");
  pokeData.types.forEach((t) => {
    const typeName = t.type.name;
    const span = document.createElement("span");
    span.classList.add("type-label");
    span.textContent = typeName.toUpperCase();
    span.style.backgroundColor = typeColors[typeName];
    pokeTypes.appendChild(span);
  });

  // lengte en gewicht
  const heightAndWeight = document.createElement("p");
  heightAndWeight.textContent = `Height: ${pokeData.height / 10} m - Weight: ${pokeData.weight / 10} kg`;

  // Opdracht 5.1 - add to team button
  const addPokemonButton = document.createElement("button");
  addPokemonButton.type = "button";
  addPokemonButton.textContent = "Add to team";
  addPokemonButton.addEventListener("click", () => {
    addPokemonToTeam(pokeData, isShiny);
  });

  // flavor text/beschrijving
  const description = document.createElement("p");
  description.id = "flavor-text";
  description.textContent = pokeData.flavor_text;

  // voeg alles toe aan de info container
  infoTop.append(
    h2,
    bigPokeImage,
    canvas,
    pokeTypes,
    heightAndWeight,
    addPokemonButton,
  );
  pokeInfo.append(infoTop, description);

  // teken de stats op het canvas
  drawStats(pokeData);
  // Opdracht 7.2 - evolution chain
  fetchEvolution(pokeData);
}

// opdracht 3.2 - functie om de stats te tekenen
export function drawStats(pokeData) {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height); // maak het canvas leeg

  const barHeight = 20; // de hoogte/breedte van de staven van boven naar beneden
  const gap = 15; // ruimte tussen de staven
  const maxStatValue = 255;
  const textRoom = 170; // ruimte voor de tekst
  const canvasWidth = canvas.width - textRoom;

  let y = 0;

  pokeData.stats.forEach((statObj) => {
    const name = statObj.stat.name;
    const value = statObj.base_stat;
    const color = statColors[name];

    const barWidth = (value / maxStatValue) * canvasWidth;

    ctx.fillStyle = color;
    ctx.fillRect(textRoom, y, barWidth, barHeight);

    // het lijntje achter de stats
    ctx.fillStyle = "#dbdbdb";
    ctx.fillRect(0, y + 6, textRoom - 15, 3);
    ctx.fillStyle = "#000";

    ctx.textBaseline = "middle";
    ctx.font = '14px "Pokemon BW"';
    ctx.fillText(`${name.toUpperCase()} (${value})`, 5, y + barHeight / 2);

    y += barHeight + gap;
  });
}
