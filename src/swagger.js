const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Chess Backend API",
    version: "1.0.0",
    description:
      "HTTP API for the Flutter chess web application. It validates chess positions and returns legal computer moves for player-vs-computer games.",
  },
  servers: [
    {
      url: "http://localhost:5001",
      description: "Local development server",
    },
  ],
  tags: [
    {
      name: "System",
      description: "Operational endpoints.",
    },
    {
      name: "Chess",
      description: "Chess engine and computer move endpoints.",
    },
  ],
  paths: {
    "/api/health": {
      get: {
        tags: ["System"],
        summary: "Check API health",
        operationId: "getHealth",
        responses: {
          200: {
            description: "The API is running.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HealthResponse" },
                examples: {
                  ok: {
                    value: { status: "ok" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/ai-move": {
      post: {
        tags: ["Chess"],
        summary: "Get a computer move",
        operationId: "createAiMove",
        description:
          "Returns a legal move for the side to move in the provided FEN. The difficulty value controls minimax search depth from 1 to 3.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AiMoveRequest" },
              examples: {
                blackToMove: {
                  value: {
                    fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
                    difficulty: 2,
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "A legal move was found.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AiMoveResponse" },
                examples: {
                  success: {
                    value: {
                      success: true,
                      move: {
                        from: "e7",
                        to: "e5",
                        promotion: null,
                        san: "e5",
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description:
              "The request is invalid, the position is invalid or finished, or no legal move exists.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                examples: {
                  invalidRequest: {
                    value: { success: false, error: "INVALID_REQUEST" },
                  },
                  invalidPosition: {
                    value: { success: false, error: "INVALID_POSITION" },
                  },
                  gameOver: {
                    value: { success: false, error: "GAME_OVER" },
                  },
                  noLegalMoves: {
                    value: { success: false, error: "NO_LEGAL_MOVES" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/openapi.json": {
      get: {
        tags: ["System"],
        summary: "Get the OpenAPI document",
        operationId: "getOpenApiDocument",
        responses: {
          200: {
            description: "OpenAPI 3.0 document for this service.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      HealthResponse: {
        type: "object",
        required: ["status"],
        properties: {
          status: {
            type: "string",
            enum: ["ok"],
          },
        },
      },
      AiMoveRequest: {
        type: "object",
        required: ["fen", "difficulty"],
        properties: {
          fen: {
            type: "string",
            description:
              "Forsyth-Edwards Notation describing the current chess position.",
            example:
              "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
          },
          difficulty: {
            type: "integer",
            minimum: 1,
            maximum: 3,
            description: "AI search depth: 1 = easy, 2 = medium, 3 = hard.",
            example: 2,
          },
        },
      },
      AiMoveResponse: {
        type: "object",
        required: ["success", "move"],
        properties: {
          success: {
            type: "boolean",
            enum: [true],
          },
          move: {
            $ref: "#/components/schemas/ChessMove",
          },
        },
      },
      ChessMove: {
        type: "object",
        required: ["from", "to", "promotion", "san"],
        properties: {
          from: {
            type: "string",
            minLength: 2,
            maxLength: 2,
            example: "e7",
          },
          to: {
            type: "string",
            minLength: 2,
            maxLength: 2,
            example: "e5",
          },
          promotion: {
            nullable: true,
            type: "string",
            enum: ["q", "r", "b", "n"],
            description: "Promotion piece, or null for non-promotion moves.",
          },
          san: {
            type: "string",
            description: "Standard Algebraic Notation for the move.",
            example: "e5",
          },
        },
      },
      ErrorResponse: {
        type: "object",
        required: ["success", "error"],
        properties: {
          success: {
            type: "boolean",
            enum: [false],
          },
          error: {
            type: "string",
            enum: [
              "INVALID_REQUEST",
              "INVALID_POSITION",
              "GAME_OVER",
              "NO_LEGAL_MOVES",
            ],
          },
        },
      },
    },
  },
};

module.exports = { openApiDocument };
