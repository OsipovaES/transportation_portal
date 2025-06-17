import express from "express";
import { config } from "dotenv";

import usersRouter from "./routes/users.js";
import requestsRouter from "./routes/requests.js";

config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// API Routes
app.use("/api/users", usersRouter);
app.use("/api/requests", requestsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
