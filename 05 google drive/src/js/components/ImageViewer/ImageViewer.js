class ImageViewer {
    constructor(props) {
        const { parentElement } = props;
        this.parentElement = parentElement;
        this.renderElement = ImageViewer.createImageViewer();
        this.bindEvents();
    }

    static createImageViewer() {
        const imageViewWrapper = document.createElement('section');
        const imageContent = document.createElement('div');
        const imageElement = document.createElement('img');

        imageViewWrapper.classList.add('modal', 'image-viewer');
        imageContent.classList.add('content');

        imageContent.appendChild(imageElement);
        imageViewWrapper.appendChild(imageContent);

        return imageViewWrapper;
    }

    bindEvents() {
        this.renderElement.addEventListener('click', e => {
            const currentTarget = e.target;
            if(this.renderElement === currentTarget) {
                this.close();
            }
        })
    }

    open(filePath = '') {
        this.renderElement.querySelector('img').src= filePath;
        this.parentElement.appendChild(this.renderElement);
    }

    close() {
        this.parentElement.removeChild(this.renderElement);
    }
}

export default ImageViewer;