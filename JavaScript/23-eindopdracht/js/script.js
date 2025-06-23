"use strict";

// Opdracht 2.1
const config = {
  method: "GET",
  mode: "cors",
  cache: "default",
};

// Opdracht 3.1 - de kleuren van de types
const typeColors = {
  normal: "#A8A878",
  fighting: "#C03028",
  flying: "#A890F0",
  poison: "#A040A0",
  ground: "#E0C068",
  rock: "#B8A038",
  bug: "#A8B820",
  ghost: "#705898",
  steel: "#B8B8D0",
  fire: "#F08030",
  water: "#6890F0",
  grass: "#78C850",
  electric: "#F8D030",
  psychic: "#F85888",
  ice: "#98D8D8",
  dragon: "#7038F8",
  dark: "#705848",
  fairy: "#EE99AC",
};

// kleuren van stats
const statColors = {
  hp: "#FF5959",
  attack: "#F5AC78",
  defense: "#FAE078",
  "special-attack": "#9DB7F5",
  "special-defense": "#A7DB8D",
  speed: "#FA92B2",
};

// Opdracht 5.1
const myTeam = [];

// Opdracht 7.1 - de generatie en regio
const generationMap = new Map();

// Opdracht 2.1 - fetch alle pokemon t/m pokemon 898
async function fetchPokemon() {
  const response = await fetch(
    "https://pokeapi.co/api/v2/pokemon/?limit=898",
    config,
  );
  const allpokemon = await response.json();
  const allResults = allpokemon.results;

  const initialBatchSize = 20;
  const restBatchSize = 25;

  // Om de eerste 20 pokemon te laten zien
  const initialBatch = allResults.slice(0, initialBatchSize)
  const initialData = await Promise.all(
    initialBatch.map((pokemon) => fetchPokemonData(pokemon))
  );
  const firstValid = initialData.filter(Boolean);
  firstValid.forEach(renderPokemonIndex);
  // laat standaard bulbasaur zien als de pagina geopend word
  showInfo(firstValid[0])

  // voor de rest van de pokemon
  for (
    let i = initialBatchSize;
    i < allResults.length;
    i += restBatchSize
  ) {
    const batch = allResults.slice(i, i + restBatchSize);
    const results = await Promise.all(
      batch.map((pokemon) => fetchPokemonData(pokemon))
    );
    results.filter(Boolean).forEach(renderPokemonIndex);
  }
}

// functie om de data per pokemon te fetchen
function fetchPokemonData(pokemon) {
  return fetch(pokemon.url)
    .then((response) => {
      if (!response.ok) throw new Error("Netwerkfout bij Pokemon");
      return response.json();
    }) // Opdracht 2.2 - om de omschrijving te krijgen en te zien of het een mythical of legendary pokemon is
    .then((pokeData) => {
      return fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokeData.id}`)
        .then((response) => {
          if (!response.ok) throw new Error("Netwerkfout bij species");
          return response.json();
        })
        .then((speciesData) => {
          const englishDesc = speciesData.flavor_text_entries.find(
            (entry) => entry.language.name === "en",
          );
          pokeData.flavor_text = englishDesc
            ? englishDesc.flavor_text.replace(/\f/g, " ")
            : "No description available.";

          // Opdracht 2.3
          pokeData.isLegendary = speciesData.is_legendary;
          pokeData.isMythical = speciesData.is_mythical;

          // Opracht 7.1
          pokeData.generation = speciesData.generation.name;

          // Opdracht 7.2
          pokeData.evolutionUrl = speciesData.evolution_chain.url;

          return pokeData;
        });
    })
    .catch((error) => {
      console.error(`Fout bij ophalen van ${pokemon.name}:`, error);
    });
}

// functie om elementen aan te maken en de pokemon index te renderen/laten zien op de pagina aan de linker kant
function renderPokemonIndex(pokeData) {
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
function showInfo(pokeData) {
  const pokeInfo = document.getElementById("poke-info-container");
  // Opdracht 4.1 - shiny kans is 1 op 10
  const isShiny = Math.random() < 1 / 10;

  // leegmaken zodat er niet meerdere pokemon getoond worden
  pokeInfo.innerHTML = "";

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
function drawStats(pokeData) {
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

    ctx.fillStyle = "#dbdbdb";
    ctx.fillRect(5, y + 9, textRoom - 15, 3);
    ctx.fillStyle = "#000";

    ctx.textBaseline = "middle";
    ctx.font = "14px Tiny5";
    ctx.fillText(`${name.toUpperCase()} (${value})`, 10, y + barHeight / 2);

    y += barHeight + gap;
  });
}

// Opdracht 5.1 - voeg pokemon toe aan team
function addPokemonToTeam(pokeData, isShiny) {
  const speciesName = capitalize(pokeData.species.name);

  if (myTeam.length >= 6) {
    alert("Your team is full! (6 Pokémon maximum)");
    return;
  }

  // Opdracht 5.3 - nickname
  let nickname = prompt(
    "Give your Pokémon a nickname? (click on name to change it)",
    speciesName,
  );

  // lengte controle voor de nickname
  while (nickname && nickname.length > 12) {
    nickname = prompt(
      "Nickname too long! Max 12 characters.\nPlease enter a shorter nickname:",
    );
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
  saveTeamToLocalStorage();
  renderTeam();
}

// Opdracht 5.1 - laat het team zien op de pagina
function renderTeam() {
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
      if (
        confirm(
          `Are you sure you want to remove ${pokemon.name} from your team?`,
        )
      ) {
        card.remove();
        myTeam.splice(myTeam.indexOf(pokemon), 1);
        // Opdracht 5.4 - team opslaan
        saveTeamToLocalStorage();
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

      function saveNickname() {
        const newName = input.value.trim() || pokemon.name;
        pokemon.name = newName;

        name.textContent = newName;
        card.replaceChild(name, input);
      }

      input.addEventListener("blur", () => {
        saveNickname();
        saveTeamToLocalStorage();
      });
    });

    card.append(pokeTeamImage, deleteBtn, name);
    teamContainer.append(card);
  });
  drawTotalStats(myTeam);
  renderAllTypes(myTeam);
}

function drawTotalStats(myTeam) {
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
    // lijntje achter tekst
    ctx.fillStyle = "#dbdbdb";
    ctx.fillRect(0, y + 5, 200, 3);

    // de tekst
    ctx.fillStyle = "#000";
    ctx.textBaseline = "bottom";
    ctx.font = "14px Tiny5";
    ctx.fillText(`TOTAL ${name.toUpperCase()} (${value})`, 0, y + 14);

    // de balk
    const w = (value / maxStats) * drawWidth;
    ctx.fillStyle = statColors[name];
    ctx.fillRect(0, y + 18, w, barHeight);

    y += barHeight + gap;
  });
}

// Opdracht 6.2 - alle types
function renderAllTypes(myTeam) {
  const container = document.getElementById("combined-types-container");
  container.innerHTML = "";

  const allTypes = new Set();
  myTeam.forEach((pokemon) => {
    if (!pokemon.types) {
      allTypes.add(pokemon.type);
    } else {
      pokemon.types.forEach((typeObj) => {
        allTypes.add(typeObj.type.name);
      });
    }
  });

  allTypes.forEach((type) => {
    const span = document.createElement("span");
    span.classList.add("type-label");
    span.textContent = type.toUpperCase();

    span.style.backgroundColor = typeColors[type];

    container.appendChild(span);
  });
}

// Opdracht 7.1 - generatie en regio
async function fetchGenerationRegions() {
  fetch("https://pokeapi.co/api/v2/generation/", config)
    .then((response) => response.json())
    .then((data) => {
      const generationPromises = data.results.map((gen) =>
        fetch(gen.url).then((res) => res.json()),
      );

      return Promise.all(generationPromises);
    })
    .then((generations) => {
      generations.forEach((genData) => {
        const genKey = genData.name;
        const regionName = capitalize(genData.main_region.name);
        generationMap.set(genKey, regionName);
      });
    });
}

// Opdracht 7.2 - evolution chains - GA HIER VERDER
async function fetchEvolution(pokeData) {
  const response = await fetch(pokeData.evolutionUrl, config);
  const chainData = await response.json();

  const evolution = document.createElement("div");
  evolution.id = "evolution";
  evolution.innerHTML = "<h3>Evolution Chain</h3>";

  const tree = await renderEvolutionNode(chainData.chain, pokeData.name);
  evolution.appendChild(tree);

  document.getElementById("poke-info-container").appendChild(evolution);
}

// help functie om de evolution chain duidelijk te krijgen
async function renderEvolutionNode(node, currentName) {
  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.alignItems = "center";
  container.style.marginBottom = "1em";

  const pokeDiv = document.createElement("div");
  pokeDiv.style.textAlign = "center";

  const pokeData = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${node.species.name}`,
  ).then((r) => r.json());

  const img = document.createElement("img");
  img.src = pokeData.sprites.front_default;
  img.alt = node.species.name;
  img.width = 80;
  img.height = 80;

  const label = document.createElement("p");
  label.textContent = capitalize(node.species.name);

  pokeDiv.appendChild(img);
  pokeDiv.appendChild(label);

  container.appendChild(pokeDiv);

  if (node.evolves_to.length === 0) return container;

  const branchContainer = document.createElement("div");
  branchContainer.style.display = "flex";
  branchContainer.style.flexDirection = "column";
  branchContainer.style.gap = "20px";
  branchContainer.style.marginTop = "10px";

  for (const child of node.evolves_to) {
    const childTree = await renderEvolutionNode(child, currentName);
    branchContainer.appendChild(childTree);
  }

  container.appendChild(branchContainer);
  return container;
}

// help functie om woorden te capitaliseren
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Opdracht 5.4 - team opslaan
function saveTeamToLocalStorage() {
  localStorage.setItem("team", JSON.stringify(myTeam));
}

// Opdracht 5.4 - team laden
function loadTeamFromLocalStorage() {
  const savedTeam = localStorage.getItem("team");
  if (savedTeam) {
    const parsedTeam = JSON.parse(savedTeam);
    parsedTeam.forEach((pokemon) => myTeam.push(pokemon));
    renderTeam();
  }
}

(async function init() {
  await fetchGenerationRegions();
  await fetchPokemon();
  loadTeamFromLocalStorage();
})();
