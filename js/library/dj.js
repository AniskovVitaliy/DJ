"use strict"

export class dj {

    constructor(elements) {
        this.songs = [];
        this.songNumber = 0;
        this.playlistContainer = elements.playlistContainer;

        this.audio = elements.audio;

        /**
         * Запуск/Пауза плеера
         */
        this.playDJ = elements.playDJ;

        this.playImg = {
            play: elements.playImg.play,
            pause: elements.playImg.pause,
        }

        this.btnNextSong = elements.btnNextSong;
        this.btnPrevSong = elements.btnPrevSong;

        this.progress = elements.progress;
        this.progressContainer = elements.progressContainer;

        this.btnVolume = elements.btnVolume;
        this.volumeContainer = elements.volumeContainer;
        this.volumeProgress = elements.volumeProgress;

        this.btnDownloadFromPC = elements.btnDownloadFromPC;
        this.downloadMusicFromPC = elements.downloadMusicFromPC;
        this.downloadMusicFromPCForm = elements.downloadMusicFromPCForm;

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

    initEvents() {

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

    /**
     * Создает элементы треков
     *
     * @param elements
     * @returns {*[]}
     */
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

    /**
     * Создает элемент трека
     *
     * @param url
     * @param number
     * @returns {HTMLDivElement}
     */
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

        this.playlistContainer.innerHTML = '';

        this.songs.forEach(item => {
            this.playlistContainer.append(item);
        })

    }
}