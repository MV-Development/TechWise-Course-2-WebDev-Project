const example = 11;
var APIKey = '46eb4bee79974ac4c17249b988d15fb8';
const baseURL = "https://api.themoviedb.org/3";

let sessionToken;

function getSessionToken(callback) {
    return fetch(`${baseURL}/authentication/token/new?api_key=${APIKey}`)
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            callback(data);
        });
}

getSessionToken((data) => (sessionToken = data.request_token));

console.log(sessionToken);


