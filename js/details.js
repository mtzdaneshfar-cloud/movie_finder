const movieId = new URLSearchParams(window.location.search).get("id");

const detailsLoading = document.getElementById("details-loading");
const movieDetailsContainer = document.getElementById("movie-details-container");
const detailsError = document.getElementById("details-error");

const detailPoster = document.getElementById("detail-poster");
const detailTitle = document.getElementById("detail-title");
const detailYear = document.getElementById("detail-year");
const detailRated = document.getElementById("detail-rated");
const detailRuntime = document.getElementById("detail-runtime");
const detailGenres = document.getElementById("detail-genres");
const detailRating = document.getElementById("detail-rating");
const detailPlot = document.getElementById("detail-plot");
const detailDirector = document.getElementById("detail-director");
const detailActors = document.getElementById("detail-actors");
const detailBoxOffice = document.getElementById("detail-boxoffice");

if (!movieId) {
    detailsLoading.style.display = "none";
    detailsError.style.display = "flex";
}
const API_KEY = "1a158c4";
const BASE_URL = "https://www.omdbapi.com/";

function fetchMovieDetails(id) {
    const url = BASE_URL + "?apikey=" + API_KEY + "&i=" + id + "&plot=full";

    fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            if (data.Response === "True") {
                renderMovieDetails(data);
            } else {
                showDetailsError();
            }
        })
        .catch(function(error) {
            console.error("Fetch error:", error);
            showDetailsError();
        });
}

function showDetailsError() {
    detailsLoading.style.display = "none";
    movieDetailsContainer.style.display = "none";
    detailsError.style.display = "flex";
}

function renderMovieDetails(movie) {
    if (movie.Poster && movie.Poster !== "N/A") {
        detailPoster.src = movie.Poster;
        detailPoster.alt = movie.Title;
    } else {
        detailPoster.src = "https://via.placeholder.com/350x500?text=No+Poster";
        detailPoster.alt = movie.Title;
    }

    detailTitle.textContent = movie.Title;
    detailYear.textContent = movie.Year;
    detailRated.textContent = movie.Rated;
    detailRuntime.textContent = movie.Runtime;
    detailRating.textContent = movie.imdbRating;
    detailPlot.textContent = movie.Plot;
    detailDirector.textContent = movie.Director;
    detailActors.textContent = movie.Actors;
    detailBoxOffice.textContent = movie.BoxOffice || "N/A";

    detailGenres.innerHTML = "";
    if (movie.Genre && movie.Genre !== "N/A") {
        const genresList = movie.Genre.split(",");
        for (let i = 0; i < genresList.length; i++) {
            const genreName = genresList[i].trim();
            const tag = document.createElement("span");
            tag.className = "genre-tag";
            tag.textContent = genreName;
            detailGenres.appendChild(tag);
        }
    }

    detailsLoading.style.display = "none";
    movieDetailsContainer.style.display = "grid";
}

if (movieId) {
    fetchMovieDetails(movieId);
}