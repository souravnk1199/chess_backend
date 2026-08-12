# Chess Backend

Node.js backend for the Flutter chess web application. It exposes a small HTTP API that validates chess positions and returns legal computer moves for Player vs Computer games.

## Features

- Express API for local development and Firebase Functions deployment.
- Health endpoint for smoke checks.
- AI move endpoint that accepts FEN plus difficulty.
- Difficulty levels mapped to minimax depth `1`, `2` or `3`.
- Position validation through `chess.js`.
- Minimax search with alpha-beta pruning.
- Basic material and center-control board evaluation.
- Swagger/OpenAPI documentation served by the app.
- Jest and Supertest API coverage.

## Tech Stack

- Node.js `20`
- Express `5`
- Firebase Functions
- `chess.js`
- `swagger-ui-express`
- Jest
- Supertest

## Project Structure

```text
.
  index.js
  local-server.js
  firebase.json
  package.json
  src/
    app.js
    swagger.js
    services/
      ai-service.js
      chess-service.js
      evaluation.js
  test/
    api.test.js
```

## Prerequisites

- Node.js 20.
- npm.
- Firebase CLI for deployment later.

## Local Development

Install dependencies:

```bash
npm install
```

Start the local server:

```bash
PORT=5001 npm start
```

The API will be available at:

```text
http://localhost:5001
```

The included VS Code launch configuration starts `local-server.js` with `PORT=5001`.

## Swagger Documentation

Swagger UI:

```text
http://localhost:5001/api/docs
```

Raw OpenAPI document:

```text
http://localhost:5001/api/openapi.json
```

The OpenAPI spec lives in:

```text
src/swagger.js
```

## API Endpoints

### `GET /api/health`

Returns a simple health response.

Response:

```json
{
  "status": "ok"
}
```

### `POST /api/ai-move`

Returns a legal computer move for the side to move in the provided FEN.

Request body:

```json
{
  "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
  "difficulty": 2
}
```

Difficulty values:

- `1` - easy, shallowest search.
- `2` - medium.
- `3` - hard, deepest current search.

Success response:

```json
{
  "success": true,
  "move": {
    "from": "e7",
    "to": "e5",
    "promotion": null,
    "san": "e5"
  }
}
```

Error responses use HTTP `400`:

```json
{
  "success": false,
  "error": "INVALID_REQUEST"
}
```

Possible error codes:

- `INVALID_REQUEST` - missing FEN or difficulty is not an integer from `1` to `3`.
- `INVALID_POSITION` - the FEN cannot be parsed by `chess.js`.
- `GAME_OVER` - the submitted position is already finished.
- `NO_LEGAL_MOVES` - no legal move was found.

## AI Implementation

The backend treats the current side to move as the AI color. It orders legal moves by tactical priority, searches with minimax and alpha-beta pruning, and evaluates leaf positions using:

- Checkmate and draw detection.
- Material values.
- Small center-square bonus for `d4`, `e4`, `d5` and `e5`.

This is intentionally lightweight and deterministic enough for local web play.

## Testing

Run the backend test suite:

```bash
npm test
```

Tests cover:

- Health endpoint.
- OpenAPI JSON endpoint.
- Legal AI move generation.
- Invalid FEN handling.
- Invalid difficulty handling.
- Finished game rejection.

## Firebase Functions

`index.js` exports the Express app as a Firebase HTTPS function named `api`:

```js
exports.api = functions.https.onRequest(app);
```

`firebase.json` sets this repository as the Functions source:

```json
{
  "functions": {
    "source": "."
  }
}
```

Deploy later with:

```bash
firebase deploy --only functions
```

## Frontend Connection

During local development, run the Flutter frontend with:

```bash
fvm flutter run -d chrome --dart-define=API_BASE_URL=http://localhost:5001
```

After Firebase deployment, the frontend can call `/api/ai-move` relative to the hosted domain because the frontend Hosting config rewrites `/api/**` to the `api` function.
