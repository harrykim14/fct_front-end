export default class Intro {
    constructor() {
        this.parentElement = document.querySelector('body');
        this.renderElement = Intro.createRenderElement();
    }

    // 클래스의 인스턴스화 없이 사용할 수 있는 메서드
    static createRenderElement () {
        const introContainer = document.createElement('div');
        introContainer.classList.add('intro');
        const introImage = document.createElement('img');
        introImage.src = "assets/images/intro-logo.png";

        introContainer.append(introImage);
        return introContainer;
    }

    show() {
        this.parentElement.append(this.renderElement);
    }

    hide() {
        this.renderElement.style.opacity = 0;
        setTimeout(() => {
            this.parentElement.removeChild(this.renderElement);
        }, 1000);
    }
}