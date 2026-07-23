const searchInput = document.getElementById("search-input");
const songsContainer = document.getElementById("songs-container");

if (searchInput && songsContainer) {
    let debounceTimer;

    searchInput.addEventListener("input", () => {
        clearTimeout(debounceTimer);

        debounceTimer = setTimeout(async () => {
            const query = searchInput.value.trim();

            try {
                const response = await fetch(
                    `/search/?search=${encodeURIComponent(query)}`
                );

                if (!response.ok) {
                    throw new Error("Search request failed.");
                }

                const data = await response.json();

                renderSongs(data.songs);
            } catch (error) {
                console.error(error);
            }
        }, 300);
    });
}

function renderSongs(songs) {
    if (songs.length === 0) {
        songsContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <h3>No songs found 🎵</h3>
                <p class="text-muted">
                    Try another search.
                </p>
            </div>
        `;

        return;
    }

    let html = "";

    songs.forEach((song) => {
        html += `
            <div class="col-md-4">
                <a
                    href="/song/${song.id}/"
                    class="text-decoration-none text-white"
                >
                    <article class="music-card">

                        <img
                            src="${song.cover_image}"
                            alt="${song.title}"
                            class="img-fluid"
                        >

                        <div class="p-3">

                            <h4>${song.title}</h4>

                            <p>${song.genre}</p>

                            <audio controls class="w-100">
                                <source src="${song.audio_file}">
                                Your browser does not support the audio element.
                            </audio>

                        </div>

                    </article>
                </a>
            </div>
        `;
    });

    songsContainer.innerHTML = html;

    if (typeof initializeAudioPlayers === "function") {
        initializeAudioPlayers();
    }
}