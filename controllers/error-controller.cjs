// const Boom = require("@hapi/boom");

// Generate meaningful error messages for hapi/boom errors library

const errorController = (server) => {
  server.ext("onPreResponse", (req, h) => {
    const { response } = req;

    // console.log("===============================");
    // console.log("===============================");
    // console.log("===============================");
    // console.log("===============================");
    // console.log("ERROR INPUT: ", response);

    let errorMessage;
    let statusCode;

    // Handle when user is not authenticated (Token is not exist in cookie or headers then this error will be triggered)
    if (
      response.output &&
      response.output.payload.error === "Unauthorized" &&
      response.output.statusCode === 401
    ) {
      statusCode = 401;
      errorMessage = "You are not logged in! Please log in to view this route.";

      return h.response({ statusCode, errorMessage }).code(statusCode);
    }

    ////////////////////////////////////

    // PRODUCTION ERROR
    if (response.isBoom && process.env.NODE_ENV === "production") {
      //

      // Handle duplicate key when create new data in mongodb
      if (
        response.data &&
        response.data.error.errorResponse &&
        response.data.error.errorResponse.code === 11000
      ) {
        statusCode = 400;

        errorMessage = `Duplicate field value: ${Object.keys(response.data.error.errorResponse.keyValue)[0]}. Please use another value! `;
      }

      // Handle when the objectId in mongoDB is not in correct format
      if (response.data && response.data.error.kind === "ObjectId") {
        errorMessage = `Invalid ${response.data.error.path}: ${response.data.error.value}`;
        statusCode = 400;
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

    ///////////////////////////////////

    // DEVELOPMENT ERROR

    // Return all the information of the error message in development mode
    if (response.isBoom && process.env.NODE_ENV === "development") {
      const errorOutput = response.output.payload;

      console.log(errorOutput);

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
