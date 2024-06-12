"use strict";

const { API_PREFIX } = require("../constants/route.cjs");
const {
  signUp,
  logout,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require("../controllers/auth-controller.cjs");
const { getAllUsers } = require("../controllers/user.cjs");

const userRoutes = [
  {
    method: "GET",
    path: `${API_PREFIX}/users`,
    handler: getAllUsers,
    options: {
      auth: false,
    },
  },

  // Sign up new user
  {
    method: "POST",
    path: `${API_PREFIX}/signup`,
    handler: signUp,
    options: {
      auth: false,
    },
  },

  // logout
  {
    method: "GET",
    path: `${API_PREFIX}/logout`,
    handler: logout,
    options: {
      auth: false,
    },
  },

  // login
  {
    method: "POST",
    path: `${API_PREFIX}/signin`,
    handler: login,
    options: {
      auth: false, // Disable authentication for the signup route
    },
  },

  // Access when forgot password
  {
    method: "POST",
    path: `${API_PREFIX}/forgotPassword`,
    handler: forgotPassword,
    options: {
      auth: false,
    },
  },

  // Reset password
  {
    method: "POST",
    path: `${API_PREFIX}/resetPassword/{token}`,
    handler: resetPassword,
    options: {
      auth: false,
    },
  },

  // Update password
  {
    method: "PATCH",
    path: `${API_PREFIX}/updatePassword/{id}`,
    handler: updatePassword,
    options: {
      auth: false,
    },
  },
];

module.exports = userRoutes;
