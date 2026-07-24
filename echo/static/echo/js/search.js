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
        songsContainer.classList.add("loading");

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

            const { songs = [] } = await response.json();

            renderSongs(songs);
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
        } finally {
            songsContainer.classList.remove("loading");
        }
    }

    function updateActiveGenre(activeButton) {
        genreButtons.forEach((button) => {
            const isActive = button === activeButton;

            button.classList.toggle("btn-primary", isActive);
            button.classList.toggle("btn-outline-light", !isActive);
            button.classList.toggle("active", isActive);

            button.setAttribute("aria-pressed", String(isActive));
        });
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

        songsContainer.innerHTML = songs
            .map(
                (song) => `
                    <div class="col-md-4">
                        <a
                            href="/song/${song.id}/"
                            class="text-decoration-none text-white"
                            aria-label="View ${escapeHtml(song.title)}"
                        >
                            <article class="music-card h-100">

                                <img
                                    src="${song.cover_image}"
                                    alt="${escapeHtml(song.title)} cover"
                                    class="img-fluid"
                                    loading="lazy"
                                >

                                <div class="p-3">

                                    <h4>${escapeHtml(song.title)}</h4>

                                    <p class="mb-1 text-muted">
                                        ${escapeHtml(song.artist)}
                                    </p>

                                    <p>${escapeHtml(song.genre)}</p>

                                    <audio
                                        controls
                                        preload="metadata"
                                        class="w-100"
                                    >
                                        <source
                                            src="${song.audio_file}"
                                            type="audio/mpeg"
                                        >
                                        Your browser does not support the audio element.
                                    </audio>

                                </div>

                            </article>
                        </a>
                    </div>
                `
            )
            .join("");

        if (typeof window.initializeAudioPlayers === "function") {
            window.initializeAudioPlayers();
        }
    }

    function escapeHtml(value) {
        const div = document.createElement("div");
        div.textContent = value ?? "";
        return div.innerHTML;
    }
});