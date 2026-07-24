document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search-input");
    const songsContainer = document.getElementById("songs-container");
    const genreButtons = document.querySelectorAll(".genre-filter");

    if (!searchInput || !songsContainer) {
        return;
    }

    const filters = {
        search: searchInput.value.trim(),
        genre: "",
    };

    let debounceTimer;

    searchInput.addEventListener("input", () => {
        clearTimeout(debounceTimer);

        debounceTimer = setTimeout(() => {
            filters.search = searchInput.value.trim();
            fetchSongs();
        }, 300);
    });

    genreButtons.forEach((button) => {
        button.addEventListener("click", () => {
            filters.genre = button.dataset.genre || "";

            updateActiveGenre(button);

            fetchSongs();
        });
    });

    async function fetchSongs() {
        try {
            const params = new URLSearchParams({
                search: filters.search,
                genre: filters.genre,
            });

            const response = await fetch(`/search/?${params.toString()}`, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                },
            });

            if (!response.ok) {
                throw new Error(`Search request failed (${response.status}).`);
            }

            const data = await response.json();

            renderSongs(data.songs || []);
        } catch (error) {
            console.error("Song search failed:", error);

            songsContainer.innerHTML = `
                <div class="col-12 text-center py-5">
                    <h3>Unable to load songs</h3>
                    <p class="text-muted">
                        Please try again in a moment.
                    </p>
                </div>
            `;
        }
    }

    function updateActiveGenre(activeButton) {
        genreButtons.forEach((button) => {
            button.classList.remove("btn-primary");
            button.classList.add("btn-outline-light");
        });

        activeButton.classList.remove("btn-outline-light");
        activeButton.classList.add("btn-primary");
    }

    function renderSongs(songs) {
        if (songs.length === 0) {
            songsContainer.innerHTML = `
                <div class="col-12 text-center py-5">
                    <h3>No songs found 🎵</h3>
                    <p class="text-muted">
                        Try another search or genre.
                    </p>
                </div>
            `;
            return;
        }

        const html = songs
            .map(
                (song) => `
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

                                    <audio controls preload="metadata" class="w-100">
                                        <source src="${song.audio_file}">
                                        Your browser does not support the audio element.
                                    </audio>
                                </div>
                            </article>
                        </a>
                    </div>
                `
            )
            .join("");

        songsContainer.innerHTML = html;

        if (typeof window.initializeAudioPlayers === "function") {
            window.initializeAudioPlayers();
        }
    }
});