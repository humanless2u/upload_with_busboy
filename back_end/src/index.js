const http = require("http");
const socketio = require("socket.io");
const Routes = require("./Routes");
const PORT = 3000;

const handler = (request, response) => {
  const defaultRoute = async (request, response) => {
    response.end("Hello!");
  };

  const routes = new Routes(io);
  const chosen = routes[request.method.toLowerCase()] || defaultRoute;

  return chosen.apply(routes, [request, response]);
};

const server = http.createServer(handler);

//socket io
const io = socketio(server, {
  cors: {
    origin: "*",
    credentials: false,
  },
});

io.on("connection", (socket) => console.log("someone connected", socket.id));

// const interval = setInterval(() => {
//   io.emit("file-uploaded", 5e6)
// }, 250)

const startServer = () => {
  const { address, port } = server.address();
  console.log(`App is running at http://${address}:${port}`);
};

server.listen(PORT, startServer);
