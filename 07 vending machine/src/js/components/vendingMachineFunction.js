class VendingMachineFunction {
    constructor() {
        this.btnPut = document.querySelector('.btn-put');
        this.myMoney = document.querySelector('.txt-mymoney');
        this.balance = document.querySelector('.txt-balance');
        this.itemList = document.querySelector('.list-item');
        this.inputCostElement = document.querySelector('.inp-put');
        this.btnReturn = document.querySelector('.btn-return');
        this.btnGet = document.querySelector('.btn-get');
        this.stagedList = document.querySelector('.cont-get .list-item-staged');
        this.gotList = document.querySelector('.cont-myitems .list-item-staged');
        this.txtTotal = document.querySelector('.txt-total');
    }

    setup() {
        this.bindEvents();
    }

    stagedItemGenerator(target) {
        const stagedItem = document.createElement('li');
        stagedItem.dataset.item = target.dataset.item;
        stagedItem.dataset.price = target.dataset.price;

        stagedItem.innerHTML = `
            <img src="./src/images/${target.dataset.image}" alt="" class="img-item">
            <strong class="txt-item">${target.dataset.item}</strong>
            <span class="num-counter">1</span>
        `;

        this.stagedList.appendChild(stagedItem);
    }

    bindEvents() {
        /*
            1. 입금 버튼 기능 
                입금액을 입력하고 입금 버튼을 누르면 소지금에서 그만큼 차감됨, 잔액 = 잔액 + 입금액
                입금액이 소지금보다 많다면 실행을 중단하고 "소지금이 부족합니다." 라고 쓰인 경고 창을 띄움
                이벤트가 끝나면 입금액 input은 초기화
        */

        this.btnPut.addEventListener('click', () => {
            const inputCost = parseInt(this.inputCostElement.value);
            const myMoneyVal = parseInt(this.myMoney.innerText.replace(',', ''));
            const balanceValue = parseInt(this.balance.innerText.replace(',', ''));
            if (inputCost) {
                if(inputCost <= myMoneyVal) {
                    this.myMoney.innerText = new Intl.NumberFormat().format(myMoneyVal - inputCost) + '원';
                    this.balance.innerText = new Intl.NumberFormat().format((balanceValue ? balanceValue : 0) + inputCost) + '원';
                } else {
                    alert('소지금이 부족합니다.');
                }

                this.inputCostElement.value = null;
            }
        });

        /* 
            2. 거스름돈 반환 기능 
                버튼을 누르면 소지금 = 소지금 + 잔액
                잔액은 초기화
        */

        this.btnReturn.addEventListener('click', () => {
            const myMoneyVal = parseInt(this.myMoney.innerText.replace(',', ''));
            const balanceValue = parseInt(this.balance.innerText.replace(',', ''));

            if(balanceValue) {
                this.myMoney.innerText = new Intl.NumberFormat().format(myMoneyVal + balanceValue) + '원';
                this.balance.innerText = '원';
            }
        });

        /*
            3. 아이템 선택 기능
                아이템을 누르면 잔액 = 잔액 - 음료값
                아이템이 입금액 input 밑 획득 가능 창에 등록됨
                count 값을 -1 처리
                data-count 값이 0이 된다면 li에 sold-out 클래스를 등록
                아이템 가격보다 잔액이 적다면 '잔액이 부족합니다.' 경고창 띄우기
                이미 선택한 음료를 또 선택한다면 획득 가능 창에 등록된 음료의 count를 늘리기
        */

        this.itemList.addEventListener('click', e => {
            const targetElement = e.target;
            const balanceValue = parseInt(this.balance.innerText.replace(',', ''));
            const targetElementBtn = targetElement.querySelector('.btn-item');
            let isStaged = false;

            if(targetElement.tagName === "LI") {
                const targetElementPrice = parseInt(targetElementBtn.dataset.price);
                if(balanceValue >= targetElementPrice) {
                    this.balance.innerText = new Intl.NumberFormat().format(balanceValue - targetElementPrice) + '원';
                    
                    if(this.stagedList.querySelectorAll('li').length > 0) {
                        this.stagedList.querySelectorAll('li').forEach(item => {
                            // 이미 선택한 음료수가 내가 클릭한 음료수인지 탐색 
                            if(item.dataset.item === targetElementBtn.dataset.item) {
                                item.querySelector('.num-counter').innerText++;
                                isStaged = true;
                                return;
                            }
                        });
                        // 해당 아이템을 처음 선택했을 경우
                        if (!isStaged) {
                            this.stagedItemGenerator(targetElementBtn);
                        }
                    } else {
                        this.stagedItemGenerator(targetElementBtn);
                    }
                    targetElementBtn.dataset.count--;
                    if(parseInt(targetElementBtn.dataset.count) === 0) {
                        targetElement.classList.add('sold-out');
                    }
                } else {
                    alert('잔액이 부족합니다.');
                }
            }
        });

        /*
            4. 획득 버튼 구현
                획득 버튼을 누르면 선택한 음료수 목록이 획득한 음료 목록으로 이동한다
                획득한 음료의 금액을 모두 합하고 총 금액을 업데이트
                선택한 음료수 목록을 초기화
        */

        this.btnGet.addEventListener('click', () => {
            let totalPrice = 0;
            let isGot = false;
            this.stagedList.querySelectorAll('li').forEach((itemStaged, index) => {
                this.gotList.querySelectorAll('li').forEach(itemGot => {
                    let itemGotCount = itemGot.querySelector('.num-counter');
                    // 획득할 음료수가 이미 리스트에 있는지 확인
                    if(itemStaged.dataset.item === itemGot.dataset.item) {
                        //획득한 음료 리스트의 아이템 갯수 업데이트 
                        itemGotCount.innerText = parseInt(itemGotCount.innerText) + parseInt(itemStaged.querySelector('.num-counter').innerText);
                        this.stagedList.removeChild(itemStaged); // stagedList 에서 삭제
                        isGot = true;
                        return;
                    }
                })

                if (!isGot) {
                    this.gotList.appendChild(itemStaged);
                }
            });
             // 획득한 음료 리스트를 순환하면서 총 금액을 계산합니다.
             this.gotList.querySelectorAll('li').forEach((itemGot) => {
                totalPrice += itemGot.dataset.price * parseInt(itemGot.querySelector('.num-counter').innerText);
            });
            this.txtTotal.innerText = `총금액 : ${new Intl.NumberFormat().format(totalPrice)}원`;

        })
    }
}

export default VendingMachineFunction;