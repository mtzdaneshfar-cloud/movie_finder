const API_KEY = "1a158c4";
const BASE_URL = "https://omdbapi.com/";

const heroSection = document.getElementById("hero-section");
const heroTitle = document.getElementById("hero-title");
const heroRating = document.getElementById("hero-rating");
const heroYear = document.getElementById("hero-year");
const heroDescription = document.getElementById("hero-description");
const heroBtn = document.getElementById("hero-btn");

const popularGrid = document.getElementById("popular-movies-grid");
const topRatedGrid = document.getElementById("top-rated-movies-grid");

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const suggestionsDropdown = document.getElementById("suggestions-dropdown");


function showLoading(container) {
  if (!container) return;
  container.innerHTML = '<div class="loading-spinner"><div class="spinner"></div></div>';
}

function showError(container) {
  if (!container) return;
  container.innerHTML = '<div class="error-message"><i class="fa-solid fa-circle-exclamation"></i><p>Something went wrong. Please try again.</p></div>';
}


function createMovieCard(movie) {
  const poster = (movie.Poster && movie.Poster !== "N/A")
    ? movie.Poster
    : "https://via.placeholder.com/300x450/212121/ffffff?text=No+Poster";

  return `
        <div class="movie-card" onclick="openMovieDetails('${movie.imdbID}')">
            <div class="movie-poster-wrapper">
                <img src="${poster}" alt="${movie.Title}" loading="lazy">
                <div class="movie-rating-badge">
                    <i class="fa-solid fa-star"></i>
                    <span>N/A</span>
                </div>
            </div>
            <div class="movie-info">
                <h3 class="movie-title">${movie.Title}</h3>
                <p class="movie-genre">${movie.Type} / ${movie.Year}</p>
                <div class="movie-footer">
                    <div class="rating-box">
                        <i class="fa-solid fa-star"></i>
                        <span>N/A</span>
                    </div>
                    <button class="btn-view-info">View Info</button>
                </div>
            </div>
        </div>
    `;
}

function openMovieDetails(imdbId) {
  window.location.href = `details.html?id=${imdbId}`;
}



function fetchFeaturedMovie(title) {
  const url = `${BASE_URL}?apikey=${API_KEY}&t=${encodeURIComponent(title)}&plot=full`;

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (movie) {
      if (movie.Response === "True") {
        heroTitle.textContent = movie.Title;
        heroRating.textContent = movie.imdbRating || "N/A";
        heroYear.textContent = movie.Year;
        heroDescription.textContent = movie.Plot || "No description available.";

        if (movie.Poster && movie.Poster !== "N/A") {
          heroSection.style.backgroundImage = `linear-gradient(to right, rgba(18, 18, 18, 0.95) 20%, rgba(18, 18, 18, 0.7) 60%, rgba(18, 18, 18, 0.4) 100%), url('${movie.Poster}')`;
        }

        heroBtn.onclick = function () {
          openMovieDetails(movie.imdbID);
        };
      }
    })
    .catch(function (error) {
      console.log("Error loading featured movie:", error);
    });
}


function fetchMoviesList(searchTerm, container) {
  if (!container) return;
  showLoading(container);

  const url = `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(searchTerm)}&type=movie`;

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.Response === "True" && data.Search) {
        container.innerHTML = "";

        for (let i = 0; i < data.Search.length; i++) {
          container.innerHTML += createMovieCard(data.Search[i]);
        }
      } else {
        showError(container);
      }
    })
    .catch(function (error) {
      console.log("Fetch error:", error);
      showError(container);
    });
}


// ==========================================
document.addEventListener("DOMContentLoaded", function () {
  fetchFeaturedMovie("Dune: Part Two");
  fetchMoviesList("Marvel", popularGrid);
  fetchMoviesList("Batman", topRatedGrid);
});

let searchTimeout = null;

function debounce(func, delay) {
    return function(...args) {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}