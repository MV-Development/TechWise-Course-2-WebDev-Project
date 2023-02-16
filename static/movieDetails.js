//CSS held in movies.css

var APIKey = '46eb4bee79974ac4c17249b988d15fb8';
const baseURL = "https://api.themoviedb.org/3";
let sessionToken;
let searchBar = document.getElementById("searchBar");
let movies = document.getElementById("movies");
/*
let requestToken;
function getRequestToken(callback) {
    return fetch(`${baseURL}/authentication/token/new?api_key=${APIKey}`)
        .then((res) => res.json())
        .then((data) => {
//            console.log(data);
            callback(data);
        });
}

getRequestToken((data) => {
    (requestToken = data.request_token)
    console.log(requestToken);
});



let guestSessionToken;
function getGuestSessionToken(callback) {
    return fetch(`${baseURL}/authentication/guest_session/new?api_key=${APIKey}`)
        .then((res) => res.json())
        .then((data) => {
//            console.log(data);
            callback(data);
        });
}

getGuestSessionToken((data) => {
    guestSessionToken = data.guest_session_id
    console.log(guestSessionToken);
});



*/
$(document).ready(() => {
    $("#searchBar").on("submit", e => {
      let search_text = $("#searchText").val();
      searchMovies(search_text, 1);
      e.preventDefault();
    });
  });

function searchMovies(search_text, page) {
    return fetch(`${baseURL}/search/movie?api_key=${APIKey}&language=en-US&query=${search_text}&page=${page}`)
        .then((res) => res.json()) 
        .then((data) => {
            console.log(data)
            let movies = data.results;
            let display = "";
            
            $.each(movies, (i, movie) => {
            display += `
            <div class="movie-container">
                <img class="posters" data-value="${movie.id}" src="https://image.tmdb.org/t/p/w185_and_h278_bestv2${movie.poster_path}" onerror="this.onerror=null; this.src='static/images/no-image-icon.png';">
                <span class="caption">${movie.original_title}</span>
            </div>
        `;
        
      });
      display += `<div class="movie-container" id="page-buttons">
      <button type="button" id="prev">Prev</button>
      <button type="button" id="next">Next</button>
      </div>`
      $("#movies").html(display);
      $(".posters").click(e => {
        getMovieDetails(e.target.dataset.value);
      })
      if (page > 1) {
        $("#prev").click(e => {
            searchMovies(search_text, page -= 1)
      })
    }
    if (page < data.total_pages) {
    $("#next").click(e => {
        searchMovies(search_text, page += 1)
    }
  )
}
 } );};

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
                <span class="desc">${movie.overview}</span><br>
            </div>
            `
            $.each(movie.genres, (i, genre) => {
                display += `<span class="genre">${genre.name} </span>`

            })
            
            
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



/*function clearDetails(domNode) {
    while (domNode.firstChild) {
        domNode.removeChild(domNode.firstChild);
    }
}
*/



function populateMovieDetails(movie_id) {
    getMovieDetails((data) => {
        (movieInfo = data)
        //clearDetails(movieInfoSection);

        title = document.createElement("li");
        title.innerText = movieInfo["original_title"];
        movieInfoSection.appendChild(title);

        releaseDate = document.createElement("li");
        releaseDate.innerText = movieInfo["release_date"];
        movieInfoSection.appendChild(releaseDate);

        image = document.createElement("li");
        image.style.height = `210px`;
        image.style.width = `150px`;
        image.setAttribute("src", fetch(`${baseURL}/movie/${movie_id}/images?${APIKey}&language=en-US`));
        movieInfoSection.appendChild(image);

        overview = document.createElement("li");
        overview.innerText = movieInfo["overview"];
        movieInfoSection.appendChild(overview);
    });
};

