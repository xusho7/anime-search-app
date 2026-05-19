
// When clicked "Search" button

function searchAnime(){
    let input = document.getElementById("searchInput").value;
    let result = document.getElementById("result");

    result.innerText = "You searched for: " + input;
}
