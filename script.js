// Runs when user clicks Search or presses Enter
async function searchAnime() {

    // Get what user typed in the input box
    let input = document.getElementById("searchInput").value;

    // Get the area where results will be shown
    let result = document.getElementById("result");

    // Stop if input is empty or just spaces
    if (input.trim() === "") {
        result.innerHTML = "<p>Please type something 👀</p>";
        return; // stops function here
    }

    // Show loading message while waiting for API
    result.innerHTML = "<p>Searching anime... ⏳</p>";

    // Fetch anime data from API using user input
    let response = await fetch(`https://api.jikan.moe/v4/anime?q=${input}`);

    // Convert API response into usable JavaScript object
    let data = await response.json();

    // Extract anime list from API response
    let animeList = data.data;

    // If API returns nothing or empty list
    if (!animeList || animeList.length === 0) {
        result.innerHTML = "<p>No anime found 😢</p>";
        return;
    }

    // Convert anime list into HTML cards and display them
    result.innerHTML = animeList.map(anime => `
        <div class="anime-card">
            <img src="${anime.images.jpg.image_url}" width="120">
            <p>${anime.title}</p>
        </div>
    `).join("");
}

// Allow user to press Enter instead of clicking button
document.getElementById("searchInput")
.addEventListener("keydown", function(event) {

    // If Enter key is pressed
    if (event.key === "Enter") {
        searchAnime(); // run search function
    }
});

