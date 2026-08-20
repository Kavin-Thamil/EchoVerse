function initSearch() {
    const searchInput = document.getElementById("search-input");
    const clearSearchBtn = document.getElementById("clear-search-btn");
    const songsContainer = document.getElementById("songs-container");
    const genreButtons = document.querySelectorAll(".genre-filter");

    // Guard clauses and Turbo double-binding prevention
    if (!searchInput || !songsContainer || searchInput.dataset.initialized) return;
    
    searchInput.dataset.initialized = "true";

    let debounceTimer;
    const filters = {
        search: searchInput.value.trim(),
        genre: "",
    };

    // Check active genre on load
    genreButtons.forEach((btn) => {
        if (btn.classList.contains("active")) {
            filters.genre = btn.dataset.genre || "";
        }
    });

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.trim();
        
        if (clearSearchBtn) {
            if (query.length > 0) {
                clearSearchBtn.classList.remove("d-none");
            } else {
                clearSearchBtn.classList.add("d-none");
            }
        }

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            filters.search = query;
            fetchSongs();
        }, 300);
    });

    if (clearSearchBtn) {
        clearSearchBtn.addEventListener("click", () => {
            searchInput.value = "";
            filters.search = "";
            clearSearchBtn.classList.add("d-none");
            searchInput.focus();
            fetchSongs();
        });
    }

    genreButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            filters.genre = btn.dataset.genre || "";
            updateActiveGenre(btn);
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

            const res = await fetch(`/search/?${params.toString()}`, {
                headers: { "X-Requested-With": "XMLHttpRequest" },
            });

            if (!res.ok) throw new Error(`Search request failed (${res.status}).`);

            const { songs = [] } = await res.json();
            renderSongs(songs);
            
        } catch (err) {
            console.error("Song search failed:", err);
            songsContainer.innerHTML = `
                <div class="col-12 text-center py-5">
                    <h3>Unable to load songs</h3>
                    <p class="text-muted">Please try again in a moment.</p>
                </div>
            `;
        } finally {
            songsContainer.classList.remove("loading");
        }
    }

    function updateActiveGenre(activeBtn) {
        genreButtons.forEach((btn) => {
            const isActive = btn === activeBtn;
            btn.classList.toggle("btn-primary", isActive);
            btn.classList.toggle("btn-outline-light", !isActive);
            btn.classList.toggle("active", isActive);
            btn.setAttribute("aria-pressed", String(isActive));
        });
    }

    function renderSongs(songs) {
        if (songs.length === 0) {
            songsContainer.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="auth-card mx-auto p-5" style="max-width: 480px;">
                        <h4 class="fw-bold mb-2 text-white">No tracks found 🎵</h4>
                        <p class="text-muted mb-0">
                            We couldn't find anything matching your search. Try another term or reset your filters.
                        </p>
                    </div>
                </div>
            `;
            return;
        }

        songsContainer.innerHTML = songs.map(song => `
            <div class="col-sm-6 col-lg-4 col-xl-3">
                <article class="music-card h-100 d-flex flex-column position-relative shadow-sm"
                    data-audio-url="${song.audio_file}"
                    data-title="${escapeHtml(song.title)}"
                    data-artist="${escapeHtml(song.artist)}"
                    data-cover-url="${song.cover_image}">
                    
                    <div class="position-relative overflow-hidden">
                        <img src="${song.cover_image}" alt="${escapeHtml(song.title)} cover" class="img-fluid w-100 song-card-img" loading="lazy">
                        <div class="position-absolute top-0 end-0 m-3 z-2">
                            <span class="card-play-badge d-flex align-items-center justify-content-center rounded-circle shadow-lg"
                                  style="width: 42px; height: 42px; background: rgba(15, 15, 15, 0.75); border: 2px solid #7c4dff; color: #ffffff; backdrop-filter: blur(4px);">
                                ▶
                            </span>
                        </div>
                    </div>

                    <div class="p-3 d-flex flex-column flex-grow-1">
                        <a href="/song/${song.id}/" class="text-decoration-none text-white text-truncate mb-1 fw-bold fs-5 card-title-link" title="${escapeHtml(song.title)}">
                            ${escapeHtml(song.title)}
                        </a>
                        
                        <p class="text-muted small text-truncate mb-3" title="${escapeHtml(song.artist)}">
                            By ${escapeHtml(song.artist)}
                        </p>
                        
                        <div class="d-flex align-items-center justify-content-between mt-auto pt-2 border-top border-secondary border-opacity-10">
                            <span class="badge small px-3 py-1 rounded-pill card-genre-badge text-truncate" style="max-width: 65%;" title="${escapeHtml(song.genre)}">
                                ${escapeHtml(song.genre).split(",")[0]}
                            </span>
                            <small class="text-muted">
                                Fav: ${song.favorites_count ?? 0}
                            </small>
                        </div>
                    </div>
                </article>
            </div>
        `).join("");
    }

    function escapeHtml(val) {
        const div = document.createElement("div");
        div.textContent = val ?? "";
        return div.innerHTML;
    }
}

document.addEventListener("DOMContentLoaded", initSearch);
document.addEventListener("turbo:load", initSearch);