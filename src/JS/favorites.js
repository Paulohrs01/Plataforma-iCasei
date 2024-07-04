document.addEventListener('DOMContentLoaded', function () {
    loadFavorites();
});

function loadFavorites() {
    const storedFavorites = localStorage.getItem('favoriteVideos');
    console.log('Stored favorites:', storedFavorites);
    if (storedFavorites) {
        const favoriteVideos = JSON.parse(storedFavorites);
        console.log('Parsed favorites:', favoriteVideos);
        displayFavVideos(favoriteVideos);
        updateFavCount(favoriteVideos.length);
    } else {
        console.log('No favorites found in localStorage.');
        updateFavCount(0);
    }
}

function displayFavVideos(videos) {
    const favoritesContainer = document.getElementById('favorites');
    if (favoritesContainer) {
        favoritesContainer.innerHTML = '';
        videos.forEach(video => {
            const videoElement = createVideoElement(video);
            favoritesContainer.appendChild(videoElement);
        });
        console.log('Displayed favorite videos:', videos);
    } else {
        console.error('Favorites container element not found');
    }
}

function createVideoElement(video) {
    const videoId = video.id;
    const videoTitle = video.title;
    const videoThumbnail = video.thumbnail;

    const favoriteVideos = JSON.parse(localStorage.getItem('favoriteVideos')) || [];
    const isFavorite = favoriteVideos.some(video => video.id === videoId);

    const videoElement = document.createElement('div');
    videoElement.classList.add('video-card');
    videoElement.innerHTML = `
        <div class="card">
        <div class="video-thumbnail" data-video-id="${videoId}">
            <img src="${videoThumbnail}" alt="${videoTitle}">
        </div>
        <div class="video-info">
            <h3>${videoTitle}</h3>
            <button class="favorite-btn">${isFavorite ? 'Remover' : 'Favoritar'}
                <img src="./src/imagens/icon-coracao.svg">
            </button>
        </div>
      </div>  
    `;

    const thumbnail = videoElement.querySelector('.video-thumbnail');
    thumbnail.addEventListener('click', () => openModal(videoId, videoTitle, videoThumbnail));

    const favoriteBtn = videoElement.querySelector('.favorite-btn');
    favoriteBtn.addEventListener('click', (event) => {
        event.stopPropagation(); // Evita que o evento de abrir o modal se propague para o contêiner do vídeo
        toggleFavorite(videoId, videoTitle, videoThumbnail, favoriteBtn);
    });

    return videoElement;
}

function updateFavCount(count) {
    const sidebarFavCount = document.querySelector('.sidebar-fav .count');
    if (sidebarFavCount) {
        sidebarFavCount.textContent = `(${count})`;
    }
}

function toggleFavorite(videoId, videoTitle, videoThumbnail, buttonElement) {
    const favoriteVideos = JSON.parse(localStorage.getItem('favoriteVideos')) || [];
    const index = favoriteVideos.findIndex(video => video.id === videoId);

    if (index === -1) {
        // Adiciona ao array de favoritos se não estiver presente
        favoriteVideos.push({ id: videoId, title: videoTitle, thumbnail: videoThumbnail });
        buttonElement.innerHTML = 'Remover <img src="./src/imagens/icon-coracao.svg">';
    } else {
        // Remove do array de favoritos se já estiver presente
        favoriteVideos.splice(index, 1);
        buttonElement.innerHTML = 'Favoritar <img src="./src/imagens/icon-coracao.svg">';
    }

    // Salva os favoritos no localStorage
    localStorage.setItem('favoriteVideos', JSON.stringify(favoriteVideos));

    // Atualiza o contador de favoritos na barra lateral
    updateFavCount(favoriteVideos.length);
}

document.getElementById('back-btn').addEventListener('click', () => {
    window.location.href = 'index.html';
});

// Recarrega a lista de favoritos
loadFavorites();
