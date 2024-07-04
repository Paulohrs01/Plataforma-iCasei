// index.test.js

const isVideoFavorite = require('./index');

// Mock de favoriteVideos para os testes
global.favoriteVideos = [
    { id: 'abc123', title: 'Video 1', thumbnail: 'thumbnail-url' },
    { id: 'def456', title: 'Video 2', thumbnail: 'thumbnail-url' },
];

describe('isVideoFavorite', () => {
    it('deve retornar true para um vídeo favorito existente', () => {
        const videoId = 'abc123';
        const result = isVideoFavorite(videoId);
        expect(result).toBe(true);
    });

    it('deve retornar false para um vídeo não favorito', () => {
        const videoId = 'xyz789';
        const result = isVideoFavorite(videoId);
        expect(result).toBe(false);
    });

    it('deve retornar false quando a lista de vídeos favoritos estiver vazia', () => {
        global.favoriteVideos = [];
        const videoId = 'abc123';
        const result = isVideoFavorite(videoId);
        expect(result).toBe(false);
    });

    it('deve retornar false para videoId undefined ou null', () => {
        const resultUndefined = isVideoFavorite(undefined);
        const resultNull = isVideoFavorite(null);
        expect(resultUndefined).toBe(false);
        expect(resultNull).toBe(false);
    });
});
