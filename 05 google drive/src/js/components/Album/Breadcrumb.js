import Component from '../../helpers/Component.js'

class Breadcrumb extends Component {
    constructor(props) {
        super(props); // 상속을 받기 때문에 super를 반드시 사용하여야 한다
        const { parentElement } = props;
        this.routes = [{ name: "ROOT" }];
        this.parentElement = parentElement;
        this.renderElement = Breadcrumb.createBreadcrumb();
        this.init();
    }

    static createBreadcrumb() {
        const breadcrumbWrapper = document.createElement('section');
        breadcrumbWrapper.classList.add('breadcrumb-container');
        const breadcrumb = document.createElement('div');
        breadcrumb.classList.add('breadcrumbs');
        breadcrumbWrapper.append(breadcrumb);

        const backButton = document.createElement('button');
        backButton.classList.add('btn-back');
        breadcrumbWrapper.append(backButton);

        return breadcrumbWrapper;
    }

    init() {
        this.parentElement.appendChild(this.renderElement);
        this.bindEvents();
    }

    bindEvents() { 
        const backButton = this.renderElement.querySelector('.btn-back');
        backButton.addEventListener('click', () => this.emit('back'));
    }

    forward(route) {
        this.routes.push(route);
        return this;
    }

    back() {
        this.routes.pop();
        return this;
    }

    getParentNode() {
        return this.routes[this.routes.length - 1];
    }

    render() {
        const routeElements = this.routes.map(route => { 
            `<span>${route.name}</span>`
        }).join('');
        this.renderElement.querySelector('.breadcrumbs').innerHTML = routeElements;

        return this.renderElement;
    }
}

export default Breadcrumb;