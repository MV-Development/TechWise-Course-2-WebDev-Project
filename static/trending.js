var APIKey = '46eb4bee79974ac4c17249b988d15fb8';
const baseURL = "https://api.themoviedb.org/3";
let movies = document.getElementById("movies");

window.onload = function() {
    getTrending();
};

function getTrending() {
    return fetch(`${baseURL}/trending/movie/week?api_key=${APIKey}`)
        .then((res) => res.json()) 
        .then((data) => {
            let movies = data.results;
            let display = "";
            
            $.each(movies, (i, movie) => {
            display += `
            <div class="movie-container">
                <img class="posters" data-value="${movie.id}" src="https://image.tmdb.org/t/p/w185_and_h278_bestv2${movie.poster_path}" onerror="this.onerror=null; this.src='static/images/head.png';">
                <span class="caption">${movie.original_title}</span>
            </div>
        `;
        
      })
      $("#movies").html(display);
    })
};

