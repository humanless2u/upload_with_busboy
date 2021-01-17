const ON_UPLOAD_EVENT = "file-uploaded";
const url = require("url");
const UploadHandler = require("./uploadHandler");
const { logger, pipelineAsync } = require("./util");

class Routes {
  #io;
  constructor(io) {
    this.#io = io;
  }

  // Post route definition
  async post(request, response) {
    const { headers } = request;
    const {
      query: { socketId },
    } = url.parse(request.url, true);
    const redirectTo = headers.origin;

    logger.info("Upload envent ID: " + socketId);
    const uploadHandler = new UploadHandler(this.io, socketId);

    const onFinish = (response, redirectTo) => () => {
      response.writeHead(303, {
        connection: "close",
        location: `${redirectTo}` + `?msg=files received with success`,
      });
      response.end();
    };

    const busboyInstance = uploadHandler.registerEvents(
      headers,
      onFinish(response, redirectTo)
    );
    await pipelineAsync(request, busboyInstance);
    logger.info("Request finished with success");
  }
}

module.exports = Routes;
