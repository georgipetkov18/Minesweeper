import * as Engine from './gameFunctions.js';
import { cellSize, levels } from './constants.js';
import Timer from './classes/timer.js';


var levelDiv = document.getElementById('levels');
var levelNames = levelDiv.children;

for (let i = 0; i < levelNames.length; i++) {
    levelNames[i].addEventListener('click', () => {
        history.pushState({}, "", `${window.location.href}${levelNames[i].id}`)
        startGame(levelNames[i].id)
    });

}

function startGame(gameLevel) {
    var gameSpace = document.getElementById('game');
    levelDiv.style.display = 'none';
    gameSpace.style.display = 'initial';
    var levelName = levels[gameLevel];


    if (levelName.hasOwnProperty('fieldSize')) {
        var level = {
            "width": levelName.fieldSize,
            "height": levelName.fieldSize,
            "minesCount": levelName.minesCount
        }
    }

    else {
        var level = {
            "width": levelName.fieldWidth,
            "height": levelName.fieldHeight,
            "minesCount": levelName.minesCount
        }
    }

    var button = document.getElementById('startGame');
    var canvas = document.getElementById('canvas');
    canvas.width = cellSize * level.width;
    canvas.height = cellSize * level.height;
    var flagsCounterElement = document.getElementById('minesLeft');
    var timeElement = document.getElementById('time');
    var ctx = canvas.getContext('2d');
    var mines = []
    var correctFlagsCount = 0;
    var flags = 0;
    let timer = new Timer(timeElement);
    let x1 = 0,
        x2 = cellSize,
        y1 = 0,
        y2 = cellSize;

    Engine.drawGameBoard(level, x1, x2, y1, y2, ctx);

    button.addEventListener('click', (e) => {

        if (button.textContent === 'Play again') {
            Engine.drawGameBoard(level, x1, x2, y1, y2, ctx);
        }

        timeElement.textContent = 0;
        button.style.display = 'none';
        mines = Engine.placeMines(level);
        flagsCounterElement.textContent = level.minesCount;
        Engine.placeNumbers(level, mines);
        timer.setTimer();

        console.log(mines)

        canvas.addEventListener('click', function clickHandler(e) {
            let rect = canvas.getBoundingClientRect();
            let mouseX = e.clientX - rect.left;
            let mouseY = e.clientY - rect.top;

            let currentCell = Engine.getCurrentCell(mouseX, mouseY)
            if (currentCell.Status !== 'marked') {
                currentCell.isClicked = true;
                if (mines.includes(currentCell.ID)) {
                    Engine.endGame(ctx, mines);
                    canvas.removeEventListener('click', clickHandler);
                    canvas.removeEventListener('contextmenu', rightClickHandler);
                    timer.stopTimer();
                    button.style.display = 'initial';
                    button.textContent = 'Play again';
                    flags = 0;
                    correctFlagsCount = 0;
                }

                else {
                    let minesAround = currentCell.minesAround;
                    if (minesAround > 0) {
                        Engine.displayCellImage(ctx, currentCell, currentCell.minesAround);
                    }
                    else {
                        Engine.revealEmptyCells(level, ctx, currentCell, mines);
                    }
                }
            }

            //console.log(currentCell.ID)
        });

        canvas.addEventListener('contextmenu', rightClickHandler);

    });

    function rightClickHandler(e) {
        e.preventDefault();
        let rect = canvas.getBoundingClientRect();
        let mouseX = e.clientX - rect.left;
        let mouseY = e.clientY - rect.top;

        let currentCell = Engine.getCurrentCell(mouseX, mouseY)

        if (currentCell.isClicked === false) {
            if (currentCell.Status === 'unmarked' && flags < level.minesCount) {
                Engine.displayCellImage(ctx, currentCell, 'flag')
                currentCell.Status = 'marked';
                flags++;
                flagsCounterElement.textContent = level.minesCount - flags

                if (mines.includes(currentCell.ID)) {
                    correctFlagsCount++;
                }

                if (correctFlagsCount === level.minesCount) {
                    //alert("You won");
                    timer.stopTimer();
                    button.style.display = 'initial';
                    button.textContent = 'Play again';
                    flags = 0;
                    correctFlagsCount = 0;
                }
            }
            else if (currentCell.Status === 'marked') {
                Engine.fillCell(ctx, currentCell, '#34baeb')
                currentCell.Status = 'unmarked';
                flags--;
                flagsCounterElement.textContent = level.minesCount - flags

                if (mines.includes(currentCell.ID)) {
                    correctFlagsCount--;
                }
            }
        }
    }


    /* window.onpopstate = (event) => {
        let state = event.state;
        if (state){
            debugger
            
            window.location.href = state.url;
            location.reload();
        }
    } */
}

window.onpopstate = () => { 
    let url = window.location.href;
    history.replaceState({}, "", url);
    debugger;
    location.reload();
    console.log("hi")
}