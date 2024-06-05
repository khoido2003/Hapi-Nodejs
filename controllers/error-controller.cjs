const Boom = require("@hapi/boom");

const errorController = (server) => {
  server.ext("onPreResponse", (req, h) => {
    const { response } = req;

    if (response.isBoom) {
      // Customize the error response\
      const errorOutput = response.output.payload;
      const errorDetails = {
        statusCode: errorOutput.statusCode,
        error: errorOutput.error,
        message: errorOutput.message,
        data: errorOutput.data,
      };
      console.log("Hi: ", errorOutput);

      return h.response(errorDetails).code(response.output.statusCode);
    }

    return h.continue;
  });
};

module.exports = errorController;
