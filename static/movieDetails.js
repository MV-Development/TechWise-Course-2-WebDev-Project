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
      searchMovies(search_text);
      e.preventDefault();
    });
  });

function searchMovies(search_text) {
    return fetch(`${baseURL}/search/movie?api_key=${APIKey}&language=en-US&query=` + search_text)
        .then((res) => res.json()) 
        .then((res) => {
            console.log(res)
        }
        );};

const movieInfoSection = document.querySelector('#movieInfo');
let movieInfo;
function getMovieDetails(callback) {
    return fetch(`${baseURL}/movie/${movie_id}?api_key=${APIKey}&language=en-US`)
        .then((res) => res.json())
        .then((data) => 
            callback(data)
        );};




/*function clearDetails(domNode) {
    while (domNode.firstChild) {
        domNode.removeChild(domNode.firstChild);
    }
}
*/



/*function populateMovieDetails(movie_id) {
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



let movie_id = '343611';

populateMovieDetails(movie_id);*/
