const express = require("express");
const cors = require("cors");
const { chooseAiMove, normalizeDifficulty } = require("./services/ai-service");
const { createChess } = require("./services/chess-service");

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/ai-move", (req, res) => {
  const { fen, difficulty } = req.body || {};
  const depth = normalizeDifficulty(difficulty);

  if (!fen || depth == null) {
    return res.status(400).json({ success: false, error: "INVALID_REQUEST" });
  }

  const chess = createChess(fen);
  if (!chess) {
    return res.status(400).json({ success: false, error: "INVALID_POSITION" });
  }

  if (chess.isGameOver()) {
    return res.status(400).json({ success: false, error: "GAME_OVER" });
  }

  const move = chooseAiMove(chess, depth);
  if (!move) {
    return res.status(400).json({ success: false, error: "NO_LEGAL_MOVES" });
  }

  res.json({
    success: true,
    move: {
      from: move.from,
      to: move.to,
      promotion: move.promotion || null,
      san: move.san,
    },
  });
});

module.exports = { app };
