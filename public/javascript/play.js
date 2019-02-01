const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

const scale = 20;
const boardWidth = 240;
const boardHeight = 400;
const arenaWidth = boardWidth / scale;
const arenaHeight = boardHeight / scale;
ctx.scale(scale, scale); // 좌표의 기저값 변경

// blocks - 추후 수정
const matrix = [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0],
];

let player = {pos: null, matrix: null};
let arena; // 플레이어의 현재 보드상태

// for update block
let lastTime = null;
let interval = 1000; // 1 second
let deltaTime = 0; // AC(누산기)

/////////////////////////////////////////
// 충돌 검증
function isCollided(){
    const m = player.matrix;
    const o = player.pos;

    for(let y = 0; y < m.length; y++){
        for(let x = 0; x < m[y].length; x++){
            if((arena[o.y + y] && arena[o.y + y][o.x + x]) !== 0 
            // y 좌표를 넘지 않으면서 arena[y][x]의 값이 존재하는 경우
            && m[y][x] !==0) 

            return true;
        }
    }
    return false;
}

function merge(){
    matrix.forEach((row, y) => { // element, index
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = 1;
            }
        });
    });
}

///////////////////////////////////////////
// 움직임
function moveDown(){
    player.pos.y++;

    if(isCollided()){
        player.pos.y--;
        merge();
        player.pos.y = 0;
    }

    deltaTime = 0;
}

function moveXaxis(dir){
    player.pos.x += dir;
    
    if(isCollided())
        player.pos.x -= dir;
}

//////////////////////////////////////
// 초기화 관련 함수
function createMatrix(width, height){
    let ret = [];
    for(let y = 0; y < height; y++){
        ret.push(new Array(width).fill(0));
    }

    return ret;
}

///////////////////////////////////////
// 그리기 관련 함수
function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => { // element, index
        row.forEach((value, x) => {
            if (value !== 0) {
                ctx.fillStyle = 'red';
                ctx.fillRect(x + offset.x, y + offset.y, 1, 1); // x, y, width, height
            }
        });
    });
}

function draw(){
    ctx.fillStyle = "#000"; // black
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawMatrix(arena, {x: 0, y: 0});
    drawMatrix(matrix, player.pos);
}

function update(timestamp){ // timestamp : 대기열에 들어간 콜백들이 실행되기 시작하는 시점의 시간을 가리킨다.
    if(!lastTime) 
        lastTime = timestamp;

    deltaTime += timestamp - lastTime; 
    lastTime = timestamp;

    if(deltaTime > interval){
        moveDown();
    }
    draw();

    window.requestAnimationFrame(update);
}

function addListener(){
    window.addEventListener('keydown', event =>{
        switch(event.keyCode){
            case 37:  // left arrow
                moveXaxis(-1);
                break;
            case 39: // right arrow
                moveXaxis(1);
                break;
            case 40: // down arrow
                moveDown();
                break;
        }
    });
}

function initGame(){
    player.pos = {x: 5, y:0};
    player.matrix = matrix;
    arena = createMatrix(arenaWidth, arenaHeight);
    addListener();
}

function play(){
    initGame();
    update(0);
}

play();