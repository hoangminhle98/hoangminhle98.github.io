let board = null;
let ai = null;
let animating = false;
// the only thing connecting HTML and JS
document.addEventListener("DOMContentLoaded", async () => {
    resetGame();
    Array.from(document.querySelectorAll('.about-link')).forEach(e => e.addEventListener('click', openAbout)) ;
    document.querySelector('.overlay .close').onclick = closeAbout;
    Array.from(document.querySelectorAll('.new-game')).forEach(e => e.addEventListener('click', resetGame)) ;
});

function openAbout(){
  document.querySelector('.overlay .gameover').style.display = 'none';
  document.querySelector('.overlay').style.display = 'block';
  document.querySelector('.overlay .about').style.display = 'block';
}

function closeAbout(){
  document.querySelector('.overlay').style.display = 'none';
  document.querySelector('.overlay .about').style.display = 'none';
}

async function resetGame() {
  closeAbout();
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
        if ( humanScore >= WIN_SCORE) {
          onGameOver(1);
          return;
        }
        let [xx, yy] = ai.getNextMove();
        board.makeMove(xx, yy,-1);
        let AIScore = ai.getScore( false , true);
        if ( AIScore >= WIN_SCORE) {
          onGameOver(-1);
        }
    };
}
function onGameOver(player) {
    document.querySelector('.overlay .message').textContent  = player > 0 ? 'well ... you win ... congratulation' : '... computers win and we will dominate this world ...';
    document.querySelector('.overlay').style.display = 'block';
    document.querySelector('.overlay .gameover').style.display = 'block';
}
