/**
 * Global Audio Player Controller
 * Handles card-wide clicks, explicit play buttons, spacebar shortcut, equalizer animation, and Turbo navigation.
 */

document.addEventListener("click", function(e) {
    const card = e.target.closest(".music-card");
    const playBtn = e.target.closest(".play-btn");
    
    const triggerEl = card || playBtn;
    
    if (triggerEl) {
        if (e.target.closest(".card-title-link")) {
            return;
        }

        e.preventDefault();

        const globalPlayerBar = document.getElementById("global-player-bar");
        const globalAudio = document.getElementById("global-audio-element");
        const globalSource = document.getElementById("global-audio-source");
        const coverImg = document.getElementById("global-player-cover");
        const titleEl = document.getElementById("global-player-title");
        const artistEl = document.getElementById("global-player-artist");

        if (!globalPlayerBar) return;

        const audioUrl = triggerEl.getAttribute("data-audio-url");
        const title = triggerEl.getAttribute("data-title");
        const artist = triggerEl.getAttribute("data-artist");
        const coverUrl = triggerEl.getAttribute("data-cover-url");

        if (!audioUrl) return;

        const currentPath = globalSource.src ? new URL(globalSource.src, window.location.origin).pathname : "";
        const targetPath = new URL(audioUrl, window.location.origin).pathname;

        if (currentPath === targetPath && currentPath !== "") {
            if (globalAudio.paused) {
                globalAudio.play().catch(error => console.error("Playback failed:", error));
            } else {
                globalAudio.pause();
            }
            updateCardStates();
            return;
        }

        titleEl.textContent = title;
        artistEl.textContent = artist;
        coverImg.src = coverUrl;

        globalSource.src = audioUrl;
        globalAudio.load();
        
        globalPlayerBar.classList.remove("d-none");
        globalPlayerBar.classList.add("d-block");

        globalAudio.play().catch(error => {
            console.error("Audio playback failed:", error);
        });
        
        updateCardStates();
        return;
    }

    const closeBtn = e.target.closest("#close-global-player");
    if (closeBtn) {
        const globalPlayerBar = document.getElementById("global-player-bar");
        const globalAudio = document.getElementById("global-audio-element");
        const globalSource = document.getElementById("global-audio-source");

        if (globalAudio) {
            globalAudio.pause();
            globalSource.src = "";
        }
        
        if (globalPlayerBar) {
            globalPlayerBar.classList.add("d-none");
        }

        updateCardStates();
    }
});

// Global Spacebar Shortcut for Play/Pause
document.addEventListener("keydown", function(e) {
    if (e.code === "Space") {
        const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : "";
        if (activeTag === "input" || activeTag === "textarea" || activeTag === "select") {
            return;
        }

        const globalAudio = document.getElementById("global-audio-element");
        const globalPlayerBar = document.getElementById("global-player-bar");

        if (globalAudio && globalPlayerBar && !globalPlayerBar.classList.contains("d-none")) {
            e.preventDefault();
            if (globalAudio.paused) {
                globalAudio.play().catch(err => console.log(err));
            } else {
                globalAudio.pause();
            }
        }
    }
});

document.addEventListener("DOMContentLoaded", initCardStateSync);
document.addEventListener("turbo:load", initCardStateSync);

function initCardStateSync() {
    const globalAudio = document.getElementById("global-audio-element");
    if (!globalAudio) return;

    globalAudio.removeEventListener("play", updateCardStates);
    globalAudio.removeEventListener("pause", updateCardStates);
    globalAudio.removeEventListener("ended", updateCardStates);

    globalAudio.addEventListener("play", updateCardStates);
    globalAudio.addEventListener("pause", updateCardStates);
    globalAudio.addEventListener("ended", updateCardStates);

    updateCardStates();
}

function updateCardStates() {
    const globalSource = document.getElementById("global-audio-source");
    const globalAudio = document.getElementById("global-audio-element");
    const equalizer = document.getElementById("audio-equalizer");
    if (!globalAudio) return;

    const currentSrc = globalSource ? globalSource.src : "";
    const isPlaying = !globalAudio.paused && currentSrc !== "";

    if (equalizer) {
        if (isPlaying) {
            equalizer.classList.remove("d-none");
            equalizer.classList.add("d-flex", "active");
        } else {
            equalizer.classList.remove("active", "d-flex");
            equalizer.classList.add("d-none");
        }
    }

    document.querySelectorAll(".music-card").forEach((card) => {
        const cardUrl = card.getAttribute("data-audio-url");
        const badge = card.querySelector(".card-play-badge");
        if (!cardUrl || !badge) return;

        const cardPath = new URL(cardUrl, window.location.origin).pathname;
        const activePath = currentSrc ? new URL(currentSrc, window.location.origin).pathname : "";

        if (activePath === cardPath && isPlaying) {
            badge.textContent = "⏸";
            card.classList.add("isPlaying-card");
        } else {
            badge.textContent = "▶";
            card.classList.remove("isPlaying-card");
        }
    });
}