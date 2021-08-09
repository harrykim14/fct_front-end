class ColaGenerator {
    constructor() {
        this.itemList = document.querySelector('.list-item');
    }

    setup() {
        this.loadData(json => {
            this.colaFactory(json);
        })
    }

    loadData(callback) {
        const requestObject = new XMLHttpRequest();
        requestObject.open('GET', '/src/js/item.json');
        requestObject.onreadystatechange = () => {
            if(requestObject.readyState == 4 && requestObject.status == "200") {
                callback(JSON.parse(requestObject.responseText));
            }
        };
        requestObject.send(null);
    }

    colaFactory(data) {
        data.forEach(el => {
            const item = document.createElement('li');
            let itemTemplate = `<button
              type="button"
              class="btn-item"
              data-item="${el.name}"
              data-count="${el.count}"
              data-price="${el.cost}"
              data-image="${el.img}"
            >
              <img src="./src/images/${el.img}" alt="${el.name}" class="img-item" />
              <strong class="tit-item">${el.name}</strong>
              <span class="txt-price">${el.cost}원</span>
            </button>`;
            item.innerHTML = itemTemplate;
            this.itemList.appendChild(item);
        })
    }
}

export default ColaGenerator;