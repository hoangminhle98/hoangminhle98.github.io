let board = null;
let ai = null;
let animating = false;
// the only thing connecting HTML and JS
document.addEventListener("DOMContentLoaded", async () => {
    resetGame();
});
async function resetGame() {
    if (board) board.delete();
    board = new Board(document.getElementById('board'), onClickFn);
    animating = true;
    board.showAnimation().then(() => {
        animating = false;
    });
    ai = new AI(board);

}

function onClickFn(y,x) {

    return async function(event) {
        // clicking does nothing when showing animation or when bot is thinking
        if (animating || document.querySelector('#board').classList.contains('thinking')) {
            return;
        }
        // user clicked on occupied square
        if (!board.makeMove(x,y, 1)) return;
        let humanScore = ai.getScore( true, false);
        console.log( "humanScore:::", humanScore);
        if ( humanScore >= WIN_SCORE) {
          onGameOver(1);
          return;
        }
        let [xx, yy] = ai.getNextMove();
        console.log(xx, yy)
        board.makeMove(xx, yy,-1);
        let AIScore = ai.getScore( false , true);
        console.log("AIScore:::", AIScore);
        if ( AIScore >= WIN_SCORE) {
          onGameOver(-1);
        }
    };
}
function onGameOver(player) {
    let text = `${player > 0 ? 'human' : 'AI'} is the winner!`
    console.log(text)
    document.querySelector('.overlay .message').textContent  = text;
    document.querySelector('.overlay').style.display = 'block';
    document.querySelector('.overlay .gameover').style.display = 'block';
}


// function firstFunction() {
//   return new Promise((resolve, reject) => {
//     let y = 0
//     setTimeout(() => {
//       for(i=0; i<10; i++){
//         y++
//       }
//       console.log('loop completed')
//       resolve(y)
//     }, 2000)
//   })
// }
// this.board.getRawMatrix()[y][x] = -1;
// this.board.getOccupiedSquares().push(move);
// let tempMove = this.minimaxSearch(depth - 1, !max, alpha, beta);
// this.board.getOccupiedSquares().pop();
// this.board.getRawMatrix()[y][x] = 0;
