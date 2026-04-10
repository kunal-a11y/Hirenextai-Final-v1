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
startJobScheduler();

export default app;
