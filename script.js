const audioPlayer = document.getElementById('audioPlayer');
const audioInfo = document.getElementById('audioInfo');
const playlist = document.getElementById('playlist');
const fileInput = document.getElementById('fileInput');
const loopSingleBtn = document.getElementById('loopSingle');
const loopPlaylistBtn = document.getElementById('loopPlaylist');
const timerInput = document.getElementById('timerInput');
const setTimerBtn = document.getElementById('setTimer');
const timerCountdown = document.getElementById('timerCountdown');

let songs = [];
let currentSongIndex = 0;
let isLoopSingle = false;
let isLoopPlaylist = false;
let timer;
let countdownInterval;

fileInput.addEventListener('change', (e) => {
    const files = e.target.files;
    songs = Array.from(files);
    updatePlaylist();
    if (songs.length > 0) {
        playSong(0);
    }
});

function updatePlaylist() {
    playlist.innerHTML = '';
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.textContent = song.name;
        li.addEventListener('click', () => playSong(index));
        playlist.appendChild(li);
    });
}

async function playSong(index) {
    currentSongIndex = index;
    const song = songs[currentSongIndex];
    const fileURL = URL.createObjectURL(song);
    
    audioInfo.innerHTML = `
        <p>File name: ${song.name}</p>
        <p>File size: ${(song.size / (1024 * 1024)).toFixed(2)} MB</p>
        <p>File type: ${song.type}</p>
    `;

    audioPlayer.src = fileURL;
    audioPlayer.load(); // Explicitly load the audio

    try {
        await audioPlayer.play();
        console.log("Playback started successfully");
    } catch (e) {
        console.error("Playback failed:", e);
        audioInfo.innerHTML += `<p>Error: ${e.message}</p>`;
    }
    updatePlayingStatus();
}

audioPlayer.addEventListener('canplay', () => {
    console.log("Audio can start playing");
});

audioPlayer.addEventListener('waiting', () => {
    console.log("Audio is waiting for more data");
});

audioPlayer.addEventListener('error', (e) => {
    console.error("Audio error:", e);
    audioInfo.innerHTML += `<p>Audio error: ${audioPlayer.error.message}</p>`;
});

function updatePlayingStatus() {
    const items = playlist.getElementsByTagName('li');
    for (let i = 0; i < items.length; i++) {
        items[i].classList.remove('playing');
    }
    items[currentSongIndex].classList.add('playing');
}

audioPlayer.addEventListener('ended', () => {
    if (isLoopSingle) {
        audioPlayer.currentTime = 0;
        audioPlayer.play().catch(e => console.error("Playback failed:", e));
    } else if (isLoopPlaylist) {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        playSong(currentSongIndex);
    } else if (currentSongIndex < songs.length - 1) {
        currentSongIndex++;
        playSong(currentSongIndex);
    }
});

loopSingleBtn.addEventListener('click', () => {
    isLoopSingle = !isLoopSingle;
    isLoopPlaylist = false;
    loopSingleBtn.style.backgroundColor = isLoopSingle ? 'lightblue' : '';
    loopPlaylistBtn.style.backgroundColor = '';
});

loopPlaylistBtn.addEventListener('click', () => {
    isLoopPlaylist = !isLoopPlaylist;
    isLoopSingle = false;
    loopPlaylistBtn.style.backgroundColor = isLoopPlaylist ? 'lightblue' : '';
    loopSingleBtn.style.backgroundColor = '';
});

setTimerBtn.addEventListener('click', () => {
    const seconds = parseInt(timerInput.value);
    if (seconds > 0) {
        clearTimeout(timer);
        clearInterval(countdownInterval);
        
        let remainingTime = seconds;
        updateCountdownDisplay(remainingTime);
        
        countdownInterval = setInterval(() => {
            remainingTime--;
            updateCountdownDisplay(remainingTime);
            
            if (remainingTime <= 0) {
                clearInterval(countdownInterval);
            }
        }, 1000);
        
        timer = setTimeout(() => {
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
            clearInterval(countdownInterval);
            updateCountdownDisplay(0);
        }, seconds * 1000);
    }
});

function updateCountdownDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    timerCountdown.textContent = `Time remaining: ${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}