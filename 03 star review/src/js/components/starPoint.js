const starIamgeSourceMap = {
    empty: './src/image/icon_empty_star.png',
    half: './src/image/icon_half_star.png',
    full: './src/image/icon_star.png',
}

class StarPoint {
    constructor() {
        this.starContentElement = document.querySelector('.content-star');
        this.starBackgroundElement = this.starContentElement.querySelector('.star-background');
        this.starImages = this.starBackgroundElement.querySelectorAll('img');
        this.starPointResetButton = this.starContentElement.querySelector('.icon-remove-star');
        this.lockedStarPoint = false;
    }

    setup() {
        this.bindEvents();
    }

    lockStarPoint() {
        this.lockedStarPoint = true;
    }

    unlockStarPoint() {
        this.lockedStarPoint = false;
    }

    isLockedStarPoint() {
        return this.lockedStarPoint;
    }

    bindEvents() {
        this.starBackgroundElement.addEventListener('mousemove', e => {
            // 별점이 고정되어 있다면 이벤트 핸들링 중지
            if(this.isLockedStarPoint()) {
                return;
            }

            const { target, offsetX: currentUserPoint } = e; // offsetX: 마우스 포인터의 X축 위치 반환
            const { point } = target.dataset;
            const starPointIndex = parseInt(point, 10) - 1;
            const [starImageClientRect] = target.getClientRects(); // 요소의 좌표와 크기에 대한 정보를 반환
            const starImageWidth = starImageClientRect.width;
            const isOverHalf = starImageWidth / 2 < currentUserPoint; // 마우스 위치가 별 중간을 넘어서면 true를, 아니면 false가 됨

            this.renderStarPointImages({ drawbleLimtIndex: starPointIndex, isOverHalf});
        })

        this.starBackgroundElement.addEventListener('click', () => this.lockStarPoint());
        this.starPointResetButton.addEventListener('click', () => { 
            this.unlockStarPoint();
            this.resetStarPointImages();
        });

        this.starBackgroundElement.addEventListener('mouseout', () => {
            !this.isLockedStarPoint() && this.resetStarPointImages();
            
        })
    }
    
    renderStarPointImages(payload = {}) {
        const { drawbleLimtIndex = 1, isOverHalf = false} = payload;
        // NodeList !== Array (익플에서는 NodeList의 forEach가 불가능함)
        // 익플에서는 Array 객체의 prototype 내 forEach문을 빌려옴
        Array.prototype.forEach.call(this.starImages, (eachStar, idx) => {
            let imageSource = idx < drawbleLimtIndex ? starIamgeSourceMap.full : starIamgeSourceMap.empty;

            if (drawbleLimtIndex === idx) {
                imageSource = isOverHalf ? starIamgeSourceMap.full : starIamgeSourceMap.half;
            }

            eachStar.src = imageSource;
        })
    }

    // 고정된 별점 초기화
    resetStarPointImages() {
        Array.prototype.forEach.call(this.starImages, (eachStar) => {
            let imageSource = starIamgeSourceMap.empty;
            eachStar.src = imageSource;
        })
    }

}

export default StarPoint;