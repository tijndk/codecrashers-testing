"use strict";

import { enrichWithLocalization } from "../api/api.js";
import { typeColors } from "../constants.js";
import { capitalize } from "../utils.js";
import { t } from "../langSelect.js";

// Opdracht 7.2 - evolution chains
export async function fetchEvolution(pokeData, lang = localStorage.getItem("lang") || "en") {
  const response = await fetch(pokeData.evolutionUrl);
  const chainData = await response.json();

  const evolution = document.createElement("div");
  evolution.id = "evolution";
  evolution.style.border = `3px solid ${
    pokeData.types[1]
      ? typeColors[pokeData.types[1].type.name]
      : "rgba(0,0,0,0.25)"
  }`;
  evolution.innerHTML = `<h3>${t("evolution_chain")}</h3>`;

  const isEeveeChain = chainData.chain.species.name === "eevee";
  const isWideScreen = window.innerWidth > 890;
  const useHorizontalLayout = isEeveeChain && isWideScreen;

  const tree = await renderEvolutionNode(
    chainData.chain,
    pokeData.name,
    useHorizontalLayout,
    lang
  );
  evolution.appendChild(tree);

  document.getElementById("poke-info-container").appendChild(evolution);
}

// functie om de evolution chain duidelijk te krijgen
export async function renderEvolutionNode(
  node,
  currentName,
  horizontalLayout = false,
  lang = localStorage.getItem("lang") || "en"
) {
  let pokeData = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${node.species.name}`,
  ).then((r) => r.json());

  pokeData = await enrichWithLocalization(pokeData, lang);

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
  img.style.border = `3px solid ${
    pokeData.types[1]
      ? typeColors[pokeData.types[1].type.name]
      : "rgba(0,0,0,0.25)"
  }`;

  const label = document.createElement("p");
  label.textContent = capitalize(pokeData.localized_name) || capitalize(pokeData.species.name);

  const type = document.createElement("p");
  pokeData.types.forEach((typeObj) => {
    const typeName = typeObj.type.name;
    const span = document.createElement("span");
    span.classList.add("type-label");
    span.textContent = t(`types.${typeName}`).toUpperCase();
    span.style.backgroundColor = typeColors[typeName];
    type.appendChild(span);
  });

  pokeDiv.append(img, label, type);
  container.appendChild(pokeDiv);

  if (node.evolves_to.length > 0) {
    const branchContainer = document.createElement("div");
    branchContainer.classList.add("branch-container");
    if (horizontalLayout) {
      container.style.flexDirection = "column";
      branchContainer.classList.add("horizontal-branch");
    }

    for (const child of node.evolves_to) {
      const childTree = await renderEvolutionNode(
        child,
        currentName,
        horizontalLayout,
        lang
      );

      if (horizontalLayout) {
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
  }

  return container;
}
