var APIKey = '46eb4bee79974ac4c17249b988d15fb8';
const baseURL = "https://api.themoviedb.org/3";


let requestToken;
function getRequestToken(callback) {
    fetch(`${baseURL}/authentication/token/new?api_key=${APIKey}`)
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            callback(data);
        });
}

getRequestToken((data) => (requestToken = data.request_token));
console.log(requestToken);


let guestSessionToken;
function getGuestSessionToken(callback) {
    fetch(`${baseURL}/authentication/guest_session/new?api_key=${APIKey}`)
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            callback(data);
        });
}

getGuestSessionToken((data) => (guestSessionToken = data.guest_session_id));
console.log(guestSessionToken);
