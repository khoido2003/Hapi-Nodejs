"use strict";

const Hapi = require("@hapi/hapi");
const mongoose = require("mongoose");

const routes = require("./routes/index.cjs");
const errorController = require("./controllers/error-controller.cjs");

// Read .env file
require("dotenv").config();

const init = async () => {
  const server = Hapi.server({
    port: process.env.HAPI_PORT || 8001,
    host: process.env.HAPI_HOST || "localhost",
  });

  // Define route here
  server.route(routes);

  // Handle global error
  errorController(server);

  await server.start();
  console.log(
    `Server running on port ${process.env.HAPI_PORT || 3000}: `,
    server.info.uri
  );

  // Handle unknown error
  process.on("unhandledRejection", (error) => {
    console.log(error);
    process.exit(1);
  });
};

// Connect to mongodb
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("MongoDB connect successfully!");
});

// Start the server
init();
