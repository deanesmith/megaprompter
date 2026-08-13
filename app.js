const listView = document.getElementById('list-view');
const songView = document.getElementById('song-view');
const songList = document.getElementById('song-list');
const songTitle = document.getElementById('song-title');
const songContent = document.getElementById('song-content');
const backBtn = document.getElementById('back-btn');

let songs = [];

async function loadSongList() {
  const res = await fetch('songs.json');
  songs = await res.json();
  renderList();
}

function renderList() {
  songList.innerHTML = '';
  songs.forEach(filename => {
    const li = document.createElement('li');
    li.textContent = filename.replace(/\.docx$/i, '');
    li.addEventListener('click', () => openSong(filename));
    songList.appendChild(li);
  });
}

async function openSong(filename) {
  const title = filename.replace(/\.docx$/i, '');
  songTitle.textContent = title;
  songContent.innerHTML = 'Loading...';

  listView.hidden = true;
  songView.hidden = false;

  const res = await fetch('songs/' + encodeURIComponent(filename));
  const arrayBuffer = await res.arrayBuffer();
  const result = await mammoth.convertToHtml({ arrayBuffer });
  songContent.innerHTML = result.value;
  songContent.scrollTop = 0;
  window.location.hash = encodeURIComponent(filename);
}

function showList() {
  songView.hidden = true;
  listView.hidden = false;
  window.location.hash = '';
}

backBtn.addEventListener('click', showList);

window.addEventListener('hashchange', () => {
  const hash = decodeURIComponent(window.location.hash.slice(1));
  if (!hash) {
    showList();
  } else if (songs.includes(hash)) {
    openSong(hash);
  }
});

// On load, check if a song is in the URL hash
loadSongList().then(() => {
  const hash = decodeURIComponent(window.location.hash.slice(1));
  if (hash && songs.includes(hash)) {
    openSong(hash);
  }
});
