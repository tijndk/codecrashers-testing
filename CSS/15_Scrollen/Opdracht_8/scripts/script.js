// Opdracht 8.2 
function shuffleArray(array) {
	array.sort(() => Math.random() - 0.5);
}

const levels = [
	"level-2-1",
	"level-3-1",
	"level-4-1",
	"level-1-2",
	"level-2-2",
	"level-3-2",
	"level-4-2",
	"level-1-3",
	"level-2-3",
	"level-3-3",
	"level-4-3",
	"level-1-4",
	"level-2-4",
	"level-3-4",
	"level-4-4",
];

shuffleArray(levels);

const newGrid = `
'level-1-1 ${levels[0]} ${levels[1]} ${levels[2]}'
'${levels[3]} ${levels[4]} ${levels[5]} ${levels[6]}'
'${levels[7]} ${levels[8]} ${levels[9]} ${levels[10]}'
'${levels[11]} ${levels[12]} ${levels[13]} ${levels[14]}'
`;

document.querySelector("main").style.gridTemplateAreas = newGrid;
// /8.2


// Opdracht 8.3
let characterChoice = prompt(`
Vul één van onderstaande getallen in om een personage te kiezen:\n
1 - Isaac
2 - Magdalene
3 - Cain
4 - ???
5 - Eve
6 - Azazel
7 - Lazarus
8 - The Lost
9 - Lilith
10 - Apollyon
11 - The Forgotten
12 - Esau
`);

characterChoice = parseInt(characterChoice);
let imageSrc = "";

switch (characterChoice){
	case 1:
		imageSrc = "isaac.png";
	break;
	case 2:
		imageSrc = "magdalene.png";
	break;
	case 3:
		imageSrc = "tainted-cain.png";
	break;
	case 4:
		imageSrc = "blue-baby.png";
	break;
	case 5:
		imageSrc = "eve.png";
	break;
	case 6:
		imageSrc = "azazel.png";
	break;
	case 7:
		imageSrc = "lazarus-risen.png";
	break;
	case 8:
		imageSrc = "the-lost.png";
	break;
	case 9:
		imageSrc = "lilith.png";
	break;
	case 10:
		imageSrc = "apollyon.png";
	break;
	case 11:
		imageSrc = "the-forgotten.png";
	break;
	case 12:
		imageSrc = "esau.png";
	break;
	default:
		imageSrc = "isaac.png";
}

document.querySelector(".character > img").src = "images/characters/" + imageSrc;
// /8.3

// Opdracht 8.5
//werkt niet
function isInViewport(element) {
	const rect = element.getBoundingClientRect();
	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
		rect.right <= (window.innerWidth || document.documentElement.clientWidth)
	);

    
}

const treasureRoom = document.querySelector(".level-2-1");

document.querySelector("main").addEventListener("scroll", (event) => {
	if (isInViewport(treasureRoom)){
		let random = Math.floor(Math.random() * 8) + 1;
		let imageSrc = "";

		switch (random){
			case 1:
				imageSrc = "boomerang.png";
			break;
			case 2:
				imageSrc = "candle.png";
			break;
			case 3:
				imageSrc = "d20.png";
			break;
			case 4:
				imageSrc = "guppys-paw.png";
			break;
			case 5:
				imageSrc = "hourglass.png";
			break;
			case 6:
				imageSrc = "moms-shovel.png";
			break;
			case 7:
				imageSrc = "mystery-gift.png";
			break;
			case 8:
				imageSrc = "necronomicon.png";
			break;
			default:
				imageSrc = "boomerang.png";
		}

		document.querySelector(".inventory > img").src = "images/items/" + imageSrc;
		document.querySelector(".inventory > img").style.display = "block";
	}
});
// /8.5

// Opdracht 8.7
// Werkt ook niet
const spikeRoom = document.querySelector(".level-3-1");
let health = 3;

document.querySelector("main").addEventListener("scroll", (event) => {
	if (isInViewport(spikeRoom)){
		health = health -1;

		if (health < 3){
			document.querySelector(".health > img:nth-child(3)").style.display = "none";
		}
		if (health < 2){
			document.querySelector(".health > img:nth-child(2)").style.display = "none";
		}
		if (health < 1){
			document.querySelector(".health > img:nth-child(1)").style.display = "none";
			setTimeout(() => {
				alert("GAME OVER!")
			}, 500);
			setTimeout(() => {
				document.querySelector("main").scrollTo(0, 0)
			}, 1000);
			setTimeout(() => {
				health = 3;
				document.querySelector(".health > img:nth-child(1)").style.display = "block";
				document.querySelector(".health > img:nth-child(2)").style.display = "block";
				document.querySelector(".health > img:nth-child(3)").style.display = "block";
				document.querySelector(".inventory > img").style.display = "none";
			}, 1500);
		}
	}
});
//  /8.7