import { findIndexListElement, getClosestElement } from'../../utils/index.js'

export default class TabButtons {
    constructor() {
        this.renderElement = TabButtons.createRenderElement();
        this.bindEvents();
    }

    static createRenderElement() {
        const tabsContainer = document.createElement('ul');
        tabsContainer.classList.add('app-controller');
        const tabs = [
            { title: 'Top5', iconName: 'icon-top5' },
            { title: 'Playlist', iconName: 'icon-playlist' },
            { title: 'Search', iconName: 'icon-search' },
        ];

        tabsContainer.innerHTML = tabs.map(tab => {
            return `
                <li>
                    <button type="button" class="btn-app-controller">
                        <i class="tab-icon ${tab.iconName}"></i>
                        ${tab.title}
                    </button>
                </li>
            `;
        }).join('');

        return tabsContainer;
    }

    bindEvents() {
        this.renderElement.addEventListener('click', e => {
            const element = getClosestElement(e.target, 'li');
            const currentIndex = findIndexListElement(element);

            this.emit('clickTab', { currentIndex });
        })
    }

    on(eventName, callback) {
        this.events = this.events ? this.events : {};
        this.events[eventName] = callback;
    }

    emit(eventName, payload) {
        this.events[eventName] && this.events[eventName](payload);
    }

    // 전체 렌더링을 보내줌. 부모 엘리먼트는 이 엘리먼트를 획득하고 자기 자신의 루트 엘리먼트에 부착할 것입니다.
    render() {
        return this.renderElement;
    }
}