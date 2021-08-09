import { Intro, TabButtons, TopMusics, SearchView, PlayList, PlayView } from './components/index.js'
import removeAllChildNodes from './utils/removeAllChildNodes.js';
import { fetchMusics } from '../APIs/index.js';

export default class App {
    constructor(props) {
        this.props = props;
        this.currentMainIndex = 0;
        this.mainViewComponents = [];
    }

    async setup() {
        const { el } = this.props;
        this.rootElement = document.querySelector(el);

        this.intro = new Intro();
        this.tabButtons = new TabButtons();
        this.topMusics = new TopMusics();
        this.searchView = new SearchView();
        this.playList = new PlayList();
        this.playView = new PlayView();
        this.mainViewComponents = [this.topMusics, this.playList, this.searchView]

        this.bindEvents();
        // 음악을 가져오기
        await this.fetchMusics();
        this.init();
    }

    bindEvents() {
        // 탭버튼 컴포넌트 이벤트
        this.tabButtons.on('clickTab', payload => {
            const { currentIndex = 0 } = payload;
            this.currentMainIndex = currentIndex;
            this.render();
        });

        // 탑뮤직 컴포넌트 이벤트
        this.topMusics.on('play', payload => {
            this.playView.playMusic(payload);
        })
        this.topMusics.on('pause', () => {
            this.playView.pause();
        }) 
        this.topMusics.on('addPlayList', payload => {
            const { musics, musicIndex } = payload;
            this.playList.add(musics[musicIndex]);
        })

        // 플레이리스트 컴포넌트 이벤트
        this.playList.on('play', payload => {
            this.playView.playMusic(payload);
            this.playView.show();
        })

        this.playList.on('pause', () => { 
            this.playView.pause() 
        });

        // 서치뷰 컴포넌트 이벤트: 검색된 음악만 표시하기
        this.searchView.on('searchMusic', query => {
            if(!query) {
                return this.searchView.setSearchResult([]);
            }

            const searchedMusics = this.topMusics.musics.filter(music => {
                const { artists, title } = music;
                const upperCaseQuery = query.toUpperCase();
                const filterlingName = artists.some(artist => artist.toUpperCase().includes(upperCaseQuery));
                const filteringTitle = title.toUpperCase().includes(upperCaseQuery);

                return filterlingName || filteringTitle;
            });

            this.searchView.setSearchResult(searchedMusics);
        })

        // 탑뮤직 컴포넌트 이벤트
        this.searchView.on('play', payload => {
            this.playView.playMusic(payload);
        })
        this.searchView.on('pause', () => {
            this.playView.pause();
        }) 
        this.searchView.on('addPlayList', payload => {
            const { musics, musicIndex } = payload;
            this.playList.add(musics[musicIndex]);
        })

        // 플레이뷰 컴포넌트 이벤트
        this.playView.on('backward', () => {
            this.playList.playPrev();
        })

        this.playView.on('forward', () => {
            this.playList.playNext()
        })

        this.playView.on('musicEnded', (payload) => {
            this.playList.playNext(payload);
        })

    }

    async fetchMusics() {
        const responseBody = await fetchMusics();
        const { musics = [] } = responseBody;
        this.topMusics.setMusics(musics);
    }

    init() {
        this.intro.show();
        setTimeout(() => {
            this.render();
            this.intro.hide();
        }, 1000)
    }

    renderMainView() {
        const renderCompenent = this.mainViewComponents[this.currentMainIndex];
        return renderCompenent ? renderCompenent.render() : '';
    }

    render() {
        removeAllChildNodes(this.rootElement);
        const tabButtons = this.tabButtons.render();
        const mainView = this.renderMainView();
        this.rootElement.append(tabButtons);
        this.rootElement.append(mainView);
    }
}