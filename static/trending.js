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
      $(".posters").click(e => {
        getMovieDetails(e.target.dataset.value);
        document.getElementById("welcome-text").style.display = "none";
        document.getElementById("trending-text").style.display = "none";
      })
    })
};

function getMovieDetails(movie_id) {
    return fetch(`${baseURL}/movie/${movie_id}?api_key=${APIKey}&language=en-US`)
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
            let display = "";
            let movie = data;

            display += `
            <div class="selected-movie">
                <img class="poster" src="https://image.tmdb.org/t/p/w185_and_h278_bestv2${movie.poster_path}"><br>
                <span class="title">${movie.original_title}</span><br>
                <br>
                <span class="desc">${movie.overview}</span><br>
            </div>
            `
            $.each(movie.genres, (i, genre) => {
                display += `<span class="genre">${genre.name} </span></div>`
            })
            
            display += `<p> Recommendations</p>`
            
            getRecommendations(movie_id, display);

        }
    
        );

    };
        
function getRecommendations(movie_id, display) {
    return fetch(`${baseURL}/movie/${movie_id}/recommendations?api_key=${APIKey}&language=en-US`)
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
            let movie = data;
            $.each(movie.results, (i, names) => {
                if (i > 4) {
                    return false;
                } else {
                display += `
                <div class="rec-container">
                <img class="recposter" data-value="${names.id}" src="https://image.tmdb.org/t/p/w185_and_h278_bestv2${names.poster_path}"><br>
                <span class="recname">${names.original_title} </span>
                </div>`
                
                }
            }).slice(0, 5);
            $("#movies").html(display);
            $(".rec-container").click(e => {
                getMovieDetails(e.target.dataset.value);
              })
        });
        
        
}

