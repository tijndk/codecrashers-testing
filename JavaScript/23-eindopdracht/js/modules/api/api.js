"use strict";

import { config, generationMap } from "../constants.js";
import { renderPokemonIndex } from "../ui/renderPokemon.js";
import { showInfo } from "../ui/renderPokemon.js";
import { capitalize } from "../utils.js";

// Opdracht 2.1 - fetch alle pokemon t/m pokemon 898
export async function fetchPokemon() {
  const response = await fetch(
    "https://pokeapi.co/api/v2/pokemon/?limit=898",
    config,
  );
  const allpokemon = await response.json();
  const allResults = allpokemon.results;

  const initialBatchSize = 20;
  const restBatchSize = 25;

  // Om de eerste 20 pokemon te laten zien in de index
  const initialBatch = allResults.slice(0, initialBatchSize);
  const initialData = await Promise.all(initialBatch.map(fetchPokemonData));
  const firstValid = initialData.filter(Boolean);

  firstValid.forEach(renderPokemonIndex);
  // laat standaard bulbasaur zien als de pagina geopend word
  showInfo(firstValid[0]);

  // voor de rest van de pokemon
  for (let i = initialBatchSize; i < allResults.length; i += restBatchSize) {
    const batch = allResults.slice(i, i + restBatchSize);
    const results = await Promise.all(batch.map(fetchPokemonData));
    results.filter(Boolean).forEach(renderPokemonIndex);
  }
}

// functie om de data per pokemon te fetchen
export function fetchPokemonData(pokemon) {
  return fetch(pokemon.url)
    .then((response) => {
      if (!response.ok) throw new Error("Network error with Pokémon");
      return response.json();
    }) // Opdracht 2.2 - om de omschrijving te krijgen en te zien of het een mythical of legendary pokemon is
    .then((pokeData) => {
      return fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokeData.id}`)
        .then((response) => {
          if (!response.ok) throw new Error("Network error with species");
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
          pokeData.generation = speciesData.generation.name; // Opracht 7.1
          pokeData.evolutionUrl = speciesData.evolution_chain.url; // Opdracht 7.2

          return pokeData;
        });
    })
    .catch((error) => {
      console.error(`Error with fetching ${pokemon.name}:`, error);
    });
}

// Opdracht 7.1 - generatie en regio
export async function fetchGenerationRegions() {
  const response = await fetch("https://pokeapi.co/api/v2/generation/", config);
  const data = await response.json();

  const generationPromises = data.results.map((gen) =>
    fetch(gen.url).then((res) => res.json()),
  );

  const generations = await Promise.all(generationPromises);

  generations.forEach((genData) => {
    const genKey = genData.name;
    const regionName = capitalize(genData.main_region.name);
    generationMap.set(genKey, regionName);
  });
}
