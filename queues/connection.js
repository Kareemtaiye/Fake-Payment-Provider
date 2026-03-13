import IOredis from "ioredis";

const connection = new IOredis(
  {
    host: "127.0.0.1",
    port: 6379,
  },
  { maxRetriesPerRequest: null },
);

export default connection;
