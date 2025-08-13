"use strict";

import { fetchGenerationRegions, fetchPokemon, fetchPokemonData } from "./modules/api/api.js";
import { loadTeamFromLocalStorage } from "./modules/utils.js";
import { setupLanguageSelector, loadLanguage } from "./modules/langSelect.js";
import { renderTeam, myTeam } from "./modules/ui/team.js";
import { selectedPokemon, setSelectedPokemon } from "./modules/state.js";
import { showInfo } from "./modules/ui/renderPokemon.js";

function loadAndRenderTeam() {
  const saved = loadTeamFromLocalStorage();
  myTeam.length = 0;
  myTeam.push(...saved);
  renderTeam();
}

async function reloadAll(lang) {
  await loadLanguage(lang);

  document.getElementById("poke-info-container").innerHTML = `<p id= "loading-text" data-lang="loading"></p>`;
  await fetchPokemon(lang);

  if (selectedPokemon && selectedPokemon.url) {
    const updatedData = await fetchPokemonData({ url: selectedPokemon.url }, lang);
    showInfo(updatedData);
  }

  loadAndRenderTeam();
}

(async function init() {
  const savedLang = localStorage.getItem("lang") || "en";
  await reloadAll(savedLang);

  setupLanguageSelector("lang-select", async (lang) => {
    await reloadAll(lang);
  });

  await fetchGenerationRegions();
})();