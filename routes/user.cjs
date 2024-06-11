"use strict";

const { signUp, logout, login } = require("../controllers/auth-controller.cjs");

const userRoutes = [
  {
    method: "POST",
    path: "/api/v1/signup",
    handler: signUp,
  },

  {
    method: "GET",
    path: "/api/v1/logout",
    handler: logout,
  },

  {
    method: "POST",
    path: "/api/v1/signin",
    handler: login,
    options: {
      auth: false, // Disable authentication for the signup route
    },
  },
];

module.exports = userRoutes;
