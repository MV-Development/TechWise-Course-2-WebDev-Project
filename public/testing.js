const example = 11;
var TMDBToken = "46eb4bee79974ac4c17249b988d15fb8";
const baseURL = "https://api.themoviedb.org/3";

let movieID;

function getMovie(callback) {
    fetch(baseURL + `/mivie{movie_id}`)
        .then((res) => res.json())
        .then((data) => {
            callback(data)
        });
}

getMovie((data) => movieID = data.movie_id);

function getConfiguration(api_key) {
    https://api.themoviedb.org/3/configuration?api_key=<<api_key>>
}