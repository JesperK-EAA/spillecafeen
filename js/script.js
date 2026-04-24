"use strict";
document.addEventListener("DOMContentLoaded", initApp);

const GAMES_URL =
  "https://raw.githubusercontent.com/cederdorff/race/refs/heads/master/data/games.json";
let allGames = [];
const movieList = document.querySelector("#movie-list");
const genreSelect = document.querySelector("#genre-select");
const searchInput = document.querySelector("#search-input");
const sortSelect = document.querySelector("#sort-select");
const movieCount = document.querySelector("#movie-count");

function initApp() {
  genreSelect.addEventListener("change", applyFilters);
  searchInput.addEventListener("input", applyFilters);
  sortSelect.addEventListener("change", applyFilters);

  fetchMovies();
}

async function fetchMovies() {
  const response = await fetch(MOVIES_URL);
  allMovies = await response.json();

  populateGenreSelect();
  applyFilters();
}

function populateGenreSelect() {
  const genres = new Set();

  for (const movie of allMovies) {
    for (const genre of movie.genre) {
      genres.add(genre);
    }
  }

  const genreArray = Array.from(genres);

  genreArray.sort((movieA, movieB) => movieA.localeCompare(movieB));
  for (const genre of genreArray) {
    genreSelect.insertAdjacentHTML(
      "beforeend",
      `<option value="${genre}">${genre}</option>`,
    );
  }
}

function applyFilters() {
  const searchValue = searchInput.value.trim().toLowerCase();
  const selectedGenre = genreSelect.value;
  const sortOption = sortSelect.value;

  let filteredMovies = allMovies.filter(function (movie) {
    const matchesTitle = movie.title.toLowerCase().includes(searchValue);
    const matchesGenre =
      selectedGenre === "all" || movie.genre.includes(selectedGenre);
    return matchesTitle && matchesGenre;
  });

  if (sortOption === "title") {
    filteredMovies.sort((movieA, movieB) =>
      movieA.title.localeCompare(movieB.title),
    );
  } else if (sortOption === "year") {
    filteredMovies.sort((movieA, movieB) => movieB.year - movieA.year);
  } else if (sortOption === "rating") {
    filteredMovies.sort((movieA, movieB) => movieB.rating - movieA.rating);
  }

  showMovies(filteredMovies);
}

function showMovies(movies) {
  movieList.innerHTML = "";
  movieCount.textContent = `Viser ${movies.length} ud af ${allMovies.length} film`;

  if (movies.length === 0) {
    movieList.innerHTML =
      '<p class="empty">Ingen film matcher din søgning eller genre.</p>';
    return;
  }

  for (const movie of movies) {
    showMovie(movie);
  }
}

function showMovie(movie) {
  const movieCard = /*html*/ `
      <article class="movie-card" tabindex="0">
        <img src="${movie.image}" alt="${movie.title}" class="movie-image" />
        <div class="movie-info">
          <div class="title-row">
            <h2>${movie.title}</h2>
            <span class="year-badge">(${movie.year})</span>
          </div>
          <p class="genre">${movie.genre.join(", ")}</p>
          <p class="movie-rating">⭐ ${movie.rating}</p>
          <p class="director-line"><strong>Instruktør:</strong> ${movie.director}</p>
        </div>
      </article>
    `;

  movieList.insertAdjacentHTML("beforeend", movieCard);

  const newCard = movieList.lastElementChild;
  newCard.addEventListener("click", function () {
    showMovieDialog(movie);
  });
}

function showMovieDialog(movie) {
  const dialog = document.querySelector("#movie-dialog");
  const dialogContent = document.querySelector("#dialog-content");

  dialogContent.innerHTML = /*html*/ `
    <img src="${movie.image}" alt="${movie.title}" class="movie-image">
    <div class="dialog-details">
      <h2>${movie.title} <span class="movie-year">(${movie.year})</span></h2>
      <p class="movie-genre">${movie.genre.join(", ")}</p>
      <p class="movie-rating">⭐ ${movie.rating}</p>
      <p><strong>Instruktør:</strong> ${movie.director}</p>
      <p><strong>Skuespillere:</strong> ${movie.actors.join(", ")}</p>
      <p class="movie-description">${movie.description}</p>
    </div>
  `;

  dialog.showModal();
}