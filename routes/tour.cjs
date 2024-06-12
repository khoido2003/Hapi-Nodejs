"use strict";

const {
  getAllTours,
  createTour,
  topToursAlias,
  getTour,
  deleteTour,
  updateTour,
  getTourStats,
  getMonthlyPlans,
} = require("../controllers/tour.cjs");

const { API_PREFIX } = require("../constants/route.cjs");
const { restrictTo } = require("../controllers/auth-controller.cjs");

// Get all tours
const tourRoutes = [
  {
    method: "GET",
    path: `${API_PREFIX}/tours`,
    handler: getAllTours,
    options: {
      // auth: {
      //   strategies: ["jwt-bearer", "jwt-cookie"],
      // },
      // pre: [restrictTo("user")],
    },
  },

  // Get a single tour
  {
    method: "GET",
    path: `${API_PREFIX}/tours/{id}`,
    handler: getTour,
  },

  //  Create a new tour
  {
    method: "POST",
    path: `${API_PREFIX}/tours`,
    handler: createTour,
    options: {
      pre: [restrictTo("admin", "lead-guide")],
    },
  },

  // Delete a tour
  {
    method: "DELETE",
    path: `${API_PREFIX}/tours/{id}`,
    handler: deleteTour,
    options: {
      pre: [restrictTo("admin", "lead-guide")],
    },
  },
  {
    method: "PATCH",
    path: `${API_PREFIX}/tours/{id}`,
    handler: updateTour,
  },

  // Get the top 5 tour
  {
    method: "GET",
    path: `${API_PREFIX}/top-5-tours`,
    handler: getAllTours,
    options: {
      pre: [topToursAlias],
    },
  },

  // Get tour stats
  {
    method: "GET",
    path: `${API_PREFIX}/tour-stats`,
    handler: getTourStats,
  },

  // Get monthly plan
  {
    method: "GET",
    path: `${API_PREFIX}/monthly-plan/{year}`,
    handler: getMonthlyPlans,
    options: {
      pre: [restrictTo("admin")],
    },
  },
];

module.exports = tourRoutes;
