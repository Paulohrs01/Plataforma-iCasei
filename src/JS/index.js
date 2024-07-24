// const apiKey = 'AIzaSyAPO5OlgB84ZhPqaj_jhZnubR5Y-n7Z09c';
const channelId = 'UCu5VHc965WcULpGtbu7TcSQ';

const searchInput = document.querySelector('.pesquisas input');
const searchIcon = document.querySelector('.search-icon');
const videosContainer = document.getElementById('videos');
const sidebarFavBtn = document.getElementById('fav-btn');
const sidebarFavCount = document.querySelector('.sidebar-fav .count');
const modal = document.getElementById('video-modal');
const closeBtn = document.querySelector('.close-btn');
const videoIframe = document.getElementById('video-iframe');
const modalFavBtn = document.getElementById('modal-favorite-btn');
const videoTitleElem = document.getElementById('video-title');

let favoriteVideos = [];
let selectedVideoId = '';
let selectedVideoTitle = '';
let selectedVideoThumbnail = '';

async function canalIcasei(channelId) {
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=10`);
        const data = await response.json();
        displayVideos(data.items);
    } catch (error) {
        console.error('Erro ao buscar vídeos do canal:', error);
    }
}


async function searchVideos(query) {
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${apiKey}&type=video&maxResults=10`);
        const data = await response.json();
        displayVideos(data.items);
    } catch (error) {
        console.error('Erro ao buscar vídeos:', error);
    }
}

// Função para exibir vídeos na tela
function displayVideos(videos) {
    videosContainer.innerHTML = '';
    videos.forEach(video => {
        const videoElement = createVideoElement(video);
        videosContainer.appendChild(videoElement);
    });
}


// Função para criar elemento de vídeo
function createVideoElement(video) {
    const videoId = video.id.videoId;
    const videoTitle = video.snippet.title;
    const videoThumbnail = video.snippet.thumbnails.medium.url;

    const videoElement = document.createElement('div');
    videoElement.classList.add('video-card'); 
    videoElement.innerHTML = `
        <div class="card">
            <div class="video-thumbnail" data-video-id="${videoId}">
                <img src="${videoThumbnail}" alt="${videoTitle}">
            </div>
            <div class="video-info">
                <h3>${videoTitle}</h3>
                <button class="favorite-btn">${isVideoFavorite(videoId) ? 'Remover' : 'Favoritar'}
                <img src="./src/imagens/icon-coracao.svg"></button>
            </div>
        </div>
    `;

    const thumbnail = videoElement.querySelector('.video-thumbnail');
    thumbnail.addEventListener('click', () => openModal(videoId, videoTitle, videoThumbnail));

    const favoriteBtn = videoElement.querySelector('.favorite-btn');
    favoriteBtn.addEventListener('click', (event) => {
        event.stopPropagation(); 
        toggleFavorite(videoId, videoTitle, videoThumbnail);
        favoriteBtn.innerHTML = `
    ${isVideoFavorite(videoId) ? 'Remover' : 'Favoritar'}
    <img src="./src/imagens/icon-coracao.svg">`;
    });

    return videoElement;
}

// Função  para verificar se o vídeo está nos favoritos
function isVideoFavorite(videoId) {
    return favoriteVideos.some(video => video.id === videoId);
}

// Função para abrir o modal e carregar o vídeo no iframe
function openModal(videoId, videoTitle, videoThumbnail) {
    modal.style.display = 'block';
    videoIframe.src = `https://www.youtube.com/embed/${videoId}`;
    videoTitleElem.textContent = videoTitle;
    selectedVideoId = videoId;
    selectedVideoTitle = videoTitle;
    selectedVideoThumbnail = videoThumbnail;

    updateModalFavoriteBtn(videoId);
}

// Função para fechar o modal
function closeModal() {
    modal.style.display = 'none';
    videoIframe.src = '';
}

// Função para marcar/desmarcar vídeo como favorito
function toggleFavorite(videoId, videoTitle, videoThumbnail) {
    const index = favoriteVideos.findIndex(video => video.id === videoId);

    if (index === -1) {
        favoriteVideos.push({ id: videoId, title: videoTitle, thumbnail: videoThumbnail });
    } else {
        favoriteVideos.splice(index, 1);
    }

    saveFavorites();
    updateSidebarFavCount();
    updateModalFavoriteBtn(videoId);
}

// Função para atualizar o contador de favoritos na barra lateral
function updateSidebarFavCount() {
    sidebarFavCount.textContent = `(${favoriteVideos.length})`;
}

// Função para atualizar o botão de favoritos no modal
function updateModalFavoriteBtn(videoId) {
    const isFavorite = favoriteVideos.some(video => video.id === videoId);
    modalFavBtn.innerHTML = `
        <span>${isFavorite ? 'Remover' : 'Favoritar <img src="./src/imagens/icon-coracao.svg" alt="heart-icon" class="favorite-icon">'}</span>
        ${isFavorite ? '<img src="./src/imagens/icon-coracao.svg" alt="heart-icon" class="favorite-icon">' : ''}
    `;
}

// Função para atualizar a contagem de favoritos na barra lateral
function updateFavCount() {
    sidebarFavCount.textContent = favoriteVideos.length;
}

// Função para salvar favoritos no localStorage
function saveFavorites() {
    localStorage.setItem('favoriteVideos', JSON.stringify(favoriteVideos));
}

// Função para carregar favoritos do localStorage
function loadFavorites() {
    const storedFavorites = localStorage.getItem('favoriteVideos');
    if (storedFavorites) {
        favoriteVideos = JSON.parse(storedFavorites);
        updateSidebarFavCount();
    }
}

// Função para realizar a busca
function performSearch() {
    const query = searchInput.value.trim();
    if (query) {
        searchVideos(query);
    }
}

// Evento para buscar vídeos ao pressionar Enter no campo de pesquisa
searchInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        performSearch();
    }
});

// Evento para buscar vídeos ao clicar no ícone de pesquisa
searchIcon.addEventListener('click', performSearch);

// Evento para navegar para a página de favoritos
sidebarFavBtn.addEventListener('click', () => {
    window.location.href = 'favorites.html';
});

closeBtn.addEventListener('click', closeModal);

// Event listener para o botão de favoritos no modal
modalFavBtn.addEventListener('click', () => {
    toggleFavorite(selectedVideoId, selectedVideoTitle, selectedVideoThumbnail);
    updateModalFavoriteBtn(selectedVideoId);
});

// Fechar modal ao clicar fora do conteúdo
window.addEventListener('click', function (event) {
    if (event.target == modal) {
        closeModal();
    }
});

function initHomePage() {
    canalIcasei(channelId);
    loadFavorites();
}

initHomePage();
