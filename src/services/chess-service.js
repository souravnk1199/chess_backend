const { Chess } = require("chess.js");

function createChess(fen) {
  try {
    return new Chess(fen);
  } catch (_error) {
    return null;
  }
}

module.exports = { createChess };
