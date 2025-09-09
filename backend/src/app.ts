import express from "express";
import cors from "cors";
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { todosRouter } from "./routes/todos";

type SwaggerRequest = {
  headers: Record<string, string>;
  method?: string;
  url?: string;
};

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Web Programming Hack - Todo API",
      version: "1.0.0",
      description: "API documentation for managing todos",
    },
    tags: [
      {
        name: "Todos",
        description: "Operations related to todo items",
      },
    ],
    components: {
      schemas: {
        Todo: {
          type: "object",
          properties: {
            id: { type: "string", description: "The unique ID of the todo" },
            title: { type: "string", description: "The title of the todo" },
            completed: {
              type: "boolean",
              description: "Whether the todo is completed",
            },
            date: {
              type: "string",
              format: "date-time",
              description: "The date associated with the todo",
            },
            priority: {
              type: "string",
              enum: ["LOW", "MEDIUM", "HIGH"],
              description: "The priority of the todo",
            },
          },
          required: ["id", "title", "completed", "date", "priority"],
        },
        NewTodo: {
          type: "object",
          properties: {
            title: { type: "string", description: "The title of the todo" },
            completed: {
              type: "boolean",
              default: false,
              description: "Whether the todo is completed",
            },
            date: {
              type: "string",
              format: "date-time",
              nullable: true,
              description: "Optional due date",
            },
            priority: {
              type: "string",
              enum: ["LOW", "MEDIUM", "HIGH"],
              default: "MEDIUM",
              description: "Priority level of the todo",
            },
          },
          required: ["title"],
        },
      },
    },
  },
  apis: ["./src/routes/todos/*.ts"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

export const app = express();

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        process.env.FRONTEND_URL || 'https://todolist-fullstack-eta.vercel.app',
        'https://todolist-fullstack-eta.vercel.app',
        'https://todolist-fullstack-fbek9vchy-senas-projects-56c0899a.vercel.app' // Add any other Vercel URLs
      ]
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(
  "/swagger-ui.css",
  express.static(path.join(__dirname, "css/swagger-ui.css"))
);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, {
    customCssUrl: "/swagger-ui.css",
    customSiteTitle: "Todo API Documentation",
    swaggerOptions: {
      requestInterceptor: (req: SwaggerRequest) => {
        console.log("Intercepting request:", req);
        req.headers["api-key"] = "0ICVyrNhPL56Oss58qv-_y42PhSQvYcPm6Vz26j4bNw";
        return req;
      },
    },
  })
);

app.use("/api/todos", todosRouter);

// Only listen when not in serverless environment
if (require.main === module) {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  });
}
