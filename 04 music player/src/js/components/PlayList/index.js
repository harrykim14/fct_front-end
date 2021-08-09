import { findIndexListElement, getClosestElement } from '../../utils/index.js';

export default class PlayList {
    constructor() {
        this.rootElement = PlayList.createRootElement();
        this.musicList = [];
        this.loadStorage();
        this.bindEvents();
    }

    static createRootElement() {
        const rootElement = document.createElement('article');
        rootElement.classList.add('content-playlist');

        return rootElement;
    }

    bindEvents() {
        this.rootElement.addEventListener('click', e => {
            const { target } = e;
            const isController = target.tagName === 'BUTTON';

            if(!isController) {
                return this.playMusicItem(target);
            }

            this.removeMusicItem(target);
        })
    }

    playNext(payload) {
        let currentIndex = this.musicList.findIndex(music => music.playing);
        const isMusicIndexEnd = currentIndex >= this.musicList.length - 1;
        if(isMusicIndexEnd) {
            currentIndex = -1;
        }

        if (payload) {
            const { repeat, random } = payload;
            if(!random && !repeat && isMusicIndexEnd) {
                return ;
            }

            if(random) {
                currentIndex = Math.floor(Math.random() * (this.musicList.length - 2));
            }
        }

        const nextIndex = currentIndex + 1;
        this.playMusicItem(nextIndex);
    }

    playPrev() {
        let currentIndex = this.musicList.findIndex(music => music.playing);
        if(currentIndex <= 0) {
            currentIndex = this.musicList.length;
        }
        const prevIndex = currentIndex - 1;
        this.playMusicItem(prevIndex);
    }

    playMusicItem(target) {   
        const listItemElement = typeof target === 'number' ? this.rootElement.querySelectorAll('li')[target] : getClosestElement(target, 'LI');

        const musicIndex = findIndexListElement(listItemElement);
        const requestPlay = this.musicList[musicIndex].playing;
        this.musicList.forEach(musicInfo => {
            musicInfo.playing = false;
        })

        this.rootElement.querySelectorAll('li').forEach(element => element.classList.remove('on'));

        if(!requestPlay) {
            listItemElement.classList.add('on');
            this.musicList[musicIndex].playing = true;
            this.emit('play', { musics: this.musicList, musicIndex });
        } else {
            listItemElement.classList.remove('on');
            this.emit('pause');
        }
    }

    removeMusicItem(target) {
        const listItemElement = getClosestElement(target, 'LI');
        const musicIndex = findIndexListElement(listItemElement);
        this.remove(Number(musicIndex));
        listItemElement.parentElement.removeChild(listItemElement);
    }

    add(music) {
        this.musicList.push(music);
        this.saveStorage();
    }

    remove(index) {
        this.musicList.splice(index, 1);
        this.saveStorage();
    }

    // 저장소에서 임시저장한 음악 리스트 호출
    loadStorage() {
        // 플레이 리스트 키를 가지고 임시저장한 음악 리스트를 호출합니다.
        const stringifiedPlaylist = localStorage.getItem('playlist');
        try {
            // 호출된 값은 문자열로 되어있기 때문에 JSON.parse를 해줍니다.
            const playList = JSON.parse(stringifiedPlaylist);
            // 만약 값이 없다면 null 일수 있기 때문에 확인을 한 후 그대로 담아주거나 빈배열로 처리해줍니다.
            this.musicList = playList instanceof Array ? playList : [];
        } catch (e) {
            // 스토리지는 모바일에서 용량 문제 등으로 에러가 발생할 수 있기 때문에 try - catch 처리를 잘해줍니다.
            console.error(e);
        }
    }

    saveStorage() {
        const musicList = this.musicList.map( ({ artists, cover, source, title }) => ({artists, cover, source, title}));

        try {
            localStorage.setItem('playlist', JSON.stringify(musicList))
        } catch (e) {
            console.error(e);
        }
    }

    // 공통 이벤트입니다. 만약 시험에서 사용하시게 된다면 각 Component에 따로 두는 것보다 공통 베이스 컴포넌트를 만들어서 상속받는 형태로 하시는 것이 좋습니다. (5)번에 샘플이 있습니다.
    on(eventName, callback) {
        this.events = this.events ? this.events : {};
        this.events[eventName] = callback;
    }
    // 공통 이벤트입니다. 만약 시험에서 사용하시게 된다면 각 Component에 따로 두는 것보다 공통 베이스 컴포넌트를 만들어서 상속받는 형태로 하시는 것이 좋습니다. (5)번에 샘플이 있습니다.
    emit(eventName, payload) {
        this.events[eventName] && this.events[eventName](payload);
    }

    render() {
        const playListTitle = `<h2 class="playlist-title">MY PLAYLIST</h2>`;
        const musicList = this.musicList.map(music => {
            const { cover, title, artists } = music;
            return `<li>
            <div class="music-content">
                <div class="music-data">
                    <div class="music-cover">
                        <img src="${cover}" />
                    </div>
                    <div class="music-info">
                        <strong class="music-title">${title}</strong>
                        <em class="music-artist">${artists[0]}</em>
                    </div>
                </div>
                <div class="music-simple-controller">
                    <button class="icon icon-minus">
                        <span class="invisible-text">제거</span>
                    </button>
                </div>
            </div>
        </li>
            `
        }).join('');
        this.rootElement.innerHTML = playListTitle + '<ul class="music-list">' + musicList + '</ul>';
        return this.rootElement;
    }
}