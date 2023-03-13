"use strict"

import {djData} from "./settings.js";
import {dj} from "./library/dj.js";

/**
 * Загрузка музыкальных дорожек с сервера
 *
 * @type {Promise<unknown>}
 */
const upload = fetch('https://api-music/get-all-music.php')

upload.then(response => {

    const obj = new dj(djData);

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
// function createApiUrl(data) {
//     let url = '';
//     for (const key in data) {
//         if (typeof data[key] === 'object') {
//             url += '?';
//             for (const parametersKey in data[key]) {
//                 url += parametersKey + '=' + data[key][parametersKey] + '&';
//             }
//             url = url.slice(0, -1);
//             continue;
//         }
//         url += data[key] + '/';
//     }
//     return url;
// }
//
// const apiData = {
//     domen: 'https://api.jamendo.com',
//     version: 'v3.0',
//     url1: 'artists',
//     url2: 'tracks',
//     parameters: {
//         client_id: 'f50690fc',
//         format: 'jsonpretty',
//         order: 'track_name_desc',
//         name: 'we+are+fm',
//         //album_datebetween: '0000-00-00_2012-01-01'
//     }
// }
//
// const url = createApiUrl(apiData);
//
// console.log(url);
//
// const api = fetch(url);
//
// api.then(response => {
//
//     response.json().then(function (value)
//     {
//         console.log(value)
//     })
//
// }).catch(error => {
//     console.log(error)
// })