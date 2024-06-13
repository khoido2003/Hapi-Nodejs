"use strict";

const { API_PREFIX } = require("../constants/route.cjs");
const {
  signUp,
  logout,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  restrictTo,
} = require("../controllers/auth-controller.cjs");

const {
  getAllUsers,
  updateMe,
  deleteMe,
  getMe,
} = require("../controllers/user.cjs");

const userRoutes = [
  {
    method: "GET",
    path: `${API_PREFIX}/users`,
    handler: getAllUsers,

    options: {
      auth: {
        strategies: ["jwt-bearer", "jwt-cookie"],
      },
      pre: [restrictTo("admin")],
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
  },

  // Update password
  {
    method: "PATCH",
    path: `${API_PREFIX}/updatePassword/{id}`,
    handler: updatePassword,
  },

  // Get current user information
  {
    method: "GET",
    path: `${API_PREFIX}/getMe`,
    handler: getMe,
    options: {
      auth: {
        strategies: ["jwt-bearer", "jwt-cookie"],
      },
    },
  },

  // Update user information
  {
    method: "PATCH",
    path: `${API_PREFIX}/updateMe`,
    handler: updateMe,
    options: {
      auth: {
        strategies: ["jwt-bearer", "jwt-cookie"],
      },
    },
  },

  // Delete current user account
  {
    method: "PATCH",
    path: `${API_PREFIX}/deleteMe`,
    handler: deleteMe,
    options: {
      auth: {
        strategies: ["jwt-bearer", "jwt-cookie"],
      },
    },
  },
];

module.exports = userRoutes;
