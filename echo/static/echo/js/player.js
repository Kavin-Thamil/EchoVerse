let currentAudio = null;

function initializeAudioPlayers() {
    const audioPlayers = document.querySelectorAll("audio");

    audioPlayers.forEach((audio) => {
        audio.removeEventListener("play", handleAudioPlay);
        audio.addEventListener("play", handleAudioPlay);
    });
}

function handleAudioPlay(event) {
    const playingAudio = event.target;

    if (currentAudio && currentAudio !== playingAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    currentAudio = playingAudio;
}

document.addEventListener("DOMContentLoaded", () => {
    initializeAudioPlayers();
});

window.initializeAudioPlayers = initializeAudioPlayers;