var APIKEY = "3ce534b5cb32c55ec594d1642b08ac7d";
const baseURL = "https://api.themoviedb.org/3";
let sessionToken;

function getSessionToken(API_KEY) {
    return `https://api.themoviedb.org/3/authentication/session/new?api_key=${APIKEY}`
}

sessionToken = getSessionToken(APIKEY);

document.getElementById("session-token").innerHTML = sessionToken;
