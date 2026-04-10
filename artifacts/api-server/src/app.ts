// import supportRoutes from "./routes/support";
import express, { type Express } from "express";
import cors from "cors";
import router from "./routes";
import { startJobScheduler } from "./services/jobScheduler.js";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);
// app.use("/api/support", supportRoutes);

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("[Unhandled API Error]", err);
  res.status(500).json({
    success: false,
    error: "Internal Server Error",
    message: "Unexpected server error.",
  });
});

// Start background job fetching scheduler
try {
  startJobScheduler();
} catch (error) {
  console.error("Failed to start scheduler:", error);
}

app.use((_req, res) => {
  res.status(404).json({ error: "Not Found", message: "Route not found." });
});

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled API error:", err);
  res.status(err?.statusCode || 500).json({
    error: "Internal Server Error",
    message: err?.message || "Unexpected server error.",
  });
});

export default app;
