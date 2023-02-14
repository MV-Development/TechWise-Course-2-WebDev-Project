var APIKey = '46eb4bee79974ac4c17249b988d15fb8';
const baseURL = "https://api.themoviedb.org/3";
let sessionToken;

const SearchButton = document.querySelector('#search_button');
const SearchBox = document.querySelector('#search_box');
const content= document.querySelector('#content');

function removeChildren(domNode) {
    while (domNode.firstChild) {
        domNode.removeChild(domNode.firstChild);
    }
}





let result;
let query;



function getResults(callback) {
    return fetch(`${baseURL}/search/movie?api_key=${APIKey}&query=${query}`)
        .then((res) => res.json())
        .then((data) =>
            callback(data)
        );
}



function populateSearchResults() {
    removeChildren(content);
    getResults((data) => {
        (result = data)
        for (let key in result) {
            console.log(key, result[key])
            for (movie in result[key]) {
                //for (info in movie)
                {
                    let title = document.createElement("li");
                    title.innerText = movie["original_title"];
                    content.appendChild(title);
                }
            } 
        }
    });
};



SearchButton.addEventListener("click", () => {
    let input = SearchBox.value.split(" ");
    query = ``;
    for (index in input) {
        query += input[index] + `+`
    }
    populateSearchResults()
});
