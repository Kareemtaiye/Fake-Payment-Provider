import { config } from "dotenv";
config();

import { Pool } from "pg";

const { PG_HOST, PG_PORT, PG_USER, PG_PASS, PG_DB_LOCAL } = process.env;

const pool = new Pool({
  user: PG_USER,
  password: PG_PASS,
  host: PG_HOST,
  port: PG_PORT,
  database: PG_DB_LOCAL,
});

(async () => {
  try {
    await pool.connect();
    console.log("PG DB connected successfuly.");
  } catch (err) {
    console.log("PG connection failed. ERR:  ", err);
    process.exit(1);
  }
})();

pool.on("error", err => {
  console.error("Unexpected PG error", err);
  process.exit(1);
});

export default pool;
