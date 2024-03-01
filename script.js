
const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;
const btnRestart = document.querySelector('.btn-restart');
const scoreElement = document.querySelector('.score');
const overlay = document.querySelector('.overlay');
const spaceBtn = document.querySelectorAll('.nav svg #Space-btn path');
const escBtn = document.querySelectorAll('.nav svg #Escape-btn path');
const leftBtn = document.querySelectorAll('.nav svg #Left-btn path');
const downBtn = document.querySelectorAll('.nav svg #Down-btn path');
const upBtn = document.querySelectorAll('.nav svg #Up-btn path');
const rightBtn = document.querySelectorAll('.nav svg #Right-btn path');
const restartBtn = document.querySelector('.nav svg #Restart-btn');

let isGameOver = false;
let timedId = null;
let isPaused = false;
let playField;
let tetramino;
let score = 0;
let startTime;

const TETRAMINO_NAMES = [
    'O',
    'J',
    'L',
    'T',
    'I',
    'Z',
    'S'
]

const TETRAMINOES = {
    'O': [
        [1,1],
        [1,1]
    ],

    'J': [
        [0,0,1],
        [0,0,1],
        [0,1,1]
    ],

    'L': [
        [1,0,0],
        [1,0,0],
        [1,1,0]
    ],

    'T': [
        [1,1,1],
        [0,1,0],
        [0,0,0]
    ],

    'I': [
        [0,1,0],
        [0,1,0],
        [0,1,0],
        [0,1,0]
    ],

    'Z': [
        [1,1,0],
        [0,1,1],
        [0,0,0]
    ],

    'S': [
        [0,1,1],
        [1,1,0],
        [0,0,0]
    ]

}
let cells;
 init();

function init(){
    score = 0;
    scoreElement.innerHTML = 0;
    isGameOver = false;
    startTime = Date.now();
    generatePlayField();
    generateTetramino();
    cells = document.querySelectorAll('.grid div');
    moveDown();
    
}

btnRestart.addEventListener("click", function(){
    document.querySelector('.grid').innerHTML = '';
    overlay.style.display = "none";
    init();
})

function convertPositionToIndex(row, column) {
    return row * PLAYFIELD_COLUMNS + column;
}

function countScore(destroyRows){
    switch(destroyRows){
        case 1:
            score += 10;
            break;
        case 2: 
            score += 20;
                break;
        case 3: 
            score += 50;
                break;
        case 4: 
            score += 100;
                break;
    }
    scoreElement.innerHTML = score;
}

function generatePlayField () {
    for(let i=0; i < PLAYFIELD_ROWS * PLAYFIELD_COLUMNS; i++) {
        const div = document.createElement("div");
        document.querySelector(".grid").append(div);
    }

    playField = new Array(PLAYFIELD_ROWS).fill()
                    .map(() => new Array(PLAYFIELD_COLUMNS).fill(0));
}

function generateTetramino () {

    const name = TETRAMINO_NAMES[Math.floor(Math.random() * TETRAMINO_NAMES.length)];;
    const matrix = TETRAMINOES[name];
    const startColumn = Math.floor(PLAYFIELD_COLUMNS / 2) - Math.floor(matrix[0].length / 2);
    const rowTetro = -2;

    tetramino = {
        name,
        matrix,
        row: rowTetro,
        column: startColumn
    }
}

function placeTetramino() {
    const matrixSize = tetramino.matrix.length;
    for(let row = 0; row <matrixSize; row++) {
        for (let column = 0; column < matrixSize; column++) {
            
            if(isOutsideOfTopboard(row)) {
                isGameOver = true;
                return;
            }
            
            if(tetramino.matrix[row][column]){
                playField[tetramino.row + row][tetramino.column + column] = tetramino.name;
            }
            
        }
    }

    const filledRows = findFilledRows();
    removeFillRows(filledRows);
    generateTetramino();
    countScore(filledRows.length);
}


function removeFillRows(filledRows){
    for(let i = 0; i < filledRows.length; i++){
        const row = filledRows[i];
        dropRowsAbove(row);
    }
}

function dropRowsAbove(rowDelete){
    for(let row = rowDelete; row > 0; row--){
        playField[row] = playField[row - 1];
    }

    playField[0] = new Array(PLAYFIELD_COLUMNS).fill(0);
}

function findFilledRows(){
    const fillRows = [];
    for(let row = 0; row < PLAYFIELD_ROWS; row++){
        let filledColumns = 0;
        for(let column = 0; column < PLAYFIELD_COLUMNS; column++){
            if(playField[row][column] != 0){
                filledColumns++;
            }
        }
        // for 2
        if(PLAYFIELD_COLUMNS === filledColumns){
            fillRows.push(row);
        }
        // if
    }
    // for 1

    return fillRows;
}

function drawPlayField () {
    for(let row = 0; row < PLAYFIELD_ROWS; row++) {
        for (let column =0; column < PLAYFIELD_COLUMNS; column++) {
            if (playField[row][column] == 0) continue;
            
            const name = playField[row][column];
            const cellIndex = convertPositionToIndex(row, column);
            cells[cellIndex].classList.add(name);
            }
        }
    }

function drawTetramino () {

const name = tetramino.name;
const tetraminoMatrixSize = tetramino.matrix.length;
 for(let row = 0; row < tetraminoMatrixSize; row++){
    for(let column = 0; column < tetraminoMatrixSize; column++){
        // const cellIndex = convertPositionToIndex(tetramino.row + row, tetramino.column + column);
        // cells[cellIndex].innerHTML = showRotated[row][column];
        if(isOutsideOfTopboard(row)) continue;
        if(!tetramino.matrix[row][column]) continue;
        const cellIndex = convertPositionToIndex(
            tetramino.row + row, 
            tetramino.column + column);
        cells[cellIndex].classList.add(name);
    }
 }
}

function draw() {
    cells.forEach(cell => cell.removeAttribute('class'));
    drawPlayField();
    drawTetramino();
}

function rotateTetramino() {
    const oldMatrix = tetramino.matrix;
    const rotatedMatrix = rotateMatrix(tetramino.matrix);
    // showRotated = rotateMatrix(tetramino.matrix);
    tetramino.matrix = rotatedMatrix;
    if(!isValid()){
        tetramino.matrix = oldMatrix;
    }

}

function rotate () {
    rotateTetramino();
    draw();
}

document.addEventListener("keydown", onKeyDown);

function onKeyDown(e){
    if(e.key == "Escape") {
        togglePauseGame();
    }
    if (!isPaused) {
        switch(e.key) {
            case ' ':
            dropTetraminoDown();
            spaceBtn.forEach(item => {
                item.style.fill = "white";
            });
            break;
            case 'ArrowUp':
                rotate();
                upBtn.forEach(item => {
                    item.style.fill = "white";
                });
                break;
            case 'ArrowDown':
                moveTetraminoDown();
                downBtn.forEach(item => {
                    item.style.fill = "white";
                });
                break;
            case 'ArrowLeft':
                moveTetraminoLeft();
                leftBtn.forEach(item => {
                    item.style.fill = "white";
                });
                break;
            case 'ArrowRight':
                moveTetraminoRight();
                rightBtn.forEach(item => {
                    item.style.fill = "white";
                });
                break;
            }
        }
    
    draw();
}

function dropTetraminoDown () {
    while(isValid()) {
        tetramino.row++;
    }
    tetramino.row--;
}

function togglePauseGame(){
    if (isPaused === false) {
        stopLoop();
        overlay.style.display = "flex";
        escBtn.forEach(item => {
            item.style.fill = "white";
        })
    } else {
        startLoop();
        overlay.style.display = "none";
        escBtn.forEach(item => {
            item.style.fill = "black";
        })
    }
    isPaused = !isPaused;
}

function rotateMatrix(matrixTetramino) {
    const N = matrixTetramino.length;
    const rotateMatrix = [];
    for (let i = 0; i < N; i++) {
        rotateMatrix[i] = [];
        for (let j = 0; j < N; j++){
            rotateMatrix[i][j] = matrixTetramino[N - j - 1][i]; 
        }
    }
    return rotateMatrix;
}

function moveTetraminoDown() {
    tetramino.row += 1;
    if (!isValid()){
        tetramino.row -=1;
        placeTetramino();
    }
}

function moveTetraminoLeft() {
    tetramino.column -= 1;
    if (!isValid()){
        tetramino.column +=1;
    }
}

function moveTetraminoRight() {
    tetramino.column += 1;
    if (!isValid()){
        tetramino.column -=1;
    }
}


function moveDown(){
    moveTetraminoDown();
    draw();
    stopLoop();
    startLoop();
    if(isGameOver){
        gameOver();
    }
}

function gameOver() {
    stopLoop();
    overlay.style.display = "flex";

    const resultsContainer = document.querySelector('.results');
    resultsContainer.innerHTML = `
        <div class="result-item">Время игры: <span id="game-time"></span></div>
        <div class="result-item">Набранные баллы: <span id="game-score"></span></div>`;

    const gameTimeElement = document.getElementById('game-time');
    const gameScoreElement = document.getElementById('game-score');

    const gameTimeInSeconds = Math.floor((Date.now() - startTime) / 1000);
    const gameTimeMinutes = Math.floor(gameTimeInSeconds / 60);
    const gameTimeSeconds = gameTimeInSeconds % 60;

    gameTimeElement.textContent = `${gameTimeMinutes} мин ${gameTimeSeconds} сек`;
    gameScoreElement.textContent = score;

}

function startLoop(){
    if (!timedId) {
        timedId = setTimeout(()=>{ requestAnimationFrame(moveDown) }, 700)
    }
}

function stopLoop(){
    cancelAnimationFrame(timedId);
    clearTimeout(timedId);
    timedId = null;
}

function isValid() {
    const matrixSize = tetramino.matrix.length;
    for(let row = 0; row <matrixSize; row++) {
        for (let column = 0; column < matrixSize; column++) {
            // if(tetramino.matrix[row][column]) continue;
            
            if (isOutsideOfGameboard(row, column)) {
                return false;
            }
            if (hasCollisions(row, column)) { 
                return false;
            }
        }
    }
    return true;
}

function isOutsideOfTopboard(row){
    return tetramino.row + row < 0;
}

function isOutsideOfGameboard (row, column) {
return tetramino.matrix[row][column] &&
(
    tetramino.column + column < 0 || 
    tetramino.column + column >= PLAYFIELD_COLUMNS ||
    tetramino.row + row >= PLAYFIELD_ROWS
);
}

function hasCollisions(row,column) {
    return tetramino.matrix[row][column] && playField[tetramino.row + row]?.[tetramino.column + column];
}
 
    document.addEventListener("keyup", function (e) {
        switch(e.key) {
            case ' ':
            spaceBtn.forEach(item => {
                item.style.fill = "black";
            });
            break;
            case 'ArrowUp':
                upBtn.forEach(item => {
                    item.style.fill = "black";
                });
                break;
            case 'ArrowDown':
                downBtn.forEach(item => {
                    item.style.fill = "black";
                });
                break;
            case 'ArrowLeft':
                leftBtn.forEach(item => {
                    item.style.fill = "black";
                });
                break;
            case 'ArrowRight':
                rightBtn.forEach(item => {
                    item.style.fill = "black";
                });
                break;
            }
        })
    restartBtn.addEventListener("click", function () {
        document.querySelector('.grid').innerHTML = '';
    overlay.style.display = "none";
    init();
    }) ;