/*

첫 단계
1. 카드를 클릭한다
2. 클릭한 카드에 on 클래스를 붙여서 뒤집기
3. 클릭한 카드의 data-name을 변수에 저장하기

두 번째 단계
1. 두 번째 카드를 클릭한다
2. 클릭한 카드에 on 클래스를 붙여서 뒤집기
3. 클릭한 카드의 data-name을 변수에 저장하기

세 번째 단계
1. 두 카드가 동일한 카드인지 아닌지 판단하기
2. 값이 같다면 두 요소를 숨기기
3. 값이 다르다면 두 요소의 on 클래스를 삭제하여 다시 뒤집기
4. 저장해놨던 카드의 정보를 삭제하기

*/

export default class EventCard { 
    constructor() {
        this.cards = document.querySelector('.list-card');
        this.cardElement = [];
    }

    setup() {
        this.bindEvents();
    }

    bindEvents() {
        this.cards.addEventListener('click', e => {
            const clickedElement = e.target;
            
            if(clickedElement.tagName === "LI") {
                if(this.cardElement.length < 2 && this.cardElement[0] !== clickedElement) {
                    this.cardElement.push(clickedElement); // 클릭한 카드의 data-name을 변수에 저장하기
                    clickedElement.classList.add('on'); // 클릭한 카드에 on 클래스를 붙여서 뒤집기

                    if (this.cardElement.length === 2) {
                        setTimeout(() => {
                                // 같은 카드를 선택했을 경우
                            if(this.cardElement[0].dataset.name === this.cardElement[1].dataset.name) {
                                this.cardElement.forEach(item => {
                                    item.style.visibility = 'hidden';
                                })
                            } else // 다른 카드라면
                            {
                                this.cardElement.forEach(item => {
                                    item.classList.remove('on');
                                })
                            }
                            
                            this.cardElement.splice(0, 2);
                           
                        }, 500);
                    }
                }

            }
        })
    }
}