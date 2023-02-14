const APIKey = '46eb4bee79974ac4c17249b988d15fb8';
const baseURL = "https://api.themoviedb.org/3";
let sessionToken;

const movieInfoSection = document.querySelector('#results');

function clearResults(domNode) {
    while (domNode.firstChild) {
        domNode.removeChild(domNode.firstChild);
    }
}
