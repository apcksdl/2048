const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 1232;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const userDataFile = 'userData.json';
const rankingDataFile = 'rankingData.json';  // 추가: 랭킹 데이터 파일

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    res.cookie('user', username, { maxAge: 3600000 });
    let userData = JSON.parse(fs.readFileSync(userDataFile, 'utf-8'));
    const user = userData.find(user => user.username === username);

    if (user) {
        if (user.password === password) {
            res.redirect('/2048.html');
        } else {
            res.send('비밀번호가 잘못되었습니다. <a href="/">다시 시도</a>');
        }
    } else {
        userData.push({ username, password }); // 랭킹 정보 초기화
        fs.writeFileSync(userDataFile, JSON.stringify(userData, null, 2), 'utf-8');
        res.send('회원가입이 완료되었습니다. <a href="/">로그인</a>');
    }
});

app.get('/logout', (req, res) => {
    res.sendFile(__dirname + '/logout.html');
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});

// 게임오버 처리
app.post('/gameover', (req, res) => {
    const { username, score } = req.body;

    // 사용자 정보를 userData.json에서 가져오기
    let userData = JSON.parse(fs.readFileSync(userDataFile, 'utf-8'));
    const user = userData.find(user => user.username === username);

    if (user) {
        user.rankings.push({ score });
        fs.writeFileSync(userDataFile, JSON.stringify(userData, null, 2), 'utf-8');
        res.json({ message: 'Score saved successfully.' });
    } else {
        res.status(404).json({ message: 'User not found.' });
    }
});

