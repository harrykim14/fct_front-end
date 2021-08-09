const defaultLocation = [];
const movePeaceArr = []; // default 위치에서 얼만큼 이동했는지 저장하는 배열

const peaces = document.querySelectorAll('.peace');
const voidPeace = document.querySelector('.void');
const moveCount = document.querySelector('.move_count');
const timer = document.querySelector('.timer');
const answer = document.querySelector('.answer');
const puzzle = document.querySelector('.puzzle');

let move = 0;
let time = 0;
let timeCounter = null;

function convertNum(num) {
    return num > 9 ? num : '0' + num;
}

function setTime() {
    const minutes = Math.floor(time / 60)
    const seconds = time - minutes * 60
    timer.innerHTML = convertNum(minutes) + ':' + convertNum(seconds)
}

function timeCount() {
    time++;
    setTime();
}

function moveCountDisplay() {
    moveCount.innerHTML = ++move;
}

function initMoveTime() {
    move = 0;
    time = 0;
    moveCount.innerHTML = move;
    if(timeCounter) {
        clearInterval(timeCounter);
        setTime();
    }
}

// 현재 위치에서 이동한 위치를 확인하고 정답과 비교하여 모든 퍼즐의 이동한 거리가 0일 때 정답으로 처리
function answerCheck() {
    let isAnswer = true
    for (let i = 0; i < movePeaceArr.length; i++) {
        if (movePeaceArr[i][0] !== 0 || movePeaceArr[i][1] !== 0 ){
            isAnswer = false
            break
        }
    }
    if (isAnswer) {
        answerView();
    } else {
        console.log("아직 다 못맞췄네요...")
    }
}

// 퍼즐 이동
function peaceMove(target, checkVoid, dir) {
    if (checkVoid) {
        movePeaceArr[target.id - 1] = [movePeaceArr[target.id - 1][0] + dir[0], movePeaceArr[target.id - 1][1] + dir[1]];
        movePeaceArr[checkVoid.id - 1] = [movePeaceArr[checkVoid.id - 1][0] - dir[0], movePeaceArr[checkVoid.id - 1][1] - dir[1]];

        target.style.transform = `translate(${movePeaceArr[target.id - 1][0]}px, ${movePeaceArr[target.id - 1][1]}px)`;
        checkVoid.style.transform = `translate(${movePeaceArr[checkVoid.id - 1][0]}px, ${movePeaceArr[checkVoid.id - 1][1]}px)`;
    }
    console.log(movePeaceArr);
}

// 빈 공간인지 확인하기
function isVoid(checkVoid) {
    if (checkVoid.className) {
        if (checkVoid.className === 'void') {
            return true
        }
    }
}

function answerView() {
    document.querySelector('.answer_move').innerHTML = `move : ${moveCount.innerHTML}`    
    document.querySelector('.answer_time').innerHTML = `time : ${timer.innerHTML}`

    puzzle.removeEventListener('click', moveEvent)
    initMoveTime()
    answer.style.display = 'block'
}

// 클릭한 퍼즐 기준 상하좌우 빈 공간 찾기
function findVoid(target, x, y) {
    // target 기준으로 상,하,좌,우 좌표
    // margin을 포함해 각 객체의 거리는 80이다
    const dir = [[0, -80],[0, 80],[-80, 0],[80, 0]]; 

    // 퍼즐에 border-radius속성으로 인해 선택이 되지않음, 
    // target 퍼즐 가운데 위치로 지정(70x70크기의 div이므로 35,35부분을 선택)
    const X = x + 35
    const Y = y + 35

    for (const d of dir) {
        const checkVoid = document.elementFromPoint(X + d[0], Y + d[1])
        if (isVoid(checkVoid)) {
            return [checkVoid, d]
        }
    }
}

// 클릭한 퍼즐의 좌표(x, y) 추출
function moveEvent(e) {
    const target = e.target;
    let resultFind;

    if(target.className === 'peace') {
        // 클릭한 피스의 x,y 좌표를 구하기
        const { x, y } = target.getBoundingClientRect();
        // void가 있는지 확인하기
        resultFind = findVoid(target, x, y);
        peaceMove(target, ...resultFind);
        moveCountDisplay();
        answerCheck();
    }
}

// 좌표값을 랜덤으로 섞고 바뀐 좌표와 default 좌표의 차이를 입력하기
function random() {
    const sample = [5, 3, 12, 4, 6, 13, 1, 7, 9, 14, 16, 8, 11, 10, 2, 15];
    const moveLocation = [];

    // sample 배열을 이용하여 피스의 위치를 매핑
    for (const idx in sample) {
        moveLocation[sample[idx]-1] = defaultLocation[idx];
    }

    // 이동할 피스의 위치와 원래 조각의 위치 차이를 구하고
    // 움직여야하는 거리를 구하고 최종적으로 반영될 배열에 넣어준다
    for (let i = 0; i < defaultLocation.length; i++) {
        movePeaceArr[i] = [
            moveLocation[i][0] - defaultLocation[i][0],
            moveLocation[i][1] - defaultLocation[i][1],
        ]
    }

}

function setPeace() {
    peaces.forEach((el, i) => el.style.transform = `translate(${movePeaceArr[i][0]}px, ${movePeaceArr[i][1]}px)`)
    voidPeace.style.transform = `translate(${movePeaceArr[movePeaceArr.length - 1][0]}px, ${movePeaceArr[movePeaceArr.length - 1][1]}px)`
}

function gameStart() {
    initMoveTime();
    random();
    puzzle.addEventListener('click', moveEvent);
    setPeace();
    timeCounter = setInterval(timeCount, 1000);
}

function resetGame() {
    setPeace();
    puzzle.removeEventListener('click', moveEvent);
    initMoveTime();
}

function init() {
    document.querySelector('.start_btn').addEventListener('click', gameStart);
    document.querySelector('.reset_btn').addEventListener('click', resetGame);
    document.querySelector('.answer_btn').addEventListener('click', () => answer.style.display = 'none');

    // parseInt 없는 부분
    // peaces.forEach(el => {
    //     const { x, y } = el.getBoundingClientRect();
    //     defaultLocation.push([x, y]);
    // })
    // const { x, y } = voidPeace.getBoundingClientRect();
    // defaultLocation.push([x, y]);

    // parseInt 있는 부분
    peaces.forEach(el => {
        const { x, y } = el.getBoundingClientRect();
        defaultLocation.push([parseInt(x, 10), parseInt(y, 10)]);
    })
    const { x, y } = voidPeace.getBoundingClientRect();
    defaultLocation.push([parseInt(x, 10), parseInt(y, 10)]);

    console.log("movePeaceArr:", movePeaceArr);
    console.log("defaultLocation", defaultLocation);

    for (let i = 0; i < peaces.length; i++) {
        movePeaceArr[i] = [0, 0];
    }
}

init();