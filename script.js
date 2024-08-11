const audioPlayer = document.getElementById('audioPlayer');
const playlist = document.getElementById('playlist');
const fileInput = document.getElementById('fileInput');
const loopSingleBtn = document.getElementById('loopSingle');
const loopPlaylistBtn = document.getElementById('loopPlaylist');
const timerInput = document.getElementById('timerInput');
const setTimerBtn = document.getElementById('setTimer');

let songs = [];
let currentSongIndex = 0;
let isLoopSingle = false;
let isLoopPlaylist = false;
let timer;

fileInput.addEventListener('change', (e) => {
    const files = e.target.files;
    songs = Array.from(files);
    updatePlaylist();
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

function playSong(index) {
    currentSongIndex = index;
    const song = songs[currentSongIndex];
    audioPlayer.src = URL.createObjectURL(song);
    audioPlayer.play();
    updatePlayingStatus();
}

function updatePlayingStatus() {
    const items = playlist.getElementsByTagName('li');
    for (let i = 0; i < items.length; i++) {
        items[i].classList.remove('playing');
    }
    items[currentSongIndex].classList.add('playing');
}

audioPlayer.addEventListener('ended', () => {
    if (isLoopSingle) {
        audioPlayer.play();
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
        timer = setTimeout(() => {
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
        }, seconds * 1000);
    }
});