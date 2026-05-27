// Runs when user clicks Search or presses Enter
async function searchAnime() {

    const input = document.getElementById("searchInput").value;

    const result = document.getElementById("result");

    if (input.trim() === "") {
        result.innerHTML = "<p>Please type something 👀</p>";
        return; 
    }

    result.innerHTML = "<p>Searching anime... ⏳</p>";

    try {
    
    const response = await fetch(`https://api.jikan.moe/v4/anime?q=${input}`);

    let data = await response.json();
    console.log(data);

    let animeList = data.data;

    if (!animeList || animeList.length === 0) {
        result.innerHTML = "<p>No anime found 😢</p>";
        return;
    }

    // Convert anime list into HTML cards and display them
    result.innerHTML = animeList.map(anime => `
    <div class="anime-card">
        <img src="${anime.images.jpg.image_url}" />

        <h3>${anime.title}</h3>

        <p>⭐ Score: ${anime.score || "N/A"}</p>

        <p>🎬 Episodes: ${anime.episodes || "?"}</p>

        <p>📅 Year: ${anime.year || "Unknown"}</p>

        <p>📺 Status: ${anime.status || "Unknown"}</p>

        <p class="synopsis">
            ${anime.synopsis?.slice(0, 250) || "No synopsis available"}...
        </p>

        <button 
            class="read-more-btn"
            data-full="${anime.synopsis || "No synopsis available"}">
            Read More
        </button>
    </div>
`).join("");

const buttons = document.querySelectorAll(".read-more-btn");

buttons.forEach(button => {

    button.addEventListener("click", function() {

        const fullSynopsis = button.dataset.full;

        const synopsisParagraph =
            button.parentElement.querySelector(".synopsis");

        synopsisParagraph.innerHTML = fullSynopsis;
    });
});
} catch (error) {
    console.log(error);

    result.innerHTML = `
        <p>something went wrong 😢</p>
    `;
}
}

document.getElementById("searchInput")
.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        searchAnime(); 
    }
});

