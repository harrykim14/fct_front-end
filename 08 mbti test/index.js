/* 서버 구동에 필요한 소스코드 */
const express = require('express'); // 모듈을 로드하는 node 구문 require
const app = express();
const path = require('path'); // 파일이나 디렉토리 작업을 위한 모듈

app.use(express.json()); // express 서버에서 json 파일을 파싱 가능하게 설정
app.use(express.urlencoded({ extended: true })); // url query string을 파싱 가능하도록 설정
app.use(express.static(path.join(__dirname, "src"))); // src 폴더(__dirname) 내 파일을 사용할 수 있도록 static으로 지정

/* 주소별 라우팅 */
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "src/index.html"));
})

app.get("/question", (req, res) => {
    res.sendFile(path.join(__dirname, "src/components/question.html"));
})

app.get("/result/[1-5]", (req, res) => {
    res.sendFile(path.join(__dirname, "src/components/result.html"));
})

app.post('/submit', (req, res) => {
    const data = req.body;
    let numberArr = [0, 0, 0, 0, 0];
    for(let i = 1; i < 11; i++) {
        let developerNum = Number(data[`question-${i}`]);
        numberArr[developerNum - 1] += 1;
    }

    let maxValue = 0;
    let maxValueIdx = 0;

    for (let i = 0; i < numberArr.length; i++) {
        if (numberArr[i] > maxValue) {
            maxValue = numberArr[i];
            maxValueIdx = i;
        }
    }
    res.redirect('/result/' + (maxValueIdx + 1));
})

app.listen(3000, () => {
    console.log("Server Running on 3000");
})


