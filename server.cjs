"use strict";

const Hapi = require("@hapi/hapi");

require("dotenv").config();

const init = async () => {
  // Initialize the server
  const server = Hapi.server({
    port: process.env.HAPI_PORT || 8001,
    host: "localhost",
  });

  // Handle route requests
  server.route({
    method: "POST",
    path: "/api/hi",
    handler: (req, h) => {
      console.log(req.headers);

      // return {
      //   id: req.query.name,
      //   mes: "Hello, world",
      //   body: req.payload.name,
      //   cookie: req.state.name,
      // };
    },
  });

  server.ext("onPreResponse", function (req, h) {
    if (req.response.isBoom) {
      return h.continue;
    }

    req.response.header("vary", "x-customer-id");

    return h.continue;
  });

  await server.start();
  console.log(`Server running on port ${process.env.HAPI_PORT}`);
};

process.on("unhandledRejection", (error) => {
  console.log(error);
  process.exit(1);
});

init();
