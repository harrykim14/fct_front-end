const form = document.querySelector('#question-form');

(() => {
    fetch("../data/data.json")
        .then(res => res.json())
        .then(data => {
            const questions = data.questions;
            const answers = data.answers;

            questions.forEach(question => {
                let questionNumber = question.pk;
                let answerArray = [];
                answers.forEach(answer => {
                    if(questionNumber === answer.question) {
                        answerArray.push(answer);
                    }
                });
                form.appendChild(setElement(question, answerArray));
            });

            const questionItem = document.querySelectorAll('.question-item');
            const firstQuestionItem = questionItem[0];
            firstQuestionItem.classList.add('on');

            const btnBoxes = document.querySelectorAll('.btn-box');
            const firstBtnBox = btnBoxes[0];
            const lastBtnBox = btnBoxes[btnBoxes.length -1];

            // 첫 문항에는 이전 항목이 없으니 이전 버튼 없이 가운데 정렬
            firstBtnBox.innerHTML = '<button type="button" class="next-btn">다음</button>';
            firstBtnBox.classList.add('style-center');

            lastBtnBox.innerHTML = '<button type="button" class="previous-btn">이전</button><button type="submit" class="next-btn">제출</button>';
            
            const prevBtns = document.querySelectorAll('.previous-btn');
            const nextBtns = document.querySelectorAll('.next-btn');

            for (let prevBtn of prevBtns) {
                prevBtn.addEventListener('click', () => {
                    let current = document.querySelector('.question-item.on');
                    movePrev(current);
                })
            }

            for (let nextBtn of nextBtns) {
                nextBtn.addEventListener('click', () => {
                    const inpLines = document.querySelectorAll('.question-item.on input');
                    let isChecked = false;
                    inpLines.forEach(inp => {
                        if (inp.checked) {
                            let current = document.querySelector('.question-item.on');
                            moveNext(current);
                            isChecked = true;
                        }
                    })
                    if (!isChecked) {
                        alert("문항을 선택해주세요!");
                    }
                })
            }

            const statusBars = document.querySelectorAll('.status-bar');
            statusBars.forEach((statusBar, idx) => {
                statusBar.style.width = `${(Number(idx) + 1) * 10}%`;
            })

        })
})()

function setElement(question, answerArr) {
    const questionItem = document.createElement('div');
    questionItem.classList.add('question-item');

    const tempContainer = document.createElement('div');

    for(let idx in answerArr) {
        let answer = answerArr[idx];
        tempContainer.innerHTML += `<li class="answer-item">
            <input type="radio" name="question-${question.pk}" id="answer-${answer.pk}" value="${answer.developer}" />
            <label for="answer-${answer.pk}">${Number(idx) + 1}. ${answer.content}</label>
        </li>`;
   }

   questionItem.innerHTML = `
    <div class="status-box">
        <span>${question.pk}/10</span>
        <div class="status-bar"></div>
    </div>
        <div class="question-box">
        <h2>Q. ${question.content}</h2>
        <ol class="answer-list">
            ${tempContainer.innerHTML}
        </ol>
    </div>
    <div class="btn-box">
        <button type="button" class="previous-btn">이전</button>
        <button type="button" class="next-btn">다음</button>
    </div>`

    tempContainer.remove();
    return questionItem;
}

function moveNext(current) {
    current.classList.remove('on');
    let next = current.nextElementSibling;
    if (next) { 
        next.classList.add('on');
    }
}

function movePrev(current) {
    current.classList.remove('on');
    let prev = current.previousElementSibling;
    if (prev) { 
        prev.classList.add('on');
    }   
}