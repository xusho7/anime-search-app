
// When clicked "Search" button

function searchAnime(){
    let input = document.getElementById("searchInput").value;
    let result = document.getElementById("result");

    result.innerText = "You searched for: " + input;
}

// When clicked "Search" button, fetch data from API and display results

async function searchAnime() {

    let input = document.getElementById("searchInput").value;

    let result = document.getElementById("result");

    result.innerHTML = "Please Wait...";

    let response = await fetch(`https://api.jikan.moe/v4/anime?q=${input}`);

    let data = await response.json();

    let animeList = data.data;

    result.innerHTML = "";

    animeList.map(anime => {

        result.innerHTML += `
            <p>${anime.title}</p>
        `;

    });

}
