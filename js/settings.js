"use strict"

export const djData = {
    /**
     * Контейнер для всех загруженных треков - песен
     */
    playlistContainer : document.querySelector('.playlist'),

    /**
     * Тег аудио, для инициализации музыки
     */
    audio : document.querySelector('audio'),

    /**
     * Запуск/Пауза плеера
     */
    playDJ : document.querySelector('.button-play-pause'),
    playImg : {
        play: 'img/fontawesome_icon/play.svg',
        pause: 'img/fontawesome_icon/pause.svg',
    },

    /**
     * Следующая песня / Предыдущая
     */
    btnNextSong: document.querySelector('.button-next'),
    btnPrevSong: document.querySelector('.button-prev'),

    /**
     * Прогресс бар (вся область и так которая будет отражать прогресс)
     */
    progress: document.querySelector('.progress'),
    progressContainer: document.querySelector('.button-progress-container'),

    /**
     * Громкость
     * - Кнопка показа громкости
     * - Вся область громкости
     * - Громкость в данный момент времени
     */
    btnVolume: document.querySelector('.button-volume'),
    volumeContainer: document.querySelector('.button-volume-container-progress'),
    volumeProgress: document.querySelector('.volume-value'),

    /**
     * Загрузка песен с пк
     * - Кнопка загрузки
     * - input на который ссылается кнопка загрузки
     * - Форма с инпутом
     */
    btnDownloadFromPC: document.querySelector('.button.computer'),
    downloadMusicFromPC: document.querySelector('.add-music-from-computer input'),
    downloadMusicFromPCForm: document.querySelector('.add-music-from-computer'),
}