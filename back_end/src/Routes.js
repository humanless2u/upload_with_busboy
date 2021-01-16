const ON_UPLOAD_EVENT = "file-uploaded";

const url = require("url");
class Routes {
  #io;
  constructor(io) {
    this.#io = io;
  }

  async post(request, response) {
    const { headers } = request;
    const {
      query: { socketId },
    } = url.parse(request.url, true);

    console.log("socket ID: ", socketId);
    this.#io.to(socketId).emit(ON_UPLOAD_EVENT, 5e6);

    const onFinish = (response, redirectTo) => {
      response.writeHead(303, {
        connection: "close",
        location: `${redirectTo}` + `?msg=files received with success`,
      });
      response.end();
    };

    return onFinish(response, headers.origin);
  }
}

module.exports = Routes;
