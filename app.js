import express from "express";
import cors from "cors";
import morgan from "morgan";

import merchantRouter from "./routes/merchantRoutes.js";
import globalErrHandler from "./middlewares/globalErrHandler.js";
import unhandledRoutes from "./middlewares/unhandledRoutes.js";

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(cors());

app.use("/api/v1/merchant", merchantRouter);

app.use(unhandledRoutes);
app.use(globalErrHandler);
export default app;
