import IOredis from "ioredis";

const connection = new IOredis(
  {
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6380,
  },
  { maxRetriesPerRequest: null },
);

export default connection;
