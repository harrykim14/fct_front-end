// 리스트 안에서 엘리먼트의 인덱스 번호를 찾는 함수
const findIndexListElement = element => {
    const listItems = element.parentElement.querySelectorAll('li');
    // listItems는 배열과 비슷하지만 Node이기 때문에 Array 객체가 가진 slice 메서드를 빌려 쓴다
    const currentIndex = Array.prototype.slice.call(listItems).findIndex(listItem => listItem === element);

    return currentIndex;
}

export default findIndexListElement;