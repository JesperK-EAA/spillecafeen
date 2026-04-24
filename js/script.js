"use strict";
document.addEventListener("DOMContentLoaded", initApp);

getGames("data.json")
 
let allGames = [];
const gameList = document.querySelector("#game-list");
const genreSelect = document.querySelector("#genre-select");
const searchInput = document.querySelector("#search-input");
const sortSelect = document.querySelector("#sort-select");
const gameCount = document.querySelector("#game-count");

function initApp() {
 document
   .querySelector("#search-input")
   .addEventListener("input", applyFiltersAndSort);
 document
   .querySelector("#genre-select")
   .addEventListener("change", applyFiltersAndSort);
 document
   .querySelector("#sort-select")
   .addEventListener("change", applyFiltersAndSort);
  getGames();
}

async function getGames() {
  const response = await fetch("data.json");
  allGames = await response.json();

  populateGenreSelect();
  applyFilters();
}

function populateGenreSelect() {
    const genreSelect = document.querySelector("#genre-select");
  const genres = new Set();

  for (const game of allGames) {
    for (const genre of game.genre) {
      genres.add(genre);
    }
  }

  const genreArray = Array.from(genres);

  genreArray.sort((gameA, gameB) => gameA.localeCompare(gameB));

  for (const genre of genreArray) {
    genreSelect.insertAdjacentHTML(
      "beforeend",
      `<option value="${genre}">${genre}</option>`,
    );
  }
}

function applyFilters() {
  const searchValue = document.querySelector("#search-input").value.trim().toLowerCase();
  const selectedGenre = document.querySelector("#genre-select").value;
  const sortOption = document.querySelector("#sort-select").value;

  let filteredGames = allGames.filter(function (game) {
    const matchesTitle = game.title.toLowerCase().includes(searchValue);
    const matchesGenre =
      selectedGenre === "all" || game.genre.includes(selectedGenre);
    return matchesTitle && matchesGenre;
  });

  if (sortOption === "title") {
    filteredGames.sort((gameA, gameB) =>
      gameA.title.localeCompare(gameB.title),
    );
  } else if (sortOption === "playtime") {
    filteredGames.sort((gameA, gameB) => gameB.playtime - gameA.playtime);
  } else if (sortOption === "age") {
    filteredGames.sort((gameA, gameB) => gameB.age - gameA.age);
  }

  showGames(filteredGames);
}
function showGames(games) {
  const gameList = document.querySelector("#game-list");
  const gameCount = document.querySelector("#game-count");
}

function showGames(games) {
  gameList.innerHTML = "";
  gameCount.textContent = `Viser ${games.length} ud af ${allGames.length} spil`;

  if (games.length === 0) {
    gameList.innerHTML =
      '<p class="empty">Ingen spil matcher din søgning eller genre.</p>';
    return;
  }

  for (const game of games) {
    showGame(game);
  }
}

function showGame(game) {
  const gameCard = /*html*/ `
      <article class="game-card" tabindex="0">
        <img src="${game.image}" alt="Billede af ${game.title}" class="game-poster" />
        <div class="game-info">
          <div class="title-row">
            <h2>${game.title}</h2>
            <span class="year-badge">${game.age}+</span>
          </div>
          <p class="genre">${game.genre}</p>
          <p class="game-rating">⭐ ${game.rating}</p>
          <p><strong>Spilletid:</strong> ${game.playtime} min.</p>
           <p><strong>Spillere:</strong> ${game.players.min}-${game.players.max}</p>
           <p><strong>Sværhedsgrad:</strong> ${game.difficulty}</p>
        </div>
      </article>
    `;

    const gameList = document.querySelector("#game-list");
  gameList.insertAdjacentHTML("beforeend", gameCard);

  const newCard = gameList.lastElementChild;
  newCard.addEventListener("click", function () {
    showGameDialog(game);
  });
}

function showGameDialog(game) {
  const dialog = document.querySelector("#game-dialog");
  const dialogContent = document.querySelector("#dialog-content");

  dialogContent.innerHTML = /*html*/ `
    <img src="${game.image}" alt="${game.title}" class="game-image">
    <div class="dialog-details">
      <h2>${game.title} <span class="game-year">(${game.year})</span></h2>
      <p class="game-genre">${game.genre}</p>
      <p class="game-rating">⭐ ${game.rating}</p>
      <p><strong>Beskrivelse:</strong> ${game.description}</p>
      <p><strong>Spilletid:</strong> ${game.playtime} min.</p>
      <p><strong>Spillere:</strong> ${game.players.min}-${game.players.max}</p>
      <p><strong>Sprog:</strong> ${game.language}</p>
       <p><strong>Alder:</strong> ${game.age}+</p>
       <p><strong>Sværhedsgrad:</strong> ${game.difficulty}</p>
      <p><strong>Lokation:</strong> ${game.location}</p>
      <p><strong>Hylde:</strong> ${game.shelf}</p>
      <p><strong>Status:</strong> ${game.available ? "Tilgængelig" : "Ikke tilgængelig"}</p>
      <p class="game-description"><strong>Regler:</strong> ${game.rules}</p>
    </div>
  `;

  dialog.showModal();
}