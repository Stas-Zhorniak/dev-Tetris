"use strict";

const scoreElement = document.querySelector('.score');
const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;
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


function convertPositionToIndex(row, column) {
    return row * PLAYFIELD_COLUMNS + column;
}


let playField;
let tetramino;
let score = 0;

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
                    .map(() => new Array(PLAYFIELD_COLUMNS).fill(0))
    // console.table(playField)
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

generatePlayField();
generateTetramino();
const cells = document.querySelectorAll('.grid div');

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

// let showRotated = [
//     [1,2,3],
//     [4,5,6],
//     [7,8,9]
// ];


function rotateTetramino() {
    const oldMatrix = tetramino.matrix;
    const rotatedMatrix = rotateMatrix(tetramino.matrix);
    // showRotated = rotateMatrix(tetramino.matrix);
    tetramino.matrix = rotatedMatrix;
    if(!isValid()){
        tetramino.matrix = oldMatrix;
    }

}
// draw();

function rotate () {
    rotateTetramino();
    draw();
}

document.addEventListener("keydown", onKeyDown);

function onKeyDown(e){
    switch(e.key) {
        case 'ArrowUp':
            rotate();
            break;
        case 'ArrowDown':
            moveTetraminoDown();
            break;
        case 'ArrowLeft':
            moveTetraminoLeft();
            break;
        case 'ArrowRight':
            moveTetraminoRight();
            break;
    }
    draw();
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
}
let timedId = null;
moveDown();
function startLoop(){
    setTimeout(()=>{ timedId = requestAnimationFrame(moveDown) }, 700)
}

function stopLoop(){
    cancelAnimationFrame(timedId);
    timedId = clearTimeout(timedId);
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
    return tetramino.matrix[row][column] 
    && playField[tetramino.row + row]?.[tetramino.column + column];
}
 