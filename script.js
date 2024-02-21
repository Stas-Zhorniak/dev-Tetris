"use strict";

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
    const startRow = Math.floor(matrix.length / 2);
    const startColumn = Math.floor(PLAYFIELD_COLUMNS / 2) - Math.floor(matrix[0].length / 2);

    tetramino = {
        name,
        matrix,
        row: startRow,
        column: startColumn
    }
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
        if(!tetramino.matrix[row][column]) continue;

        const cellIndex = convertPositionToIndex(tetramino.row + row, tetramino.column + column);
        cells[cellIndex].classList.add(name);
    }
 }
}


function draw() {
    cells.forEach(cell => cell.removeAttribute('class'));
    drawPlayField();
    drawTetramino();
}

draw();


document.addEventListener("keydown", onKeyDown);

function onKeyDown(e){
    switch(e.key) {
        case 'ArrowDown':
            moveTetraminoDown();
            break;
        case 'ArrowLeft':
            moveTetraminoLeft();
            break;
        case 'ArrowRight':
            moveTetraminoRight();
            break;
        case 'spaceRotate':
            rotateTetramino();
            break;

    }
    draw();
}

function moveTetraminoDown() {
    tetramino.row += 1;
}

function moveTetraminoLeft() {
    tetramino.column -= 1;
}

function moveTetraminoRight() {
    tetramino.column += 1;
}