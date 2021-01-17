const logger = require("pino")({
  prettyPrint: {
    ignore: "pid, hostname",
  },
});

const promisefy = require("util").promisify;
const { pipeline } = require("stream");

const pipelineAsync = promisefy(pipeline);

module.exports = { logger, pipelineAsync, promisefy };
