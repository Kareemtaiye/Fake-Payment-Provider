import { config } from "dotenv";
config();

import app from "./app.js";
import pool from "./config/db.js";

const { PORT, NODE_ENV } = process.env;

const server = app.listen(PORT, () => {
  console.log(`Fake PP server running ${NODE_ENV} on port: ${PORT}`);
});

// process.on("SIGINT")
