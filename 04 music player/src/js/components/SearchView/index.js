import { removeAllChildNodes } from "../../utils/index.js";

export default class SearchView {
    constructor() {
        this.rootElement = SearchView.createRootElement();
        this.searchedMusics = [];
        this.bindEvents();
    }

    static createRootElement() {
        const rootElement = document.createElement('article');
        rootElement.classList.add('contents-search');
        rootElement.innerHTML = `
            <div class="search-controller">
                <input class="search-input" type="text" placeholder="검색"/>
                <button class="search-btn">
                    <i class="icon-search-controller"></i>
                </button>
            </div>
            <ul class="music-list"></ul>`;

        return rootElement;
    }

    bindEvents() {
        this.rootElement.querySelector('.search-input').addEventListener('input', e => {
            const query = e.target.value;
            this.emit('searchMusic', query);
        })

        this.rootElement.addEventListener('click', e => {
            const { target } = e;
            const isControllerButton = target.tagName === 'BUTTON';

            if(!isControllerButton) {
                return;
            }

            const buttonRole = target.classList.item(1);
            switch(buttonRole) {
                case 'icon-play': {
                    this.requestPlay(target);
                    break;
                }
                case 'icon-pause': {
                    this.requestPause(target);
                    break;
                }
                case 'icon-plus': {
                    this.requestAddPlayList(target);
                    break;
                }

            }
        })
    }

    renderStopAll() {
        const playingButtons = this.rootElement.querySelectorAll('.icon-pause');
        playingButtons.forEach(element => element.classList.replace('icon-pause', 'icon-play'));
    }

    // 음악 재생을 App.js에 요청
    requestPlay(target) {
        const controller = target.parentElement;
        const { index: musicIndex } = controller.dataset;
        const payload = { musics: this.searchedMusics, musicIndex };
        this.emit('play', payload);
        this.renderStopAll();
        target.classList.replace('icon-play', 'icon-pause');
    }

    // 음악 재생 중단 요청
    requestPause(target) {
        this.emit('pause');
        target.classList.replace('icon-pause', 'icon-play');
    }

    // 플레이리스트에 노래를 추가 요청
    requestAddPlayList(target) {
        const controller = target.parentElement;
        const { index: musicIndex } = controller.dataset;
        const payload = { musics: this.searchedMusics, musicIndex };
        this.emit('addPlayList', payload);
    }

    setSearchResult(musicList =[]) {
        this.searchedMusics = musicList;
        this.renderSearchedMusics();
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

    renderSearchedMusics() {
        const musicListElement = this.rootElement.querySelector('.music-list');
        removeAllChildNodes(musicListElement);
        const searchedMusics = this.searchedMusics.map((music, idx) => {
            const { cover, title, artists } = music;
            return `
                <li>
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
                        <div class="music-simple-controller" data-index=${idx}>
                            <button class="icon icon-play">
                                <span class="invisible-text">재생</span>
                            </button>
                            <button class="icon icon-plus">
                                <span class="invisible-text">추가</span>
                            </button>
                        </div>
                    </div>
                </li>
            `;
            }).join('');

            musicListElement.innerHTML = searchedMusics;
        }

        render() {
            return this.rootElement;
        }
    }    