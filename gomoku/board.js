// Player 1 == HUMAN; Player -1 == AI

const SIZE = 10;
const IN_A_ROW = 5;
let min = Math.min;
let max = Math.max;
class Board {
    constructor(parentNode, onSquareClickedFn) {
        this.rawMatrix = new Array(SIZE);
        this.occupiedSquares = [];
        for (let i=0; i<SIZE; ++i) {
            let a = new Array(SIZE);
            for (let j=0; j<SIZE; ++j) a[j] = 0;
            this.rawMatrix[i] = a;
        }
        this.matrix = []; // 2-D array containing square objects
        this.parentNode = parentNode; // corresponds to id='board' in main.js

        // generate the board
        for (let i=0; i < SIZE; i++) {
            let r = [];
            let row = document.createElement("div");
            row.classList.add("row");

            for (let j=0; j < SIZE; j++) {
                let square = new Square(i, j); // create a square OBJECT
                square.setOnClick(onSquareClickedFn(i, j));
                r.push(square);    // append it to row
                row.appendChild(square.domObj);
            }
            this.matrix.push(r);
            this.parentNode.appendChild(row);
        }
    }
    delete() {
        this.parentNode.innerHTML = "";
    }

    getSquare(x,y) {
        return this.matrix[y][x];
    }

    getRawMatrix() {
        return this.rawMatrix;
    }
    makeMove(x, y, player) {
      let square = board.getSquare(x,y);
      if (square.isOccupied()) {
        return false;
      }
      square.setVal(player);
      if (player === 1) square.humanSelect();
      else square.cpuSelect();
      this.rawMatrix[y][x] = player;

      this.occupiedSquares.push([x,y]);
      return true;
    }
    makeFakeMove(move, player) {
      let [x,y] = move;
      this.rawMatrix[y][x] = player;
      this.occupiedSquares.push(move);
    }

    retrieveMove() {
      let [x,y] = this.occupiedSquares.pop();
      this.rawMatrix[y][x] = 0;
    }

    checkWinner(x,y) {
        return this.count(x,y,1,0) + this.count(x,y,-1,0) > IN_A_ROW
            || this.count(x,y,0,1) + this.count(x,y,0,-1) > IN_A_ROW
            || this.count(x,y,1,1) + this.count(x,y,-1,-1) > IN_A_ROW
            || this.count(x,y,1,-1) + this.count(x,y,-1,1) > IN_A_ROW;
    }
    // count consecutive squares in [dx, dy] direction
    count(x, y, dx, dy) {
      let player = this.rawMatrix[y][x];
      let count = 0;
      while ( min(x,y) > -1 && max(x,y) < SIZE && this.rawMatrix[y][x] === player) {
        count += 1;
        x += dx;
        y += dy;
      }
      return count;
    }

    getOccupiedSquares() {
      return this.occupiedSquares;
    }
    // Possible moves are squares that are adjacent to at least one occupied square
    generateMoves() {
      const dx = [-1,0,1];
      const dy = [-1,0,1]
      // dummy matrix of the marked cells
      let dummyMatrix = this.rawMatrix.map(function(arr) {
        return arr.slice();
      });
      const possibleMoves = [];
      for (let square of this.occupiedSquares) {
        let x = square[0];
        let y = square[1];
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            let xx = x + dx[i];
            let yy = y + dy[j];
            if (min(xx, yy) > -1 && max(xx, yy) < SIZE && !dummyMatrix[yy][xx]) {
              possibleMoves.push([xx, yy]);
              dummyMatrix[yy][xx] = 1;
            }
          }
        }
      }
      return possibleMoves;
    }




    showAnimation() {
        return new Promise( async (resolve, reject) => {
            let squareList = [...Array(SIZE * SIZE).keys()];
            squareList.sort(() => Math.random() - 0.5);

            //twinkle 10 cells at a time
            for(let i=0; i < squareList.length; i+=SIZE) {
                let promises = [...Array(SIZE).keys()];
                // map a number of cells to promises --> these cells twinkle at the same time
                // Promise.all() allows us to send all requests at the same time.
                promises = promises.map(a => {
                    let idx = squareList[i+a];
                    let x = idx % SIZE, y = Math.floor(idx / SIZE);
                    return this.matrix[x][y].twinkle();
                });
                await Promise.all(promises);
            }
            squareList.sort(() => Math.random() - 0.5);
            for(let i=0; i < squareList.length; i+=SIZE) {
                let promises = [...Array(SIZE).keys()];
                // map a number of cells to promises --> these cells twinkle at the same time
                // Promise.all() allows us to send all requests at the same time.
                promises = promises.map(a => {
                    let idx = squareList[i+a];
                    let x = idx % SIZE, y = Math.floor(idx / SIZE);
                    return this.matrix[x][y].untwinkle();
                });
                await Promise.all(promises);
            }
            resolve();
        })
    }
}
