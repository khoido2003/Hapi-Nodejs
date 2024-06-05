// const Boom = require("@hapi/boom");

const errorController = (server) => {
  server.ext("onPreResponse", (req, h) => {
    const { response } = req;

    if (response.isBoom && process.env.NODE_ENV === "production") {
      let errorMessage;
      let statusCode;

      // Handle duplicate key when create new data in mongodb
      if (response.data.error.errorResponse.code === 11000) {
        statusCode = 400;

        errorMessage = `Duplicate field value: ${Object.keys(response.data.error.errorResponse.keyValue)[0]}. Please use another value! `;
      }

      // Only return the generic error message in production
      const errorOutput = response.output.payload;
      const errorDetails = {
        statusCode: statusCode || errorOutput.statusCode,
        error: errorOutput.error,
        message: errorMessage || errorOutput.message,
        data: errorOutput.data,
      };

      return h
        .response(errorDetails)
        .code(statusCode || response.output.statusCode);
    }

    if (response.isBoom && process.env.NODE_ENV === "development") {
      // Return all the information of the error message in development mode
      const errorOutput = response.output.payload;
      const errorDetails = {
        statusCode: errorOutput.statusCode,
        error: errorOutput.error,
        message: errorOutput.message,
        data: errorOutput.data,
        ...(response.data && { data: response.data }),
      };

      return h.response(errorDetails).code(response.output.statusCode);
    }

    return h.continue;
  });
};

module.exports = errorController;
