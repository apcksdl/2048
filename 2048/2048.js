var board = Array(Array(0,0,0,0),Array(0,0,0,0),Array(0,0,0,0),Array(0,0,0,0));
var tableID = Array(Array("00","01","02","03"),Array("10","11","12","13"),Array("20","21","22","23"),Array("30","31","32","33"));
var score;

// 키보드 입력 처리
document.onkeydown = keyDownEventHandler;
function keyDownEventHandler(e){
    switch(e.keyCode){
        case 38: moveDir(0); break; //up
        case 40: moveDir(1); break; //down
        case 37: moveDir(2); break; //left
        case 39: moveDir(3); break; //right
    }
}

// 초기 설정
init();
function init(){
    score=0;
    for(var i=0;i<4;i++)
        for(var j=0;j<4;j++)
            board[i][j]=0;
    for(var i=0;i<2;i++){
        var rand = parseInt(Math.random()*16);
        var y = parseInt(rand / 4);
        var x = rand % 4;
        if(board[y][x]==0) board[y][x]=getNewNum();
        else i--;
    }
    update();
}

// 게임 화면 업데이트
function update(){
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            var cell = document.getElementById(tableID[i][j]);
            cell.innerHTML = board[i][j]==0?"":board[i][j];
            coloring(cell);
        }
    }
    document.getElementById("score").innerHTML=score;
}

// 칸 색칠
function coloring(cell){
    var cellNum = parseInt(cell.innerHTML);
    switch(cellNum){
        case 0:
        case 2:
            cell.style.color="#684A23";
            cell.style.background="#FBEDDC";
            break;
        case 4:
            cell.style.color="#684A23";
            cell.style.background="#F9E2C7";
            break;
        case 8:
            cell.style.color="#684A23";
            cell.style.background="#F6D5AB";
            break;
        case 16:
            cell.style.color="#684A23";
            cell.style.background="#F2C185";
            break;
        case 32:
            cell.style.color="#684A23";
            cell.style.background="#EFB46D";
            break;
        case 64:
            cell.style.color="#FFFFFF";
            cell.style.background="#EBA24A";
            break;
        case 128:
            cell.style.color="#FFFFFF";
            cell.style.background="#E78F24";
            break;
        case 256:
            cell.style.color="#FFFFFF";
            cell.style.background="#E87032";
            break;
        case 512:
            cell.style.color="#FFFFFF";
            cell.style.background="#E85532";
            break;
        case 1024:
            cell.style.color="#FFFFFF";
            cell.style.background="#E84532";
            break;
        case 2048:
            cell.style.color="#FFFFFF";
            cell.style.background="#E83232";
            break;
        default:
            if(cellNum>2048){
                cell.style.color="#FFFFFF";
                cell.style.background="#E51A1A";
            }
            else{
                cell.style.color="#684A23";
                cell.style.background="#FBEDDC";
            }
            break;
    }
}

// 보드판 이동 방향에 따른 회전 컨트롤
function moveDir(opt){
    switch(opt){
        case 0: move(); break; //up
        case 1: rotate(2); move(); rotate(2); break; //down
        case 2: rotate(1); move(); rotate(3); break; //left
        case 3: rotate(3); move(); rotate(1); break; //right
    }
    update();
}

// 보드판 회전
function rotate(n){
    while(n--){
        var tempBoard = Array(Array(0,0,0,0),Array(0,0,0,0),Array(0,0,0,0),Array(0,0,0,0));
        for(var i=0;i<4;i++)
            for(var j=0;j<4;j++)
                tempBoard[i][j]=board[i][j];
        for(var i=0;i<4;i++)
            for(var j=0;j<4;j++)
                board[j][3-i]=tempBoard[i][j];

    }
}

// 보드판 이동
function move(){
    var isMoved=false;
    var isPlused = Array(Array(0,0,0,0),Array(0,0,0,0),Array(0,0,0,0),Array(0,0,0,0));
    for(var i=1;i<4;i++){
        for(var j=0;j<4;j++){
            if(board[i][j]==0) continue;
            var tempY = i-1;
            while(tempY>0 && board[tempY][j]==0) tempY--;
            if(board[tempY][j]==0){
                board[tempY][j]=board[i][j];
                board[i][j]=0;
                isMoved=true;
            }
            else if(board[tempY][j]!=board[i][j]){
                if(tempY+1==i) continue;
                board[tempY+1][j]=board[i][j];
                board[i][j]=0;
                isMoved=true;
            }
            else{
                if(isPlused[tempY][j]==0){
                    board[tempY][j]*=2;
                    score+=board[tempY][j];
                    board[i][j]=0;
                    isPlused[tempY][j]=1;
                    isMoved=true;
                }
                else{
                    board[tempY+1][j]=board[i][j];
                    board[i][j]=0;
                    isMoved=true;
                }
            }
        }
    }
    if(isMoved) generate();
    else checkGameOver();
}

// 신규 숫자 생성
function generate(){
    var zeroNum=0;
    for(var i=0;i<4;i++)
        for(var j=0;j<4;j++)
            if(board[i][j]==0)
                zeroNum++;
    while(true){
        for(var i=0;i<4;i++){
            for(var j=0;j<4;j++){
                if(board[i][j]==0){
                    var rand = parseInt(Math.random()*zeroNum);
                    if(rand==0){
                        board[i][j]=getNewNum();
                        return;
                    }
                }
            }
        }
    }
}

// 숫자 생성 확률
function getNewNum(){
    var rand = parseInt(Math.random()*10);
    if(rand==0) return 4;
    return 2;
}

// 최대 점수 반환
function getMaxNum(){
    var ret=0;
    for(var i=0;i<4;i++)
        for(var j=0;j<4;j++)
            if(board[i][j]>ret)
                ret=board[i][j];
    return ret;
}

// 게임오버 체크
function checkGameOver(){
    for(var i=0;i<4;i++){
        var colCheck = board[i][0];
        if(colCheck==0) return;
        for(var j=1;j<4;j++){
            if(board[i][j]==colCheck || board[i][j]==0) return;
            else colCheck = board[i][j];
        }
    }
    for(var i=0;i<4;i++){
        var rowCheck = board[0][i];
        if(rowCheck==0) return;
        for(var j=1;j<4;j++){
            if(board[j][i]==rowCheck || board[j][i]==0) return;
            else rowCheck = board[j][i];
        }
    }
    gameover();
}

// 알림을 표시할 부모 엘리먼트
const notificationsContainer = document.getElementById('notifications-container');

// 게임오버 처리
function gameover() {
    // 게임 종료 시 아이디와 점수를 서버로 전송
    const username = getCookie('user');

    fetch('/gameover', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, score }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);

        // 게임 오버 시 사용자에게 아이디와 점수를 보여줄 엘리먼트 생성
        const gameOverMessage = document.createElement('p');

        // 랭킹 모달에 아이디와 점수를 추가
        const rankingList = document.getElementById('rankingList');
        const rankingItem = document.createElement('li');
        rankingItem.innerHTML = `아이디: ${username}, 점수: ${score}`;
        rankingList.appendChild(rankingItem);

        // 랭킹 모달에 게임 오버 메시지 추가
        rankingList.appendChild(gameOverMessage);

        // 모달 열기
        openRankingModal();

        // 기존 gameover 함수 내용 추가
        init();
        update();
    })
    .catch(error => console.error('Error:', error));
}


// 2048.html 내의 스크립트 부분
document.addEventListener('DOMContentLoaded', function () {
    // 쿠키에서 아이디를 가져와 표시
    var username = getCookie('user');
    if (username) {
        document.getElementById('usernameDisplay').innerHTML = '아이디: ' + username;
    }
});

// 쿠키를 이름으로 가져오는 함수
function getCookie(name) {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        var cookieParts = cookie.split('=');
        if (cookieParts[0] === name) {
            return cookieParts[1];
        }
    }
    return '';
}
// 랭킹 모달 열기 함수
function openRankingModal() {
    document.getElementById('rankingModal').style.display = 'block';
}

// 랭킹 모달 닫기 함수
function closeRankingModal() {
    document.getElementById('rankingModal').style.display = 'none';
}
// 키보드 입력 처리
document.onkeydown = function (e) {
    // 랭킹 모달이 열려있으면 키보드 입력 무시
    if (isRankingModalOpen()) {
        return;
    }

    switch (e.keyCode) {
        case 38: moveDir(0); break; //up
        case 40: moveDir(1); break; //down
        case 37: moveDir(2); break; //left
        case 39: moveDir(3); break; //right
    }
};

// 랭킹 모달이 열려있는지 확인하는 함수
function isRankingModalOpen() {
    const rankingModal = document.getElementById('rankingModal');
    return rankingModal.style.display === 'block';
}