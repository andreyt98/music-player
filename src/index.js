import './main.scss'

const menu = document.querySelector(".aside");
const menuIcon = document.querySelector(".menu-icon");
const audioElement = document.getElementById("audio");

// PLAYLIST SECTION VARIABLES
const playlistItems = document.querySelectorAll(".playlist li");

// PLAYER SECTION VARIABLES
const currentSongName = document.querySelector("#title");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const currentAlbumImg = document.querySelector(".player__info img");
const bandName = document.querySelector(".band");
const progressBar = document.querySelector(".bar");
const progressThumb = document.querySelector(".bar__thumb");
const totalDuration = document.getElementById("duration");
const repeatBtn = document.querySelector(".repeat");
// -----------------------------------------------------

let isAudioPlaying = audioElement.classList.contains("active");

const songs = [
  {
    id: 1, 
    album:
      "https://upload.wikimedia.org/wikipedia/en/e/ed/Lamb_of_God_-_VII_Sturm_und_Drang.jpg",
    name: "Delusion Pandemic",
    src: `./assets/songs/DelusionPandemic.mp3`
  },
  {
    id: 2, 
    album: "https://upload.wikimedia.org/wikipedia/en/e/e0/LOG_Resolution.jpg",
    name: "Ghost Walking",
    src: `./assets/songs/GhostWalking.mp3`

  },
  {
    id: 3, 
    album:
      "https://upload.wikimedia.org/wikipedia/en/f/fc/Lamb_of_God_-_Lamb_of_God.jpg",
    name: "Checkmate",
    src: `./assets/songs/Checkmate.mp3`

  },
];

let ActiveSongIndex = 0;

function setActiveSongStyle(ActiveSongIndex){

  const isASongActive = document.querySelector('li.song-active')
  if(isASongActive){
    isASongActive.classList.remove('song-active')
  }
  // we use Arrayfrom because playlistItem is a nodeList which is an object that holds a collection of nodes of the DOM
  const newActiveSong = Array.from(playlistItems).find((item) => item.getAttribute("data-id") == ActiveSongIndex); 
  newActiveSong.classList.add('song-active')
}

playlistItems.forEach((item,index) => {

  if(index>0){

    item.addEventListener("click", function () {
      isAudioPlaying = true;
      const songClicked = songs.find((song) =>  song.id == item.getAttribute("data-id"))
      ActiveSongIndex = songClicked.id

      loadSongInfoToPlayer(ActiveSongIndex)
      playSong();
      setActiveSongStyle(ActiveSongIndex)

    });
  }
});

function loadSongInfoToPlayer(songIndex) {
 
  const song = songs[songIndex-1]
  audioElement.src = song.src
  currentAlbumImg.src = song.album
  currentAlbumImg.style.borderRadius = "10px";

  currentSongName.innerText = song.name;
  currentSongName.style.opacity = "1";

  bandName.style.opacity = "1";
}

function playSong() {
  audioElement.play();
  audioElement.classList.add("active")

  changeClasses(playBtn, "fa-pause","fa-play" )
}

function pauseSong() {
  audioElement.pause();

  changeClasses(playBtn, "fa-play", "fa-pause")
}

function changeClasses(element, classToAdd, classToDelete){
  element.classList.add(classToAdd);
  element.classList.remove(classToDelete);
}

function prevSong() {
  if (isAudioPlaying) {
    ActiveSongIndex--;

    if (ActiveSongIndex < 1) {
      ActiveSongIndex = songs.length;
    }

    loadSongInfoToPlayer(ActiveSongIndex)
    playSong();

    setActiveSongStyle(ActiveSongIndex)
  }
}
function nextSong() {
  if (isAudioPlaying) {
    ActiveSongIndex++;

    if (ActiveSongIndex > songs.length ) {
      ActiveSongIndex = 0;
    }

    loadSongInfoToPlayer(ActiveSongIndex)
    playSong();

    setActiveSongStyle(ActiveSongIndex)
  }
}


function progress(evt) {
  if (isAudioPlaying) {
    const { duration, currentTime } = evt.target;

    const progress = (currentTime / duration) * 100;

    progressThumb.style.width = `${progress}%`;

    let minutes = parseInt((audioElement.currentTime / 60) % 60);
    let seconds = parseInt(audioElement.currentTime % 60);

    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    totalDuration.textContent = `${minutes}:${seconds}`;
  }
}

function setProgress(evt) {
  const width = this.clientWidth;

  const clickX = evt.offsetX;

  const duration = audioElement.duration;

  audioElement.currentTime = (clickX / width) * duration;
}

menuIcon.addEventListener("click", () => menu.classList.toggle("aside-active"));


prevBtn.addEventListener("click", prevSong);

nextBtn.addEventListener("click", nextSong);

playBtn.addEventListener("click", () => {
  if (isAudioPlaying) {
    if (audioElement.paused) {
      playSong();
    } else {
      pauseSong();
    }
  }
});

audioElement.addEventListener("timeupdate", progress);

progressBar.addEventListener("click", setProgress);

audioElement.addEventListener("ended", () => {
  if (repeatBtn.classList.contains("repeat-active")) {
    audioElement.currentTime = 0;
    playSong();
  } else {
    nextSong();
  }
});

repeatBtn.addEventListener("click", () => {
  if (isAudioPlaying) {
    repeatBtn.classList.toggle("repeat-active");
  }
});

document.addEventListener('click', (evt) => {
  if (evt.target.classList.contains("link")) {
    evt.preventDefault();
  }
})

Array.from(playlistItems).forEach((element, index) => {
  if(index>0){
    element.setAttribute("data-id", index )
  }
});