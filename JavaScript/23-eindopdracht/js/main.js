"use strict";

import { fetchGenerationRegions, fetchPokemon } from "./modules/api/api.js";
import { loadTeamFromLocalStorage } from "./modules/utils.js";

(async function init() {
  await fetchGenerationRegions();
  await fetchPokemon();
  loadTeamFromLocalStorage();
})();
