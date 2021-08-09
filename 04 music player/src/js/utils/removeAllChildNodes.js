// 자신의 모든 자식 엘리먼트를 제거한다
export default (parent) => {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}