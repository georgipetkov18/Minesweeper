import * as Constants from './constants.js';
import Cell from './classes/cell.js';
import { getRandomInteger } from './auxFunctions.js';

const matrix = []

function drawGameBoard(level, x1, x2, y1, y2, ctx) {
    fillBoard(ctx, 0, 0, level.width * Constants.cellSize, level.height * Constants.cellSize, '#34baeb');
    drawLines(level, ctx)
    let id = 0;

    for (let i = 0; i < level.height; i++) {
        matrix[i] = [];

        for (let j = 0; j < level.width; j++) {

            let currentCell = new Cell(id, x1, x2, y1, y2);
            matrix[i][j] = currentCell;    
            x1 += Constants.cellSize;
            x2 += Constants.cellSize;
            id++;
        }  

        x1 = 0;
        x2 = Constants.cellSize
        y1 += Constants.cellSize;
        y2 += Constants.cellSize;
    }
}

function drawLines(level, ctx) {
    for (let i = 0; i <= level.height; i++) {
        ctx.moveTo(0, i * Constants.cellSize);
        ctx.lineTo(level.width * Constants.cellSize, i * Constants.cellSize);
        ctx.stroke();
    }

    for (let i = 0; i <= level.width; i++) {
        ctx.moveTo(i * Constants.cellSize, 0);
        ctx.lineTo(i * Constants.cellSize, level.height * Constants.cellSize);
        ctx.stroke();
        
    }
}

function getCurrentCell(level, mouseX, mouseY) {
    for (let i = 0; i < level.width * level.height; i++) {
        let currentCell = getCellByID(level, i);
        if (currentCell.Y2 > mouseY && currentCell.X2 > mouseX) {
            return currentCell;
        }

    }
}

function fillCell(ctx, cell, color) {
    ctx.fillStyle = color;
    ctx.fillRect(cell.X1, cell.Y1, cell.X2 - cell.X1, cell.Y2 - cell.Y1)
    ctx.stroke();
}

function fillBoard(ctx, x1, x2, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x1, x2, width, height)
    ctx.stroke();
}

function displayCellImage(ctx, cell, imgID) {
    let img = document.getElementById(imgID);
    ctx.drawImage(img, cell.X1, cell.Y1);
}

function placeMines(level) {
    let minesIndexes = [];

    for (let i = 0; i < level.minesCount; i++) {
        let index = getRandomInteger(0, level.width * level.height);
        let currentCell = getCellByID(level, index);
        let surroundings = getSurroundingCells(level, currentCell)

        if (minesIndexes.includes(index) || allAreMines(minesIndexes, surroundings)) {
            i--;
        }
        else {
            minesIndexes[i] = index;
        }
    }
    return minesIndexes;
}

function allAreMines(mines, surroundingCells) {
    for (let i = 0; i < surroundingCells.length; i++) {
        if (!mines.includes(surroundingCells[i])) {
            return false;
        }
        
    }
    return true;
}

function getCellByID (level, ID) {
    let row = Math.floor(ID / level.width);
    let col = ID % level.width;
    return matrix[row][col];
}

function endGame(level, ctx, mines) {
    mines.forEach(index => {
        let currentCell = getCellByID(level, index);
        displayCellImage(ctx, currentCell, 'mine');
    });
}

function placeNumbers(level, mines) {
    for (let i = 0; i < level.height; i++) {
        for (let j = 0; j < level.width; j++) {
            let currentCell = matrix[i][j];
            if (mines.includes(currentCell.ID)) {
                markSurroundingCells(level, i, j);
            }
        }
    }
}

function revealEmptyCells(level, ctx, cell, mines) {
    if (mines.includes(cell.ID)){
        return;
    }

    else if (cell.Status === 'marked'){
        cell.isClicked = false;
        return;
    }
    else if (cell.minesAround > 0) {
        displayCellImage(ctx, cell, cell.minesAround);
        return;
    }
    fillCell(ctx, cell, '#c5dde6');
    cell.shown = true;
    let surroundingCells = getSurroundingCells(level, cell);
    surroundingCells.forEach(c => {
        if (c.shown == false){
            c.isClicked = true;
            revealEmptyCells(level, ctx, c, mines);
        }
    })
};

function markSurroundingCells(level, i, j) {
    if (i - 1 >= 0) {
        matrix[i - 1][j].minesAround += 1;
    }
    if (j - 1 >= 0) {
        matrix[i][j - 1].minesAround += 1;
    }
    if (i - 1 >= 0 && j - 1 >= 0) {
        matrix[i - 1][j - 1].minesAround += 1;
    }
    if (i + 1 < level.height) {
        matrix[i + 1][j].minesAround += 1;
    }
    if (j + 1 < level.width) {
        matrix[i][j + 1].minesAround += 1;
    }
    if (i + 1 < level.height && j + 1 < level.width) {
        matrix[i + 1][j + 1].minesAround += 1;
    }
    if (i - 1 >= 0 && j + 1 < level.width) {
        matrix[i - 1][j + 1].minesAround += 1;
    }
    if (j - 1 >= 0 && i + 1 < level.height) {
        matrix[i + 1][j - 1].minesAround += 1;
    }
}

function getSurroundingCells(level, cell){
    let i = Math.floor(cell.ID / level.width);
    let j = cell.ID % level.width;
    let surroundings = []
    let index = 0;
    if (i - 1 >= 0) {
        surroundings[index] = matrix[i - 1][j];
        index++;
    }
    if (j - 1 >= 0) {
        surroundings[index] = matrix[i][j - 1];
        index++;
    }
    if (i - 1 >= 0 && j - 1 >= 0) {
        surroundings[index] = matrix[i - 1][j - 1];
        index++;
    }
    if (i + 1 < level.height) {
        surroundings[index] = matrix[i + 1][j];
        index++;
    }
    if (j + 1 < level.width) {
        surroundings[index] = matrix[i][j + 1];
        index++;
    }
    if (i + 1 < level.height && j + 1 < level.width) {
        surroundings[index] = matrix[i + 1][j + 1];
        index++;
    }
    if (i - 1 >= 0 && j + 1 < level.width) {
        surroundings[index] = matrix[i - 1][j + 1];
        index++;
    }
    if (j - 1 >= 0 && i + 1 < level.height) {
        surroundings[index] = matrix[i + 1][j - 1];
        index++;
    }

    return surroundings;
}

export { drawGameBoard, getCurrentCell, fillCell, displayCellImage, placeMines, placeNumbers, revealEmptyCells, endGame }