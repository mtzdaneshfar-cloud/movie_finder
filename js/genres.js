const API_KEY = "1a158c4";
const BASE_URL = "https://www.omdbapi.com/";

const genreButtons = document.querySelectorAll(".genre-btn");
const genresResultsGrid = document.getElementById("genre-movies-grid");
const genresLoading = document.getElementById("genres-loading");
const genresError = document.getElementById("genres-error");

function showGenresLoading() {
    genresLoading.style.display = "flex";
    genresError.style.display = "none";
    genresResultsGrid.innerHTML = "";
}

function showGenresError() {
    genresLoading.style.display = "none";
    genresResultsGrid.innerHTML = "";
    genresError.style.display = "flex";
}

function hideGenresStatus() {
    genresLoading.style.display = "none";
    genresError.style.display = "none";
}

function createMovieCard(movie) {
    const card = document.createElement("div");
    card.className = "movie-card";

    let posterSrc = "https://via.placeholder.com/300x450?text=No+Poster";
    if (movie.Poster && movie.Poster !== "N/A") {
        posterSrc = movie.Poster;
    }

    card.innerHTML = 
        '<div class="movie-poster-wrapper">' +
            '<img src="' + posterSrc + '" alt="' + movie.Title + '" loading="lazy">' +
        '</div>' +
        '<div class="movie-info">' +
            '<h3 class="movie-title">' + movie.Title + '</h3>' +
            '<div class="movie-card-footer">' +
                '<span class="movie-year">' + movie.Year + '</span>' +
                '<button type="button" class="btn-view-info">Details</button>' +
            '</div>' +
        '</div>';

    card.addEventListener("click", function() {
        window.location.href = "details.html?id=" + movie.imdbID;
    });

    return card;
}

function fetchMoviesByGenre(keyword) {
    showGenresLoading();

    const url = BASE_URL + "?apikey=" + API_KEY + "&s=" + encodeURIComponent(keyword) + "&type=movie";

    fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            hideGenresStatus();
            if (data.Response === "True" && data.Search) {
                genresResultsGrid.innerHTML = "";
                for (let i = 0; i < data.Search.length; i++) {
                    const card = createMovieCard(data.Search[i]);
                    genresResultsGrid.appendChild(card);
                }
            } else {
                showGenresError();
            }
        })
        .catch(function(error) {
            console.error("Fetch genre error:", error);
            showGenresError();
        });
}

for (let i = 0; i < genreButtons.length; i++) {
    genreButtons[i].addEventListener("click", function() {
        for (let j = 0; j < genreButtons.length; j++) {
            genreButtons[j].classList.remove("active");
        }
        this.classList.add("active");

        const selectedGenre = this.getAttribute("data-genre");
        fetchMoviesByGenre(selectedGenre);
    });
}


const defaultActiveBtn = document.querySelector(".genre-btn.active");
if (defaultActiveBtn) {
    const initialGenre = defaultActiveBtn.getAttribute("data-genre");
    fetchMoviesByGenre(initialGenre);
}