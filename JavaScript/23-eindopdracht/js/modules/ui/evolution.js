"use strict";

import { typeColors } from "../constants.js";
import { capitalize } from "../utils.js";

// Opdracht 7.2 - evolution chains
export async function fetchEvolution(pokeData) {
  const response = await fetch(pokeData.evolutionUrl);
  const chainData = await response.json();

  const evolution = document.createElement("div");
  evolution.id = "evolution";
  evolution.style.border = `3px solid ${pokeData.types[1] ? typeColors[pokeData.types[1].type.name] : "rgba(0,0,0,0.25)"}`;
  evolution.innerHTML = "<h3>Evolution Chain</h3>";

  const tree = await renderEvolutionNode(chainData.chain, pokeData.name);
  evolution.appendChild(tree);

  document.getElementById("poke-info-container").appendChild(evolution);
}

// functie om de evolution chain duidelijk te krijgen
export async function renderEvolutionNode(node, currentName) {
  const pokeData = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${node.species.name}`,
  ).then((r) => r.json());

  const container = document.createElement("div");
  container.classList.add("evo-div");

  const pokeDiv = document.createElement("div");
  pokeDiv.classList.add("evo-poke");

  const img = document.createElement("img");
  img.src = pokeData.sprites.front_default;
  img.alt = node.species.name;
  img.width = 80;
  img.height = 80;

  img.style.backgroundColor = typeColors[pokeData.types[0].type.name];
  img.style.border = `3px solid ${pokeData.types[1] ? typeColors[pokeData.types[1].type.name] : "rgba(0,0,0,0.25)"}`;

  const label = document.createElement("p");
  label.textContent = capitalize(node.species.name);

  const type = document.createElement("p");
  pokeData.types.forEach((t) => {
    const typeName = t.type.name;
    const span = document.createElement("span");
    span.classList.add("type-label");
    span.textContent = typeName.toUpperCase();
    span.style.backgroundColor = typeColors[typeName];
    type.appendChild(span);
  });

  pokeDiv.append(img, label, type);
  container.appendChild(pokeDiv);

  const branchContainer = document.createElement("div");
  const isHorizontalBranch = node.species.name === "eevee" && window.innerWidth > 1200;

  branchContainer.classList.add("branch-container");
  if (isHorizontalBranch) {
    branchContainer.classList.add("horizontal-branch");
  }

  for (const child of node.evolves_to) {
    const childTree = await renderEvolutionNode(child, currentName);

    if (isHorizontalBranch) {
      container.style.flexDirection = "column";

      const wrapper = document.createElement("div");
      wrapper.style.display = "flex";
      wrapper.style.flexDirection = "column";
      wrapper.style.alignItems = "center";

      const arrow = document.createElement("div");
      arrow.classList.add("arrow");
      arrow.textContent = "↓";

      wrapper.append(arrow, childTree);
      branchContainer.appendChild(wrapper);
    } else {
      const evoRow = document.createElement("div");
      evoRow.classList.add("evo-row");

      const arrow = document.createElement("div");
      arrow.classList.add("arrow");
      arrow.textContent = "→";

      evoRow.append(arrow, childTree);
      branchContainer.appendChild(evoRow);
    }
  }

  container.appendChild(branchContainer);
  return container;
}
