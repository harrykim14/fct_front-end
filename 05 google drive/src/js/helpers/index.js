// element와 selector를 받는 함수
const getClosestElement = (element, selector) => {
    // flag 변수
    let evaluate = false;
    // class명이므로 '.'이 있는지 테스트하고 있다면 해당 selector를 포함하는지 체크
    if (/^\./.test(selector)) {
        evaluate = element.classList.contains(selector);
    } else {
        evaluate = element.tagName === selector.toUpperCase();
    }

    // evaluate가 true라면 해당 element를 반환하고
    if (evaluate) { 
        return element;
    }

    // 아니라면 다시 함수를 불러 이번에는 element의 부모 element를 호출함
    return getClosestElement(element.parentElement, selector);
}

export {
    getClosestElement,
};