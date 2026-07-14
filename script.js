// Escapes text so it can't break out of HTML
function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
}

// Runs when Search is clicked or Enter is pressed
async function searchAnime() {

    const input = document.getElementById("searchInput").value;
    const result = document.getElementById("result");

    if (input.trim() === "") {
        result.innerHTML = "<p>Please type something 👀</p>";
        return;
    }

    result.innerHTML = "<p>Searching anime... ⏳</p>";

    const query = `
    query ($search: String) {
      Page(page: 1, perPage: 10) {
        media(search: $search, type: ANIME) {
          title {
            romaji
            english
          }
          description(asHtml: false)
          episodes
          averageScore
          seasonYear
          status
          coverImage {
            large
          }
        }
      }
    }
    `;

    const variables = {
        search: input
    };

    try {

        const response = await fetch("https://graphql.anilist.co", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                query,
                variables
            })
        });

        if (!response.ok) {
            result.innerHTML = `<p>API Error (${response.status}) 😢</p>`;
            return;
        }

        const data = await response.json();

        const animeList = data.data.Page.media;

        if (!animeList || animeList.length === 0) {
            result.innerHTML = "<p>No anime found 😢</p>";
            return;
        }

        result.innerHTML = animeList.map(anime => {

            const title = escapeHTML(
                anime.title.english ||
                anime.title.romaji ||
                "Unknown Title"
            );

            const synopsis = escapeHTML(
                anime.description || "No synopsis available."
            );

            const shortSynopsis =
                synopsis.length > 250
                    ? synopsis.slice(0, 250) + "..."
                    : synopsis;

            return `
                <div class="anime-card">

                    <img
                        src="${anime.coverImage.large}"
                        alt="${title}"
                    >

                    <h3>${title}</h3>

                    <p>⭐ Score: ${anime.averageScore ?? "N/A"}</p>

                    <p>🎬 Episodes: ${anime.episodes ?? "?"}</p>

                    <p>📅 Year: ${anime.seasonYear ?? "Unknown"}</p>

                    <p>📺 Status: ${anime.status ?? "Unknown"}</p>

                    <p class="synopsis">${shortSynopsis}</p>

                    <button
                        class="read-more-btn"
                        data-full="${synopsis}">
                        Read More
                    </button>

                </div>
            `;

        }).join("");

        document.querySelectorAll(".read-more-btn").forEach(button => {

            button.addEventListener("click", function () {

                const synopsis = this.parentElement.querySelector(".synopsis");

                synopsis.innerHTML = this.dataset.full;

                this.remove();

            });

        });

    } catch (error) {

        console.error(error);

        result.innerHTML = `
            <p>Something went wrong 😢</p>
        `;

    }

}

// Press Enter to Search
document.getElementById("searchInput")
.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        searchAnime();
    }

});