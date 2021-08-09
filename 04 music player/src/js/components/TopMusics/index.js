export default class TopMusics {
    constructor() {
        this.rootElement = TopMusics.createRootElement();
        this.musics = [];
        this.bindEvents();
    }

    static createRootElement() {
        const rootElement = document.createElement('article');
        rootElement.classList.add('contents-top5');

        return rootElement;
    }

    bindEvents() {
        this.rootElement.addEventListener('click', e => {
            const { target } = e;
            const isControllerButton = target.tagName === "BUTTON";

            if(!isControllerButton) {
                return;
            }

            const buttonRole = target.classList.item(1);
            switch(buttonRole) {
                case 'icon-play': {
                    this.requestPlay(target);
                    console.log(target);
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

    // 모든 음악 재생 상태를 중단하는 ui 변경을 처리
    renderStopAll() {
        const playingButtons = this.rootElement.querySelectorAll('.icon-pause');
        playingButtons.forEach(element => element.classList.replace('icon-pause', 'icon-play'));
    }

    // 음악 재생을 App.js에 요청
    requestPlay(target) {
        console.log(target);
        const controller = target.parentElement;
        const { index: musicIndex } = controller.dataset;
        const payload = { musics: this.musics, musicIndex };
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
        const payload = { musics: this.musics, musicIndex };
        this.emit('addPlayList', payload);
    }

    // 음악 데이터를 받아오기
    setMusics(musics = []) {
        this.musics = musics;
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

    // 탑 뮤직 UI 전체를 렌더링합니다.
    render() {
        const topRoof = `<div class="top5-roof">
                            <img src="assets/images/intro-logo.png"/>
                        </div>`;

        const musicsList = this.musics.map((music, index) => {
            const { cover, title, artists } = music;
            return `
                <li>
                    <div class="music-rank">${index + 1}</div>
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
                        <div class="music-simple-controller" data-index=${index}>
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

        this.rootElement.innerHTML = topRoof + `<ol class="top5-list">` + musicsList + `</ol>`;

        return this.rootElement;
    }

}