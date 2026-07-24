let currentAudio = null;

function handleAudioPlay(event) {
    const playingAudio = event.currentTarget;

    if (currentAudio && currentAudio !== playingAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    currentAudio = playingAudio;
}

function handleAudioEnded(event) {
    if (currentAudio === event.currentTarget) {
        currentAudio = null;
    }
}

function initializeAudioPlayers() {
    const audioPlayers = document.querySelectorAll("audio");

    audioPlayers.forEach((audio) => {
        audio.removeEventListener("play", handleAudioPlay);
        audio.removeEventListener("ended", handleAudioEnded);

        audio.addEventListener("play", handleAudioPlay);
        audio.addEventListener("ended", handleAudioEnded);
    });
}

document.addEventListener("DOMContentLoaded", initializeAudioPlayers);

window.initializeAudioPlayers = initializeAudioPlayers;