const request = require("supertest");
const { Chess } = require("chess.js");
const { app } = require("../src/app");

describe("chess API", () => {
  test("GET /api/health returns ok", async () => {
    const response = await request(app).get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  test("GET /api/openapi.json returns swagger document", async () => {
    const response = await request(app).get("/api/openapi.json");
    expect(response.status).toBe(200);
    expect(response.body.openapi).toBe("3.0.3");
    expect(response.body.paths["/api/ai-move"].post).toBeTruthy();
  });

  test("POST /api/ai-move returns a legal move", async () => {
    const fen = "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1";
    const response = await request(app)
      .post("/api/ai-move")
      .send({ fen, difficulty: 1 });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    const chess = new Chess(fen);
    const move = chess.move(response.body.move);
    expect(move).toBeTruthy();
  });

  test("rejects invalid FEN", async () => {
    const response = await request(app)
      .post("/api/ai-move")
      .send({ fen: "not a fen", difficulty: 1 });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("INVALID_POSITION");
  });

  test("rejects difficulty outside 1-3", async () => {
    const response = await request(app)
      .post("/api/ai-move")
      .send({ fen: new Chess().fen(), difficulty: 4 });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("INVALID_REQUEST");
  });

  test("rejects finished games", async () => {
    const response = await request(app)
      .post("/api/ai-move")
      .send({
        fen: "rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3",
        difficulty: 1,
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("GAME_OVER");
  });
});
