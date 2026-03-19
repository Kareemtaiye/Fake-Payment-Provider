import { config } from "dotenv";
config();

import { Pool } from "pg";

// const { PG_HOST, PG_PORT, PG_USER, PG_PASS, PG_DB_LOCAL } = process.env;

// const pool = new Pool({
//   user: PG_USER,
//   password: PG_PASS,
//   host: PG_HOST,
//   port: PG_PORT,
//   database: PG_DB_LOCAL,
// });

//seperating local and docker env variables for better clarity and maintainability
const { DOCKER_PG_HOST, DOCKER_PG_PORT, DOCKER_PG_USER, DOCKER_PG_PASS, DOCKER_PG_DB } =
  process.env;

const pool = new Pool({
  user: DOCKER_PG_USER,
  password: DOCKER_PG_PASS,
  host: DOCKER_PG_HOST,
  port: DOCKER_PG_PORT,
  database: DOCKER_PG_DB,
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

// const { PG_HOST, PG_PORT, PG_USER, PG_PASS, PG_DB_LOCAL } = process.env;

// const pool = new Pool({
//   user: PG_USER,
//   password: PG_PASS,
//   host: PG_HOST,
//   port: PG_PORT,
//   database: PG_DB_LOCAL,
// });
