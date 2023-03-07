"use strict"

class dj {

    constructor() {
        this.songs = [];
        this.songNumber = 0;
        this.playlistConteiner = document.querySelector('.playlist');

        this.audio = document.querySelector('audio');

        /**
         * Запуск/Пауза плеера
         */
        this.playDJ = document.querySelector('.button-play-pause');
        this.playImg = {
            play: 'img/fontawesome_icon/play.svg',
            pause: 'img/fontawesome_icon/pause.svg',
        }

        this.btnNextSong = document.querySelector('.button-next');
        this.btnPrevSong = document.querySelector('.button-prev');

        this.progress = document.querySelector('.progress');
        this.progressContainer = document.querySelector('.button-progress-container');

        this.btnVolume = document.querySelector('.button-volume');
        this.volumeContainer = document.querySelector('.button-volume-container-progress');
        this.volumeProgress = document.querySelector('.volume-value');

        this.btnDownloadFromPC = document.querySelector('.button.computer');
        this.downloadMusicFromPC = document.querySelector('.add-music-from-computer input');
        this.downloadMusicFromPCForm = document.querySelector('.add-music-from-computer');

        let context = this;

        /**
         * Запускаем останавливаем проигрыватель
         */
        this.playDJ.addEventListener('click', function () {
            if (context.audio.dataset.status === 'pause') {
                context.play(context)
                return false;
            }
            if (context.audio.dataset.status === 'play') {
                context.pause(context);
                return false;
            }
        })

        /**
         * Следующая песня
         */
        this.btnNextSong.addEventListener('click', function () {
            context.nextSong(context);
        });

        /**
         * Конец песни
         */
        this.audio.addEventListener('ended', function () {
            context.nextSong(context);
        })

        /**
         * Предыдущая песня
         */
        this.btnPrevSong.addEventListener('click', function () {
            context.prevSong(context);
        });

        /**
         * Прогресс
         */
        this.audio.addEventListener('timeupdate', function (e) {
            context.updateProgress(e, context)
        })

        this.progressContainer.addEventListener('click', function (e) {
            context.setProgress(e, context)
        })

        /**
         * Звук
         */
        this.btnVolume.addEventListener('click', function () {
            if (context.volumeContainer.classList.length > 1) {
                context.volumeContainer.classList.remove('open');
            } else {
                context.volumeContainer.classList.add('open');
            }
        })

        this.volumeContainer.addEventListener('click', function (e) {
            context.calcVolume(e, context);
        })

        this.setVolume(context, 0.1);

        /**
         * Загрузка музыки с компа
         */
        this.btnDownloadFromPC.addEventListener('click', function () {
            context.downloadMusicFromPC.click();
        })

        this.downloadMusicFromPC.addEventListener('change', function (event) {

            if (event.target.files.length === 0) {
                return false;
            }

            const formData = new FormData(context.downloadMusicFromPCForm);

            for (let i = 0; i < event.target.files.length; i++) {
                formData.append('musics', event.target.files[i]);
            }

            fetch('https://api-music/add-with-computer.php', {method: 'POST', body: formData}).then(response => {
                response.json().then(function (songs) {
                    songs.forEach(item => {
                        context.songs.push(context.createSong(item, context.songs.length));
                        context.setEventsForCards(context.songs.length - 1);
                        context.showSongs();
                    })
                })
            }).catch(error => {
                alert(error)
            })
        })

    }

    init() {
        this.audio.src = this.songs[this.songNumber].dataset.audio;
        this.songs[this.songNumber].style.color = '#E95D73';
    }

    play(context) {
        context.audio.play();
        context.audio.dataset.status = 'play';
        context.playDJ.firstChild.src = context.playImg.pause;
    }

    pause(context) {
        context.audio.pause();
        context.audio.dataset.status = 'pause';
        context.playDJ.firstChild.src = context.playImg.play;
    }

    nextSong(context) {

        context.songs[context.songNumber].style.color = '#7E85AD';

        context.songNumber++;
        if (context.songs[context.songNumber]) {
            context.init();
            context.play(context);
        } else {
            context.songNumber = 0;
            context.init();
            context.play(context);
        }
    }

    prevSong(context) {

        context.songs[context.songNumber].style.color = '#7E85AD';

        context.songNumber--;
        if (context.songs[context.songNumber]) {
            context.init();
            context.play(context);
        } else {
            context.songNumber = context.songs.length - 1;
            context.init();
            context.play(context);
        }
    }

    /**
     * Обновление прогресс бара в проссе проигрывания аудио
     *
     * @param e событие
     * @param context объект класса
     */
    updateProgress(e, context) {
        const {duration, currentTime} = e.srcElement;
        const progressPercent = (currentTime / duration) * 100;
        context.progress.style.width = `${progressPercent}%`;
    }

    /**
     * Перемотка с помощью прогресс бара
     *
     * @param e событие
     * @param context объект класса
     */
    setProgress(e, context) {
        const width = context.progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = context.audio.duration;

        context.audio.currentTime = (clickX / width) * duration

        context.play(context);
    }

    /**
     * Выбор песни кликом по треку
     *
     * @param e
     * @param context
     */
    cardSelection(e, context) {
        context.songs[context.songNumber].style.color = '#7E85AD';

        context.songNumber = e.target.id.replace(/number-(\d+)/, '$1');
        context.init();
        context.play(context);
    }

    /**
     * Звук
     */
    calcVolume(e, context) {
        const width = context.volumeContainer.clientWidth;
        const clickX = e.offsetX;
        let volume = clickX / width;

        context.setVolume(context, volume);
    }

    setVolume(context, volume) {
        context.audio.volume = volume.toFixed(2);
        context.volumeProgress.style.width = `${context.audio.volume * 100}%`;
    }

    /**
     * Устанавливает ивенты для треков
     *
     * @param songs
     */
    setEventsForCards(songs) {
        let context = this;

        if (typeof songs === 'object') {
            songs.forEach(card => {
                card.addEventListener('click', function (e) {
                    context.cardSelection(e, context);
                })
            })
        }

        if (typeof songs === 'number') {
            context.songs[songs].addEventListener('click', function (e) {
                context.cardSelection(e, context);
            })
        }
    }

    /**
     * Подготовка объекта с html элементами треков
     *
     * @param songs
     */
    updateSongs(songs) {
        this.songs = this.createSongs(songs);
        this.setEventsForCards(this.songs);
    }

    createSongs(elements) {
        let array_objects = [];
        for (let key in elements) {
            let div = document.createElement('div');
            div.className = "playlist__audio-card";
            div.innerHTML = elements[key].split('/')[4];
            div.dataset.audio = elements[key];
            div.id = 'number-' + key;
            array_objects.push(div)
        }
        return array_objects;
    }

    createSong(url, number) {
        let div = document.createElement('div');
        div.className = "playlist__audio-card";
        div.innerHTML = url.split('/')[4];
        div.dataset.audio = url;
        div.id = 'number-' + number;
        return div;
    }

    /**
     * Вывод всех аудио дорожек в плейлист
     */
    showSongs() {

        this.playlistConteiner.innerHTML = '';

        this.songs.forEach(item => {
            this.playlistConteiner.append(item);
        })

    }
}

/**
 * Загрузка музыкальных дорожек с сервера
 *
 * @type {Promise<unknown>}
 */
const upload = fetch('https://api-music/get-all-music.php')

upload.then(response => {

    const obj = new dj();

    response.json().then(function (songs) {

        if (songs.length > 0) {
            obj.updateSongs(songs);
            obj.showSongs();
            obj.init();
        } else {
            alert('С сервера пришел пустой массив')
        }

    })

}).catch(error => {
    alert(error)
})

// console.log()
//
// document.querySelector('input[type=search]').addEventListener('input', function () {
//
//     const autocompleteApi = {
//         domen: 'https://api.jamendo.com',
//         version: 'v3.0',
//         url1: 'autocomplete',
//         parameters: {
//             client_id: 'f50690fc',
//             format: 'jsonpretty',
//             limit: '3',
//             prefix: this.value,
//             matchcount: 1
//             //order: 'track_name_desc',
//             //name: 'couldn-t-be-happier',
//             //album_datebetween: '0000-00-00_2012-01-01'
//         }
//     }
//     //console.log(this.value)
//
//     const url = createApiUrl(autocompleteApi);
//
//     console.log(url);
//
//     const api = fetch(url);
//
//     api.then(response => {
//
//         response.json().then(function (value)
//         {
//             console.log(value)
//         })
//
//     }).catch(error => {
//         console.log(error)
//     })
//
//
// })
//
//
//
function createApiUrl(data) {
    let url = '';
    for (const key in data) {
        if (typeof data[key] === 'object') {
            url += '?';
            for (const parametersKey in data[key]) {
                url += parametersKey + '=' + data[key][parametersKey] + '&';
            }
            url = url.slice(0, -1);
            continue;
        }
        url += data[key] + '/';
    }
    return url;
}

const apiData = {
    domen: 'https://api.jamendo.com',
    version: 'v3.0',
    url1: 'artists',
    url2: 'tracks',
    parameters: {
        client_id: 'f50690fc',
        format: 'jsonpretty',
        order: 'track_name_desc',
        name: 'we+are+fm',
        //album_datebetween: '0000-00-00_2012-01-01'
    }
}

const url = createApiUrl(apiData);

console.log(url);

const api = fetch(url);

api.then(response => {

    response.json().then(function (value)
    {
        console.log(value)
    })

}).catch(error => {
    console.log(error)
})