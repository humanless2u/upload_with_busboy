const http = require("http");
const socketio = require("socket.io");
const { logger } = require("./util");
const Routes = require("./Routes");
const PORT = 3000;

// Route handler
const handler = (request, response) => {
  const defaultRoute = async (request, response) => {
    response.end("Hello!");
  };

  const routes = new Routes(io);
  const chosen = routes[request.method.toLowerCase()] || defaultRoute;

  return chosen.apply(routes, [request, response]);
};

// Creating server
const server = http.createServer(handler);

//socket io config
const io = socketio(server, {
  cors: {
    origin: "*",
    credentials: false,
  },
});
io.on("connection", (socket) => logger.info("Client socket ID: " + socket.id));

// Starting server
const startServer = () => {
  const { address, port } = server.address();
  logger.info(`App is running at http://${address}:${port}`);
};

server.listen(PORT, startServer);
