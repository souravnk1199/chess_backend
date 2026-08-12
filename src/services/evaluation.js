const pieceValues = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

const centerSquares = new Set(["d4", "e4", "d5", "e5"]);

function evaluateBoard(chess, aiColor) {
  if (chess.isCheckmate()) {
    return chess.turn() === aiColor ? -100000 : 100000;
  }

  if (chess.isDraw()) {
    return 0;
  }

  let score = 0;
  const board = chess.board();

  for (let rank = 0; rank < board.length; rank += 1) {
    for (let file = 0; file < board[rank].length; file += 1) {
      const piece = board[rank][file];
      if (!piece) continue;

      const square = `${"abcdefgh"[file]}${8 - rank}`;
      const material = pieceValues[piece.type] || 0;
      const positional = centerSquares.has(square) ? 12 : 0;
      const value = material + positional;
      score += piece.color === aiColor ? value : -value;
    }
  }

  return score;
}

module.exports = { evaluateBoard };
