function areNeighbours(cell1, cell2) {
    //return cell1.X1 === cell2.X2 || cell1.Y1 === cell2.Y2 || cell1.X2 === cell2.X1 || cell1.Y2 === cell2.Y1
    /* ;
    
    //return (cell1.X1 === cell2.cell2BottomLeft[0] && cell1.Y2 === )
    
    /* return (cell1.Y1 === cell2.Y1 && cell1.Y2 === cell2.Y2) || 
           (cell1.X2 === cell2.X2 && cell1.X1 === cell2.X2) || 
           (cell1.X1 + Constants.cellSize === cell2.X1 && cell1.X2 + Constants.cellSize === cell2.X2 &&
            cell1.Y1 + Constants.cellSize === cell2.Y1 && cell1.Y2 + Constants.cellSize === cell2.Y2) */

    /* return (cell1.Y1 === cell2.Y1 && cell1.Y2 === cell2.Y2) || (cell1.X1 === cell2.X1 && cell1.X2 === cell2.X2) ||
           (cell1.X2 === cell2.X1 && cell1.Y2 === cell2.Y1) */
    let cell1BottomLeft = [cell1.X1, cell1.Y2]
    let cell1TopRight = [cell1.X2, cell1.Y1];
    let cell2BottomLeft = [cell2.X1, cell2.Y2];
    let cell2TopRight = [cell2.X2, cell2.Y1];

    return (cell1.X1 === cell2TopRight[0] && cell1.Y1 === cell2TopRight[1])
        || (cell1.X1 === cell2BottomLeft[0] && cell1.Y1 === cell2BottomLeft[1])
        || (cell1.X1 === cell2.X2 && cell1.Y1 === cell2.Y2)
        || (cell1TopRight[0] === cell2.X1 && cell1TopRight[1] === cell2.Y1)
        || (cell1TopRight[0] === cell2.X2 && cell1TopRight[1] === cell2.Y2)
        || (cell1TopRight[0] === cell2BottomLeft[0] && cell1TopRight[1] === cell2BottomLeft[1])
        || (cell1.X2 === cell2TopRight[0] && cell1.Y2 === cell2TopRight[1])
        || (cell1.X2 === cell2.X1 && cell1.Y2 === cell2.Y1)
        || (cell1.X2 === cell2BottomLeft[0] && cell1.Y2 === cell2BottomLeft[1])
        || (cell1BottomLeft[0] === cell2TopRight[0] && cell1BottomLeft[1] === cell2TopRight[1])
        || (cell1BottomLeft[0] === cell2.X1 && cell1BottomLeft[1] === cell2.Y1)
        || (cell1BottomLeft[0] === cell2TopRight[0] && cell1.X2 === cell2.Y2)

}