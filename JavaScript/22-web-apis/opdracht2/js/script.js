"use strict";

const config = {
	method: "GET",
	mode: "cors",
	cache: "default"
};

// Opdracht 2.3
let lang = "nl-NL";

// Opdracht 2.1
const moviesContainer = document.getElementById("moviesContainer");

// Opdracht 2.3
document.getElementById("languageSelector").addEventListener("click", (event) => {
	if (event.target.classList.contains("flags")) { // als een div in languageSelector de class flags heeft dan

		document.querySelectorAll(".flags").forEach(flag => {
            flag.classList.remove("selected");
        });

        event.target.classList.add("selected");

		switch (event.target.classList[1]) {
			case "dutch":
				lang = "nl-NL";
				break;
			case "english":
				lang = "en-US";
				break;
			case "spanish":
				lang = "es-ES";
				break;
			case "french":
				lang = "fr-FR";
				break;
			case "german":
				lang = "de-DE";
				break;
			case "italian":
				lang = "it-IT";
				break;
			default:
				lang = "nl-NL";
				break;
		}
		loadMovies();
	}
});

// Opdracht 2.1
function loadMovies() {
	moviesContainer.innerHTML = "";
	for (let i = 1; i <= 5; i++) {
		fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=cad3f4d7ef3117151254b536d55c673a&page=${i}&language=${lang}`, config)
		.then(response => response.json())
		.then(data => {
			data.results.forEach(movie => {
				const movieCard = document.createElement("div");
				movieCard.classList.add("movie");
				movieCard.classList.add(movie.id);
	
				movieCard.innerHTML = `
					<img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
					<p class="movieTitle"><strong>${movie.title}</strong></p>
					<p>${movie.vote_average.toFixed(1)}</p>
				`;
	
				// Opdracht 2.2
				movieCard.querySelector(".movieTitle").addEventListener("click", () => {
					showMovieDetails(movie.id, movieCard);
				})
	
				moviesContainer.appendChild(movieCard);
			});
		});
	}
}

loadMovies();

// Opdracht 2.2
function showMovieDetails(movieId) {
	fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=cad3f4d7ef3117151254b536d55c673a&language=${lang}`, config)
		.then(response => response.json())
		.then(data => {
			// Opdracht 2.1
			const movieInfo = document.createElement("div");
			movieInfo.classList.add("movieInfo");

			movieInfo.innerHTML = `
				<figure>
					<img src="https://image.tmdb.org/t/p/w500${data.poster_path}" alt="data.title">
				</figure>
				<div class="movieDetails">
					<h1>${data.title}</h1>
					<p class="tagline">${data.tagline ? data.tagline : "Geen tagline beschikbaar."}</p>
					<p>${data.overview}</p>
					<p>Releasedatum: ${formatDate(data.release_date)}</p>
					<p>Speeltijd: ${data.runtime} minuten</p>
					<p>Genre(s): ${data.genres.map(genre => genre.name).join(", ")}</p>
					<p>Beoordeling: ${data.vote_average.toFixed(1)} op basis van ${data.vote_count} reviews</p>
					<p>Budget: ${formatCurrency(data.budget)}</p>
					<p>Opbrengst: ${formatCurrency(data.revenue)}</p>
				</div>
				<div id="castInfo"></div>
			`;

			document.querySelector(".modal-content").appendChild(movieInfo);

			fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=cad3f4d7ef3117151254b536d55c673a&language=${lang}`, config)
				.then(response => response.json())
				.then(castData => {
					const castInfo = movieInfo.querySelector("#castInfo");
					castInfo.innerHTML = "<h2>Cast:</h2>";

					castData.cast.forEach(actor => {
						if(actor.profile_path) {
							const actorCard = document.createElement("div");
							actorCard.classList.add("actor");

							actorCard.innerHTML = `
								<img src="https://image.tmdb.org/t/p/w200${actor.profile_path}" alt="${actor.name}">
								<p><strong>${actor.name}</strong></p>
								<p>${actor.character}</p>
							`;

							castInfo.appendChild(actorCard);
						}
					});
				});
			});

			document.getElementById("movieModal").style.display = "block";
}

// Opdracht 2.2
document.querySelector(".close").addEventListener("click", function () {
    document.getElementById("movieModal").style.display = "none";
	document.querySelector(".movieInfo").remove();
});

window.addEventListener("click", function (event) {
    const modal = document.getElementById("movieModal");
    if (event.target === modal) {
        modal.style.display = "none";
		document.querySelector(".movieInfo").remove();
    }
});

// Opdracht 2.2
function formatDate(dateString) {
	const [year, month, day] = dateString.split("-");
	return `${day}-${month}-${year}`;
}

function formatCurrency(amount) {
	return amount > 0 ? `$${amount.toLocaleString("en-US")}` : "Niet beschikbaar";
}