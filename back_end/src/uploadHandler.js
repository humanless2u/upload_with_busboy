const Busboy = require("busboy");
const { logger, pipelineAsync } = require("./util");
const { join } = require("path");
const { createWriteStream } = require("fs");

class UploadHandler {
  #io;
  #socketId;
  constructor(io, socketId) {
    this.#io = io;
    this.#socketId = socketId;
  }

  #handleFileBytes(filename) {
    async function* handleData(data) {
      for await (const item of data) {
        const size = item.length;
        logger.info(
          `file [${filename}] got ${size} bytes to ${this.#socketId}`
        );
        yield item;
      }
    }
    return handleData.bind(this);
  }

  registerEvents(headers, onFinish) {
    const busboy = new Busboy({ headers });
    busboy.on("file", this.#onFile.bind(this));
    busboy.on("finish", onFinish);
    return busboy;
  }
  async #onFile(fieldname, file, filename) {
    const saveFileTo = join(__dirname, "../", "downloads", filename);
    logger.info("Uploading to : " + saveFileTo);

    await pipelineAsync(
      file,
      this.#handleFileBytes.apply(this, [filename]),
      createWriteStream(saveFileTo)
    );
    logger.info(`File [${filename} finished!]`);
  }
}

module.exports = UploadHandler;
