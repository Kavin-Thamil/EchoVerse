// Global Audio Player Controller

document.addEventListener("click", function(e) {
    const card = e.target.closest(".music-card");
    const playBtn = e.target.closest(".play-btn");
    const triggerEl = card || playBtn;
    
    if (triggerEl) {
        if (e.target.closest(".card-title-link")) return;

        e.preventDefault();

        const playerBar = document.getElementById("sticky-music-player");
        const audio = document.getElementById("global-audio-element");
        const playPauseBtn = document.getElementById("sticky-play-pause-btn");
        const coverImg = document.getElementById("sticky-player-cover");
        const titleEl = document.getElementById("sticky-player-title");
        const artistEl = document.getElementById("sticky-player-artist");

        if (!playerBar || !audio) return;

        const audioUrl = triggerEl.getAttribute("data-audio-url");
        const title = triggerEl.getAttribute("data-title");
        const artist = triggerEl.getAttribute("data-artist");
        const coverUrl = triggerEl.getAttribute("data-cover-url");

        if (!audioUrl) return;

        const currentSrc = audio.dataset.originalSrc || "";

        // Toggle play/pause if clicking the same song
        if (currentSrc === audioUrl) {
            if (audio.paused) {
                audio.play().catch(err => console.error("Playback failed:", err));
                if (playPauseBtn) playPauseBtn.textContent = "⏸";
            } else {
                audio.pause();
                if (playPauseBtn) playPauseBtn.textContent = "▶";
            }
            updatePlayerState();
            return;
        }

        // Load new song data
        if (titleEl) titleEl.textContent = title;
        if (artistEl) artistEl.textContent = artist;
        if (coverImg) coverImg.src = coverUrl;

        playerBar.classList.remove("d-none");
        if (playPauseBtn) playPauseBtn.textContent = "⏳";
        
        audio.dataset.originalSrc = audioUrl;

        // Fetch as Blob to bypass Django runserver's lack of HTTP Range support (fixes seeking)
        fetch(audioUrl)
            .then(res => res.blob())
            .then(blob => {
                // Bail if user clicked another song while downloading
                if (audio.dataset.originalSrc !== audioUrl) return;

                audio.src = URL.createObjectURL(blob);
                audio.load();
                audio.play().then(() => {
                    if (playPauseBtn) playPauseBtn.textContent = "⏸";
                    updatePlayerState();
                }).catch(err => console.error("Playback failed:", err));
            })
            .catch(err => {
                console.error("Blob fetch failed, falling back to stream:", err);
                audio.src = audioUrl;
                audio.load();
                audio.play();
            });
        
        updatePlayerState();
        return;
    }

    // Handle closing the player
    const closeBtn = e.target.closest("#close-player-btn");
    if (closeBtn) {
        const playerBar = document.getElementById("sticky-music-player");
        const audio = document.getElementById("global-audio-element");

        if (audio) {
            audio.pause();
            audio.src = "";
            audio.dataset.originalSrc = "";
        }
        
        if (playerBar) {
            playerBar.classList.add("d-none");
        }

        updatePlayerState();
    }
});

function updateSliderFill(slider) {
    if (!slider) return;
    const value = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.background = `linear-gradient(to right, #7c4dff ${value}%, #2a2a2a ${value}%)`;
}

function initAudioPlayer() {
    const audio = document.getElementById("global-audio-element");
    const playPauseBtn = document.getElementById("sticky-play-pause-btn");
    const seekSlider = document.getElementById("seek-slider");
    const volumeSlider = document.getElementById("volume-slider");
    const currentTimeEl = document.getElementById("current-time");
    const totalDurationEl = document.getElementById("total-duration");

    if (!audio) return;

    let isDragging = false;

    function formatTime(seconds) {
        if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    if (playPauseBtn) {
        playPauseBtn.onclick = () => {
            if (audio.paused) {
                audio.play().catch(err => console.log(err));
            } else {
                audio.pause();
            }
        };
    }

    audio.ontimeupdate = () => {
        if (!isNaN(audio.duration) && isFinite(audio.duration) && seekSlider && !isDragging) {
            const progressPercent = (audio.currentTime / audio.duration) * 100;
            seekSlider.value = progressPercent;
            updateSliderFill(seekSlider);
            if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
            if (totalDurationEl) totalDurationEl.textContent = formatTime(audio.duration);
        }
    };

    audio.onloadedmetadata = () => {
        if (totalDurationEl && isFinite(audio.duration)) {
            totalDurationEl.textContent = formatTime(audio.duration);
        }
        if (volumeSlider) updateSliderFill(volumeSlider);
    };

    if (seekSlider) {
        seekSlider.oninput = () => {
            isDragging = true;
            if (!isNaN(audio.duration) && isFinite(audio.duration)) {
                const seekTime = (seekSlider.value / 100) * audio.duration;
                if (currentTimeEl) currentTimeEl.textContent = formatTime(seekTime);
                updateSliderFill(seekSlider);
            }
        };

        seekSlider.onchange = () => {
            if (!isNaN(audio.duration) && isFinite(audio.duration)) {
                audio.currentTime = (seekSlider.value / 100) * audio.duration;
            }
            // Small delay so slider doesn't bounce back while audio seeks
            setTimeout(() => {
                isDragging = false;
            }, 50);
        };
    }

    if (volumeSlider) {
        updateSliderFill(volumeSlider);
        volumeSlider.oninput = () => {
            audio.volume = volumeSlider.value;
            updateSliderFill(volumeSlider);
        };
    }

    audio.onplay = () => {
        if (playPauseBtn) playPauseBtn.textContent = "⏸";
        updatePlayerState();
    };

    audio.onpause = () => {
        if (playPauseBtn) playPauseBtn.textContent = "▶";
        updatePlayerState();
    };

    audio.onended = () => {
        if (playPauseBtn) playPauseBtn.textContent = "▶";
        updatePlayerState();
    };
}

// Spacebar play/pause shortcut
document.addEventListener("keydown", function(e) {
    if (e.code === "Space") {
        const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : "";
        if (activeTag === "input" || activeTag === "textarea" || activeTag === "select") return;

        const audio = document.getElementById("global-audio-element");
        const playerBar = document.getElementById("sticky-music-player");

        if (audio && playerBar && !playerBar.classList.contains("d-none")) {
            e.preventDefault();
            audio.paused ? audio.play().catch(err => console.log(err)) : audio.pause();
        }
    }
});

document.addEventListener("DOMContentLoaded", () => {
    initAudioPlayer();
    updatePlayerState();
});

document.addEventListener("turbo:load", () => {
    initAudioPlayer();
    updatePlayerState();
});

function updatePlayerState() {
    const audio = document.getElementById("global-audio-element");
    const equalizer = document.getElementById("audio-equalizer");
    if (!audio) return;

    const originalSrc = audio.dataset.originalSrc || "";
    const isPlaying = !audio.paused && audio.src !== "";

    if (equalizer) {
        if (isPlaying) {
            equalizer.classList.remove("d-none");
            equalizer.classList.add("d-flex", "active");
        } else {
            equalizer.classList.remove("active", "d-flex");
            equalizer.classList.add("d-none");
        }
    }

    // Sync play/pause icons on all music cards
    document.querySelectorAll(".music-card").forEach((card) => {
        const cardUrl = card.getAttribute("data-audio-url");
        const badge = card.querySelector(".card-play-badge");
        if (!cardUrl || !badge) return;

        if (originalSrc === cardUrl && isPlaying) {
            badge.textContent = "⏸";
            card.classList.add("isPlaying-card");
        } else {
            badge.textContent = "▶";
            card.classList.remove("isPlaying-card");
        }
    });
}