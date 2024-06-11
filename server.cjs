"use strict";

const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");
const Cookie = require("@hapi/cookie");
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

  /////////////////////////////////////////////////////

  // Authentication and authorization
  await server.register([Jwt, Cookie]);

  // Handle bearer token stored in the request header

  // By default, hapi check the jwt token in the authentication header

  // verify: This object contains options for verifying the JWT token.

  // aud: The "audience" claim to verify. If set to false, the audience claim will not be verified.
  // iss: The "issuer" claim to verify. If set to false, the issuer claim will not be verified.
  // sub: The "subject" claim to verify. If set to false, the subject claim will not be verified.
  // nbf: If true, the "not before" claim will be verified.
  // exp: If true, the "expiration" claim will be verified.
  // maxAgeSec: Maximum allowed age for the token in seconds. Tokens older than this will be rejected.
  // timeSkewSec: Allowed clock skew for verifying the token's expiration time, in seconds.

  server.auth.strategy("jwt-bearer", "jwt", {
    keys: process.env.JWT_SECRET,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      nbf: true,
      exp: true,
      maxAgeSec: 14400, // 4 hours
      timeSkewSec: 15,
    },
    validate: (artifacts, req, h) => {
      return {
        isValid: true,
        credential: {
          user: artifacts.decoded.payload,
        },
      };
    },
  });

  // Handle jwt token stored in the cookie
  server.auth.strategy("jwt-cookie", "cookie", {
    cookie: {
      name: "jwt_cookie",
      password: process.env.JWT_SECRET,
      isSecure: process.env.NODE_ENV === "production",
      isHttpOnly: true,
      isSameSite: "Lax",
      ttl: process.env.JWT_COOKIE_EXPIRES_IN * 1 * 60 * 60 * 24 * 1000,
    },

    validate: async (req, session) => {
      try {
        // session will contain the jwt token stored in the cookie
        const decoded = Jwt.token.decode(session);

        return {
          isValid: true,
          credentials: {
            user: decoded.decoded.payload,
          },
        };
      } catch (err) {
        return {
          isValid: false,
        };
      }
    },
  });

  // Set the default authentication to cookie
  server.auth.default("jwt-cookie");

  //////////////////////////////////////////////////////////////

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
