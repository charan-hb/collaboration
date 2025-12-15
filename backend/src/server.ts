import http from "http";
import { app } from "./app";
import { env } from "./config/env";
import { registerSocketServer } from "./sockets";

const server = http.createServer(app);
registerSocketServer(server);

server.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${env.port}`);
});


