import './main.scss'
const menuIcon = document.querySelector(".menu-icon");
const menu = document.querySelector(".aside");
const playlistItem = document.querySelectorAll(".playlist li");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const audio = document.getElementById("audio");
let isActive = audio.classList.contains("active");

const albumImg = document.querySelector(".player__info img");
const songPlaying = document.querySelector("#title");
const bandName = document.querySelector(".band");

const progressBar = document.querySelector(".bar");
const progressThumb = document.querySelector(".bar__thumb");
const totalDuration = document.getElementById("duration");

const repeatBtn = document.querySelector(".repeat");

const songs = [
  {
    album:
      "https://upload.wikimedia.org/wikipedia/en/e/ed/Lamb_of_God_-_VII_Sturm_und_Drang.jpg",
    name: "Delusion Pandemic",
  },
  {
    album: "https://upload.wikimedia.org/wikipedia/en/e/e0/LOG_Resolution.jpg",
    name: "Ghost Walking",
  },
  {
    album:
      "https://upload.wikimedia.org/wikipedia/en/f/fc/Lamb_of_God_-_Lamb_of_God.jpg",
    name: "Checkmate",
  },
];

let songIndex = 0;

function selectAlbumImg(songPlaying) {
  if (songPlaying.innerText == songs[0].name) {
    songIndex = 0;
    albumImg.src = songs[0].album;

  } else if (songPlaying.innerText == songs[1].name) {
    albumImg.src = songs[1].album;
    songIndex = 1;

  } else {
    songIndex = 2;
    albumImg.src = songs[2].album;
  }
}

function loadSongInfo(song) {
  songPlaying.innerText = song.innerText;
  albumImg.style.borderRadius = "10px";

  selectAlbumImg(songPlaying);

  bandName.style.opacity = "1";
  songPlaying.style.opacity = "1";

  audio.src = `./assets/songs/${songPlaying.innerText}.mp3`.replaceAll(
    " ",
    ""
  );
}

function playSong() {
  audio.play();
  audio.classList.add("active")

  changeClasses(playBtn, "fa-pause","fa-play" )
}

function pauseSong() {
  audio.pause();

  changeClasses(playBtn, "fa-play", "fa-pause")
}

function changeClasses(element, classToAdd, classToDelete){
  element.classList.add(classToAdd);
  element.classList.remove(classToDelete);
}

function prevSong() {
  if (isActive) {
    songIndex--;

    if (songIndex < 0) {
      songIndex = songs.length - 1;
    }

    audio.src = `./assets/songs/${songs[songIndex].name}.mp3`.replaceAll(" ", "");
    songPlaying.innerText = `${songs[songIndex].name}`;
    selectAlbumImg(songPlaying);

    playSong();

    const songToPlay = songs[songIndex]
    setAsActive(songToPlay)
  }
}
function nextSong() {
  if (isActive) {
    songIndex++;

    if (songIndex > songs.length - 1) {
      songIndex = 0;
    }

    audio.src = `./assets/songs/${songs[songIndex].name}.mp3`.replaceAll(" ", "");
    songPlaying.innerText = `${songs[songIndex].name}`;
    selectAlbumImg(songPlaying);
    playSong();

    const songToPlay = songs[songIndex]
    setAsActive(songToPlay)
  }
}

function setAsActive(song){

  //we delete the active class that the previous song had
  document.querySelector('li.song-active').classList.remove('song-active')

  //we use Arrayfrom because playlistItem is a nodeList which is an object that holds a collection of nodes of the DOM
  const active = Array.from(playlistItem).find((item) => item.children[0].innerText === song.name);  // console.log(active)
  active.classList.add('song-active')
}

function progress(evt) {
  if (isActive) {
    const { duration, currentTime } = evt.target;

    const progress = (currentTime / duration) * 100;

    progressThumb.style.width = `${progress}%`;

    let minutes = parseInt((audio.currentTime / 60) % 60);
    let seconds = parseInt(audio.currentTime % 60);

    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    totalDuration.textContent = `${minutes}:${seconds}`;
  }
}

function setProgress(evt) {
  const width = this.clientWidth;

  const clickX = evt.offsetX;

  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
}

menuIcon.addEventListener("click", () => menu.classList.toggle("aside-active"));

playlistItem.forEach((element) => {

  element.addEventListener("click", function () {
    isActive = true;
    loadSongInfo(element.firstElementChild);
    playSong();
    
    const current = document.querySelector('li.song-active')
    if( current){
      current.classList.remove('song-active')
    }
    element.classList.add('song-active')
    
  });
});

prevBtn.addEventListener("click", prevSong);

nextBtn.addEventListener("click", nextSong);

playBtn.addEventListener("click", () => {
  if (isActive) {
    if (audio.paused) {
      playSong();
    } else {
      pauseSong();
    }
  }
});

audio.addEventListener("timeupdate", progress);

progressBar.addEventListener("click", setProgress);

audio.addEventListener("ended", () => {
  if (repeatBtn.classList.contains("repeat-active")) {
    audio.currentTime = 0;
    playSong();
  } else {
    nextSong();
  }
});

repeatBtn.addEventListener("click", () => {
  if (isActive) {
    repeatBtn.classList.toggle("repeat-active");
  }
});

document.addEventListener('click', (evt) => {
  if (evt.target.classList.contains("link")) {
    evt.preventDefault();
  }
})