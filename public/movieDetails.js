var APIKey = '46eb4bee79974ac4c17249b988d15fb8';
const baseURL = "https://api.themoviedb.org/3";
let sessionToken;

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


const movieInfoSection = document.querySelector('#movieInfo');
let movieInfo;
function getMovieDetails(callback) {
    return fetch(`${baseURL}/movie/${movie_id}?api_key=${APIKey}&language=en-US`)
        .then((res) => res.json())
        .then((data) => 
            callback(data)
        );}





function clearDetails(domNode) {
    while (domNode.firstChild) {
        domNode.removeChild(domNode.firstChild);
    }
}




function populateMovieDetails(movie_id) {
    getMovieDetails((data) => {
    (movieInfo = data)
        clearDetails(movieInfoSection);
        for (let info in movieInfo) {
            information = document.createElement("li");
//            console.log(movieInfo[info]);
            information.innerText = info + ": "  + movieInfo[info];
            movieInfoSection.appendChild(information);
        }
    });
};



let movie_id = '667538';

populateMovieDetails(movie_id);
