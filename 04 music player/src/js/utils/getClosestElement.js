// 부모 엘리먼트로 올라가면서 셀렉터를 만족하는 가장 가까운 요소를 찾는다
const getClosestElement = (element, selector) => {
    let evaluate = false; // 플래그 변수
    if(/^\./.test(selector)) {
        evaluate = element.classList.contains(selector);
    } else {
        evaluate = element.tagName === selector.toUpperCase();
    }

    if(evaluate) {
        return element;
    }

    return getClosestElement(element.parentElement, selector);
}

export default getClosestElement;