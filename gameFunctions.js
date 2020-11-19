import * as Constants from './constants.js';
import Cell from './classes/cell.js';
import { getRandomInteger } from './auxFunctions.js';

const cells = []
const matrix = []

function drawGameBoard(level, x1, x2, y1, y2, ctx) {
    let index = 0;
    for (let i = 0; i < level.height; i++) {
        matrix[i] = []
        for (let j = 0; j < level.width; j++) {
            let currentCell = new Cell(index, x1, x2, y1, y2);
            cells[index] = currentCell;   //TODO: USE ONLY ONE
            matrix[i][j] = currentCell;

            ctx.moveTo(currentCell.X1, currentCell.Y1 + Constants.cellSize);
            ctx.lineTo(currentCell.X2, currentCell.Y2);
            ctx.moveTo(currentCell.X1 + Constants.cellSize, currentCell.Y1);
            ctx.lineTo(currentCell.X2, currentCell.Y2);
            fillCell(ctx, currentCell, '#34baeb')
            x1 += Constants.cellSize;
            x2 += Constants.cellSize;
            index++;
        }
        x1 = 0;
        x2 = Constants.cellSize
        y1 += Constants.cellSize;
        y2 += Constants.cellSize;
    }
    console.log(matrix)
}

function getCurrentCell(mouseX, mouseY) {
    /* for (let i = 0; i < Constants.forLoopEnding; i++) {
        let currentCell = matrix[i][0];
        if (currentCell.Y2 > mouseY) {
            for (let j = 0; j < Constants.forLoopEnding; j++) {
                currentCell = matrix[i][j]
                if (currentCell.X2  > mouseX) {
                    return currentCell;
                }
            }
        }     
    } */

    for (let i = 0; i < cells.length; i++) {
        let currentCell = cells[i];
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

function displayCellImage(ctx, cell, imgID) {
    let img = document.getElementById(imgID);
    //new Image(Constants.cellSize, Constants.cellSize);
    //img.src = `${imgName}.png`;
    ctx.drawImage(img, cell.X1, cell.Y1);
}

function placeMines(level) {
    let minesIndexes = [];

    for (let i = 0; i < level.minesCount; i++) {
        let index = getRandomInteger(0, cells.length);
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

function endGame(ctx, mines) {
    mines.forEach(index => {
        displayCellImage(ctx, cells[index], 'mine');
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