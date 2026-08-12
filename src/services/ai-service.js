const { evaluateBoard } = require("./evaluation");

function normalizeDifficulty(difficulty) {
  const parsed = Number(difficulty);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 3) {
    return null;
  }
  return parsed;
}

function chooseAiMove(chess, depth) {
  const aiColor = chess.turn();
  const moves = orderedMoves(chess);
  let bestMove = null;
  let bestScore = Number.NEGATIVE_INFINITY;
  let alpha = Number.NEGATIVE_INFINITY;
  const beta = Number.POSITIVE_INFINITY;

  for (const move of moves) {
    chess.move(move);
    const score = minimax(chess, depth - 1, alpha, beta, false, aiColor);
    chess.undo();

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
    alpha = Math.max(alpha, bestScore);
  }

  return bestMove;
}

function minimax(chess, depth, alpha, beta, maximizing, aiColor) {
  if (depth === 0 || chess.isGameOver()) {
    return evaluateBoard(chess, aiColor);
  }

  const moves = orderedMoves(chess);

  if (maximizing) {
    let value = Number.NEGATIVE_INFINITY;
    for (const move of moves) {
      chess.move(move);
      value = Math.max(value, minimax(chess, depth - 1, alpha, beta, false, aiColor));
      chess.undo();
      alpha = Math.max(alpha, value);
      if (alpha >= beta) break;
    }
    return value;
  }

  let value = Number.POSITIVE_INFINITY;
  for (const move of moves) {
    chess.move(move);
    value = Math.min(value, minimax(chess, depth - 1, alpha, beta, true, aiColor));
    chess.undo();
    beta = Math.min(beta, value);
    if (alpha >= beta) break;
  }
  return value;
}

function orderedMoves(chess) {
  return chess.moves({ verbose: true }).sort((a, b) => moveScore(b) - moveScore(a));
}

function moveScore(move) {
  let score = 0;
  if (move.captured) score += 1000;
  if (move.promotion) score += 900;
  if (move.san.includes("+")) score += 80;
  if (move.san.includes("#")) score += 100000;
  return score;
}

module.exports = { chooseAiMove, normalizeDifficulty };
