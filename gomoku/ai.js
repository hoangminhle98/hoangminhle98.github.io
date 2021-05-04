const depth = 3;
const WIN_SCORE = 100000000;
class AI {
  constructor(board) {
    this.board = board;
  }
  getNextMove() {
    let bestMove = this.getWinningMove();
    // finishing move to end game for AI
    if (bestMove) return bestMove;
    let [score, xx, yy] = this.minimaxSearch(depth, true, -1.0, WIN_SCORE);
    return [xx,yy];
  }
  /* return finishing move for AI */
  getWinningMove() {
    let possibleMoves = this.board.generateMoves();
    for(let move of possibleMoves) {
      let [x,y] = move;
      this.board.makeFakeMove(move, -1);
      if (this.getScore(false, false) >= WIN_SCORE) {
        this.board.retrieveMove();
        return move;
      }
      this.board.retrieveMove();
    }
    return null;
  }

  /*
  alpha denotes best move for AI
  beta denotes best move for human
  return: [bestScore, x, y]
  */
  minimaxSearch(depth, max, alpha, beta) {
    let possibleMoves = this.board.generateMoves();
    // terminal node, or no possible move left --> static evaluate board for AI
    if (depth == 0 || possibleMoves.length == 0) {
      return [this.staticEvaluateForAI(!max), -1, -1];
    }
    let bestMove = new Array(3);

    if (max) { // maximizing player is playing (AI)
      bestMove[0] = -1; // bestScore set to Negative Inf
      for (let move of possibleMoves) {
        this.board.makeFakeMove(move, -1);
        let tempMove = this.minimaxSearch(depth - 1, !max, alpha, beta);
        this.board.retrieveMove();
        if (tempMove[0] > alpha) alpha = tempMove[0];
        // if (tempMove[0] >= beta*5) return tempMove;
        if (tempMove[0] > bestMove[0]) {
          bestMove[0] = tempMove[0];
          bestMove[1] = move[0];
          bestMove[2] = move[1];
        }
      }
    } else { // minimizing player is playing (human)
      bestMove[0] = 100000000; // bestScore set to Inf
      bestMove[1] = possibleMoves[0][0];
      bestMove[2] = possibleMoves[0][1];
      for (let move of possibleMoves) {
        this.board.makeFakeMove(move, 1);
        let tempMove = this.minimaxSearch(depth - 1, !max, alpha, beta);
        this.board.retrieveMove();
        if (tempMove[0] < alpha) alpha = tempMove[0];
        // if (tempMove[0] <= beta / 5) return tempMove;
        if (tempMove[0] < bestMove[0]) {
          bestMove[0] = tempMove[0];
          bestMove[1] = move[0];
          bestMove[2] = move[1];
        }
      }
    }
    return bestMove;
  }
  /*
   return the total score for all horizontal set of consecutive cells
   */

  evaluateHorizontal(forHuman, playerTurn) {
    let consecutive=0;
    let blocks = 2; // leftmost set of consecutive stones is blocked by border --> blocks set to 2
    let score = 0;
    let matrix = this.board.getRawMatrix();
    for (let i=0; i < SIZE; i++) {
      for (let j=0; j <  SIZE; j++) {
        if (matrix[i][j] == (forHuman ? 1 : -1)) {
          consecutive ++;
        } else if(matrix[i][j] == 0) {
          if (consecutive > 0) {
            blocks -= 1;
            score += this.getConsecutiveSetScore(consecutive, blocks, forHuman == playerTurn);
            consecutive = 0;
            blocks = 1;
          } else {
            blocks = 1;
          }
        } else if(consecutive > 0) {
          score += this.getConsecutiveSetScore(consecutive, blocks, forHuman == playerTurn);
          consecutive = 0;
          blocks = 2;
        }
        else {
          blocks = 2;
        }
      }
      if(consecutive > 0) {
        score += this.getConsecutiveSetScore(consecutive, blocks, forHuman == playerTurn);
      }
      consecutive = 0;
      blocks = 2;
    }
    return score;
  }



  /*
   return the total score for all vertical set of consecutive cells
   */
  evaluateVertical(forHuman, playerTurn) {
    let consecutive =0;
    let blocks = 2; // leftmost set of consecutive stones is blocked by border --> blocks set to 2
    let score = 0;
    let matrix = this.board.getRawMatrix();
    for (let j=0; j < SIZE; j++) {
      for (let i=0; i <  SIZE; i++) {
        if (matrix[i][j] == (forHuman ? 1 : -1)) {
          consecutive ++;
        } else if(matrix[i][j] == 0) {
          if (consecutive > 0) {
            blocks -= 1;
            score += this.getConsecutiveSetScore(consecutive, blocks, forHuman == playerTurn);
            consecutive = 0;
            blocks = 1;
          } else {
            blocks = 1;
          }
        } else if(consecutive > 0) {
          score += this.getConsecutiveSetScore(consecutive, blocks, forHuman == playerTurn);
          consecutive = 0;
          blocks = 2;
        }
        else {
          blocks = 2;
        }
      }
      if(consecutive > 0) {
        score += this.getConsecutiveSetScore(consecutive, blocks, forHuman == playerTurn);
      }
      consecutive = 0;
      blocks = 2;
    }
    return score;
  }
  evaluateDiagonal(forHuman, playerTurn) {
    let consecutive = 0;
    let blocks = 2; // leftmost set of consecutive stones is blocked by border --> blocks set to 2
    let score = 0;
    let matrix = this.board.getRawMatrix();
    for (let k = 0; k <= 2 * (SIZE - 1); k++) {
      let iStart = max(0, k - SIZE + 1);
      let iEnd = min(SIZE -1, k);
      for (let i=iStart; i <= iEnd; i++) {
        let j = k - i;
        if (matrix[i][j] == (forHuman ? 1 : -1)) {
          consecutive ++;
        } else if(matrix[i][j] == 0) {
          if (consecutive > 0) {
            // this consecutive set is not blocked by opponent, decrement blocks variable
            blocks -= 1;
            // get score of this current consecutive set
            score += this.getConsecutiveSetScore(consecutive, blocks, forHuman == playerTurn);
            // reset consecutive set with at most 1 blocked side (this side is free already)
            consecutive = 0;
            blocks = 1;
          } else {
            // no consecutive set of cells, next set having at most 1 blocked side
            blocks = 1;
          }
        } else if (consecutive > 0) {
          score += this.getConsecutiveSetScore(consecutive, blocks, forHuman == playerTurn);
          consecutive = 0;
          blocks = 2;
        } else {
          blocks = 2;
        }
      }
      if(consecutive > 0) {
        score += this.getConsecutiveSetScore(consecutive, blocks, forHuman == playerTurn);
      }
      consecutive = 0;
      blocks = 2;
    }

    for (let k = 1-SIZE; k <= SIZE-1; k++) {
      let iStart = max(0, k);
      let iEnd = min(SIZE+k-1, SIZE-1);
      for (let i=iStart; i < iEnd + 1; i++) {
        let j = i - k;
        if (matrix[i][j] == (forHuman ? 1 : -1)) {
          consecutive ++;
        } else if(matrix[i][j] == 0) {
          if (consecutive > 0) {
            // this consecutive set is not blocked by opponent, decrement blocks variable
            blocks -= 1;
            // get score of this current consecutive set
            score += this.getConsecutiveSetScore(consecutive, blocks, forHuman == playerTurn);
            // reset consecutive set with at most 1 blocked side (this side is free already)
            consecutive = 0;
            blocks = 1;
          } else {
            // no consecutive set of cells, next set having at most 1 blocked side
            blocks = 1;
          }
        } else if (consecutive > 0) {
          score += this.getConsecutiveSetScore(consecutive, blocks, forHuman == playerTurn);
          consecutive = 0;
          blocks = 2;
        } else {
          blocks = 2;
        }
      }
      if(consecutive > 0) {
        score += this.getConsecutiveSetScore(consecutive, blocks, forHuman == playerTurn);
      }
      consecutive = 0;
      blocks = 2;
    }

    return score;
  }

    /* assign score to a given consecutive set of marked cells */
  getConsecutiveSetScore(count, blocks, currentTurn) {
    const WIN_GUARANTEE = 1000000;
    // if both sides of set if blocked,this set is 0 point
    if (blocks == 2 && count < 5) return 0;
    switch(count) {
      case 5: return WIN_SCORE;
      case 4:
        if (currentTurn) return WIN_GUARANTEE;
        else {
          // 4 consecutive cells with neither side blocked --> will win in the next turn
          if (blocks == 0) return WIN_GUARANTEE/3;
          else return WIN_GUARANTEE/4;
        }
      case 3:
        if (blocks == 0) {
          // Neither side is blocked; will win in two turns
          // However opponent may win in the next turn
          if (currentTurn)return 50000;
          // opponents will block one side of the set
          else return 200;
        } else {
          if (currentTurn) return 10;
          else return 5;
        }
      case 2:{
        if (blocks == 0) {
          if (currentTurn) return 7;
          else return 5;
        } else {
          return 3;
        }
      }
      case 1: return 1;
    }
    // 5 in a row
    return WIN_SCORE*2;
  }

  getScore(forHuman, humanTurn) {
    let matrix = this.board.getRawMatrix();
    return  this.evaluateVertical(forHuman, humanTurn)
            + this.evaluateHorizontal(forHuman, humanTurn)
            + this.evaluateDiagonal(forHuman, humanTurn);
  }
  staticEvaluateForAI(humanTurn) {
    let humanScore = this.getScore(true, humanTurn);
    let AIScore = this.getScore(false, humanTurn);
    if (humanScore == 0) humanScore = 1;
    return AIScore / humanScore;
  }
}
