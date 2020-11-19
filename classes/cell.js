export default class Cell{
    constructor(id, x1, x2, y1, y2){
        this.ID = id;
        this.X1 = x1;
        this.X2 = x2;
        this.Y1 = y1;
        this.Y2 = y2;
        this.Status = 'unmarked'
        this.minesAround = 0;
        this.shown = false;
        this.isClicked = false;
    }
}