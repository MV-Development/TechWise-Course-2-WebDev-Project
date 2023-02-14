var APIKey = '46eb4bee79974ac4c17249b988d15fb8';
const baseURL = "https://api.themoviedb.org/3";
let sessionToken;

const SearchButton = document.querySelector('#search_button');
const SearchBox = document.querySelector('#search_box');


function removeChildren(domNode) {
    while (domNode.firstChild) {
        domNode.removeChild(domNode.firstChild);
    }
}
